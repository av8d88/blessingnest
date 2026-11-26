// BlessingNest global blessing-wall API (Cloudflare Worker + KV)
const ALLOWED_SITES = ["christian", "muslim", "hindu", "jewish", "buddhist", "chinese"];
const MAX_WISHES = 100;
const rateMap = new Map(); // ephemeral per-IP rate limiting

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

function rateLimited(ip) {
  const now = Date.now();
  const rec = rateMap.get(ip) || { n: 0, t: now };
  if (now - rec.t > 60000) { rec.n = 0; rec.t = now; }
  rec.n++;
  rateMap.set(ip, rec);
  return rec.n > 10;
}

async function getList(kv, site) {
  try {
    const v = await kv.get("wishes:" + site, { type: "json" });
    return Array.isArray(v) ? v : [];
  } catch (e) { return []; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors() });
    if (url.pathname !== "/api/wishes") return json({ error: "not found" }, 404);

    const site = clean(url.searchParams.get("site"), 20);
    if (!ALLOWED_SITES.includes(site)) return json({ error: "unknown site" }, 400);

    if (request.method === "GET") {
      const list = await getList(env.WALL, site);
      return json({ wishes: list.slice(0, 50) });
    }

    if (request.method === "POST") {
      const ip = request.headers.get("CF-Connecting-IP") || "anon";
      if (rateLimited(ip)) return json({ error: "slow down, the candles need a breath" }, 429);

      let body;
      try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
      const name = clean(body.name, 30) || "Anonymous";
      const text = clean(body.text, 120);
      if (!text) return json({ error: "empty wish" }, 400);
      if (/https?:\/\//i.test(text)) return json({ error: "no links in wishes" }, 400);

      const wish = { n: name, t: text, d: new Date().toISOString().slice(0, 10) };
      const list = await getList(env.WALL, site);
      list.unshift(wish);
      await env.WALL.put("wishes:" + site, JSON.stringify(list.slice(0, MAX_WISHES)));
      return json({ ok: true, wish });
    }

    return json({ error: "method not allowed" }, 405);
  },
};
