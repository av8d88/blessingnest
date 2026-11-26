// BlessingNest global blessing-wall API v2 (Cloudflare Worker + KV)
// Routes:
//   GET  /api/wishes?site=x            -> list wishes (with amen counts)
//   GET  /api/presets?site=x           -> preset blessing phrases
//   POST /api/wishes   {site,type:"free",text}            -> free wish (preset only)
//   POST /api/wishes   {site,type:"patron",name,text,txid,chain} -> donor wish, verified on-chain, >=10 USDT, one per txid
//   POST /api/amen     {site,id}                          -> help-pray once per IP per wish
const ALLOWED_SITES = ["christian", "muslim", "hindu", "jewish", "buddhist", "chinese"];
const MAX_WISHES = 100;
const MIN_PATRON_USDT = 10;
const TRC20_ADDR = "TJ7xmAQo2qUP3MTjKhag3zhRtXKg3pPP9H";
const ERC20_ADDR = "0xffed67d9c05208F171cf6b7823a0CB0B0Ad496Cd";
const rateMap = new Map();

function cors(extra) {
  return Object.assign({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }, extra || {});
}
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: cors({ "Content-Type": "application/json; charset=utf-8" }),
  });
}
function clean(s, max) {
  return String(s || "").replace(/[<>&"']/g, "").trim().slice(0, max);
}
function rateLimited(ip, limit) {
  const now = Date.now();
  const rec = rateMap.get(ip) || { n: 0, t: now };
  if (now - rec.t > 60000) { rec.n = 0; rec.t = now; }
  rec.n++;
  rateMap.set(ip, rec);
  return rec.n > limit;
}
async function getList(kv, site) {
  try {
    const v = await kv.get("wishes:" + site, { type: "json" });
    return Array.isArray(v) ? v : [];
  } catch (e) { return []; }
}
let presetsCache = null;
async function getPresets(env) {
  if (presetsCache) return presetsCache;
  try {
    presetsCache = await env.WALL.get("presets:all", { type: "json" }) || {};
  } catch (e) { presetsCache = {}; }
  return presetsCache;
}
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---- on-chain verification ----
async function verifyTrc20(txid) {
  try {
    const r = await fetch("https://api.trongrid.io/v1/accounts/" + TRC20_ADDR +
      "/transactions/trc20?only_to=true&limit=200");
    const d = await r.json();
    const t = (d.data || []).find(function (x) {
      return x.transaction_id === txid && x.token_info && x.token_info.symbol === "USDT" &&
        x.to === TRC20_ADDR && x.type === "Transfer";
    });
    return t ? { ok: true, amount: parseInt(t.value, 10) / 1e6, from: t.from } : { ok: false };
  } catch (e) { return { ok: false, error: "chain lookup failed" }; }
}
async function verifyErc20(txid) {
  try {
    const r = await fetch("https://api.ethplorer.io/getTxInfo/" + txid + "?apiKey=freekey");
    const d = await r.json();
    const ops = (d.operations || []).filter(function (o) {
      return o.tokenInfo && o.tokenInfo.symbol === "USDT" &&
        o.to && o.to.toLowerCase() === ERC20_ADDR.toLowerCase();
    });
    if (!ops.length) return { ok: false };
    const amt = ops.reduce(function (s, o) { return s + parseFloat(o.value); }, 0);
    return { ok: true, amount: amt, from: ops[0].from };
  } catch (e) { return { ok: false, error: "chain lookup failed" }; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors() });

    const site = clean(url.searchParams.get("site"), 20);
    const ip = request.headers.get("CF-Connecting-IP") || "anon";

    // ---- GET presets ----
    if (url.pathname === "/api/presets" && request.method === "GET") {
      if (!ALLOWED_SITES.includes(site)) return json({ error: "unknown site" }, 400);
      const p = await getPresets(env);
      return json({ presets: p[site] || [] });
    }

    // ---- GET wishes ----
    if (url.pathname === "/api/wishes" && request.method === "GET") {
      if (!ALLOWED_SITES.includes(site)) return json({ error: "unknown site" }, 400);
      const list = await getList(env.WALL, site);
      return json({ wishes: list.slice(0, 50) });
    }

    // ---- POST amen (help-pray) ----
    if (url.pathname === "/api/amen" && request.method === "POST") {
      if (!ALLOWED_SITES.includes(site)) return json({ error: "unknown site" }, 400);
      if (rateLimited("amen:" + ip, 30)) return json({ error: "slow down" }, 429);
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
      const id = clean(body.id, 24);
      if (!id) return json({ error: "missing id" }, 400);
      const lockKey = "amenlock:" + site + ":" + id + ":" + ip;
      if (await env.WALL.get(lockKey)) return json({ error: "already", code: "already" }, 200);
      const list = await getList(env.WALL, site);
      const w = list.find(function (x) { return x.id === id; });
      if (!w) return json({ error: "wish not found" }, 404);
      w.amen = (w.amen || 0) + 1;
      await env.WALL.put("wishes:" + site, JSON.stringify(list));
      await env.WALL.put(lockKey, "1", { expirationTtl: 2592000 });
      return json({ ok: true, amen: w.amen });
    }

    // ---- POST wish ----
    if (url.pathname === "/api/wishes" && request.method === "POST") {
      if (!ALLOWED_SITES.includes(site)) return json({ error: "unknown site" }, 400);
      if (rateLimited("post:" + ip, 10)) return json({ error: "slow down, the candles need a breath" }, 429);

      let body;
      try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
      const type = clean(body.type, 10) || "free";
      const textLimit = type === "patron" ? 60 : 140;
      const text = clean(body.text, textLimit);
      if (!text) return json({ error: "empty wish" }, 400);
      if (/https?:\/\//i.test(text)) return json({ error: "no links in wishes" }, 400);

      const list = await getList(env.WALL, site);

      if (type === "free") {
        // free wishes must come from the preset list
        const presets = (await getPresets(env))[site] || [];
        if (!presets.includes(text)) return json({ error: "free wishes must use preset blessings" }, 400);

        // multi-dimensional daily quota: IP-based + fingerprint-based (3/day each)
        const day = new Date().toISOString().slice(0, 10);
        const fp = clean(body.fp, 48);
        const ipKey = "quota:" + site + ":ip:" + ip + ":" + day;
        const fpKey = fp ? "quota:" + site + ":fp:" + fp + ":" + day : null;
        const ipCount = parseInt(await env.WALL.get(ipKey) || "0", 10);
        const fpCount = fpKey ? parseInt(await env.WALL.get(fpKey) || "0", 10) : 0;
        if (ipCount >= 3 || fpCount >= 3) {
          return json({ error: "Daily free blessing limit reached (3/day). Patron cards have no limit.", code: "quota" }, 429);
        }

        const wish = { id: newId(), n: body.name ? clean(body.name, 30) : "Anonymous", t: text,
          d: new Date().toISOString().slice(0, 10), ts: Date.now(), type: "free", amen: 0 };
        list.unshift(wish);
        await env.WALL.put("wishes:" + site, JSON.stringify(list.slice(0, MAX_WISHES)));
        await env.WALL.put(ipKey, String(ipCount + 1), { expirationTtl: 172800 });
        if (fpKey) await env.WALL.put(fpKey, String(fpCount + 1), { expirationTtl: 172800 });
        return json({ ok: true, wish, remaining: 2 - ipCount });
      }

      if (type === "patron") {
        const txid = clean(body.txid, 80);
        const chain = clean(body.chain, 10);
        if (!txid) return json({ error: "missing txid" }, 400);
        if (await env.WALL.get("used:" + txid)) {
          return json({ error: "This transaction has already been used for a patron card.", code: "used" }, 400);
        }
        let v;
        if (chain === "trc20") v = await verifyTrc20(txid);
        else if (chain === "erc20") v = await verifyErc20(txid);
        else return json({ error: "unknown chain" }, 400);
        if (!v.ok) return json({ error: "Transaction not found on-chain yet. Wait for confirmation and retry.", code: "unverified" }, 400);
        if (v.amount < MIN_PATRON_USDT) {
          return json({ error: "Patron cards require a donation of at least " + MIN_PATRON_USDT + " USDT. This transaction is " + v.amount.toFixed(2) + " USDT.", code: "too_small" }, 400);
        }
        const name = clean(body.name, 30) || (v.from ? v.from.slice(0, 6) + "…" + v.from.slice(-4) : "Patron");
        const wish = { id: newId(), n: name, t: text,
          d: new Date().toISOString().slice(0, 10), ts: Date.now(), type: "patron", amount: v.amount, chain, amen: 0 };
        list.unshift(wish);
        await env.WALL.put("wishes:" + site, JSON.stringify(list.slice(0, MAX_WISHES)));
        await env.WALL.put("used:" + txid, "1");
        return json({ ok: true, wish });
      }

      return json({ error: "unknown type" }, 400);
    }

    return json({ error: "not found" }, 404);
  },
};
