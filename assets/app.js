/* BlessingNest multi-faith engine v2 — reads window.FAITH + window.ADDR */
(function () {
  "use strict";
  var F = window.FAITH;
  var store = "bn_" + F.id + "_";
  var $ = function (id) { return document.getElementById(id); };

  // ===== Candles =====
  var stage = $("stage"), countEl = $("my-count");
  var myCount = parseInt(localStorage.getItem(store + "candles") || "0", 10);
  countEl.textContent = myCount;

  function addCandle() {
    var c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<div class="flame"></div><div class="wick"></div><div class="stick"></div>';
    stage.appendChild(c);
    var candles = stage.querySelectorAll(".candle");
    if (candles.length > 12) candles[0].remove();
  }
  for (var i = 0; i < Math.min(myCount, 6); i++) addCandle();

  $("light-btn").addEventListener("click", function () {
    var name = $("wish-name").value.trim();
    addCandle();
    myCount++;
    localStorage.setItem(store + "candles", String(myCount));
    countEl.textContent = myCount;
    if (name) showCert(name, null);
  });

  // ===== Daily verse =====
  var drawn = false;
  $("draw-btn").addEventListener("click", function () {
    var today = new Date().toDateString();
    if (localStorage.getItem(store + "drawn_date") === today && drawn) {
      $("verse-mean").textContent = F.onceDailyText;
      return;
    }
    var v = F.verses[Math.floor(Math.random() * F.verses.length)];
    $("verse-ref").textContent = v.ref;
    $("verse-text").textContent = v.text;
    $("verse-mean").textContent = v.mean;
    $("verse-result").classList.add("show");
    localStorage.setItem(store + "drawn_date", today);
    drawn = true;
  });

  // ===== Blessing wall (GLOBAL via CF Worker; free=preset only, patron=on-chain verified) =====
  var WALL_API = "https://blessing-wall.js8.workers.dev/api/wishes?site=" + F.id;
  var AMEN_API = "https://blessing-wall.js8.workers.dev/api/amen?site=" + F.id;
  var wallList = $("wall-list");
  var wallItems = [];
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function getVoted() {
    try { return JSON.parse(localStorage.getItem("bn_amen_voted") || "[]"); } catch (e) { return []; }
  }
  function markVoted(id) {
    var v = getVoted(); v.push(id);
    localStorage.setItem("bn_amen_voted", JSON.stringify(v));
  }

  function amenBtn(w) {
    var voted = getVoted().indexOf(w.id) >= 0;
    return '<button class="amen-btn" data-amen="' + w.id + '"' + (voted ? " disabled" : "") +
      '>' + F.amenLabel + ' <span>' + (w.amen || 0) + '</span></button>';
  }
  function cardHtml(w) {
    if (w.type === "patron") {
      return '<div class="wish patron"><span class="crown">👑</span><b>' + esc(w.n) + '</b>' +
        '<span class="pamount">$' + (w.amount || 0).toFixed(2) + '</span>' +
        '<small> · ' + w.d + '</small><p>' + esc(w.t) + '</p>' + amenBtn(w) + '</div>';
    }
    return '<div class="wish"><b>' + esc(w.n) + '</b><small> · ' + w.d + '</small><p>' + esc(w.t) + '</p>' + amenBtn(w) + '</div>';
  }
  function renderWall() {
    var html = "";
    wallItems.forEach(function (w) { html += cardHtml(w); });
    F.seeds.forEach(function (w) {
      html += '<div class="wish"><b>' + esc(w.n) + '</b><small> · ' + F.seedDate + '</small><p>' + esc(w.t) + '</p></div>';
    });
    wallList.innerHTML = html;
    wallList.querySelectorAll("[data-amen]").forEach(function (btn) {
      btn.addEventListener("click", function () { voteAmen(btn.getAttribute("data-amen"), btn); });
    });
  }
  function voteAmen(id, btn) {
    if (getVoted().indexOf(id) >= 0) return;
    btn.disabled = true;
    fetch(AMEN_API, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.amen !== undefined) btn.querySelector("span").textContent = d.amen;
      markVoted(id);
    }).catch(function () { btn.disabled = false; });
  }
  if (window.fetch) {
    fetch(WALL_API).then(function (r) { return r.json(); }).then(function (d) {
      wallItems = (d.wishes || []);
      renderWall();
    }).catch(function () { renderWall(); });
  } else { renderWall(); }

  // ===== Preset picker (free users: no typing) =====
  function renderPresets() {
    var box = $("preset-list");
    if (!box) return;
    var pool = F.presets.slice();
    var picks = [];
    while (picks.length < 6 && pool.length) {
      picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    box.innerHTML = picks.map(function (p) {
      return '<button class="preset-chip">' + esc(p) + '</button>';
    }).join("");
    box.querySelectorAll(".preset-chip").forEach(function (chip) {
      chip.addEventListener("click", function () { postFree(chip.textContent, chip); });
    });
  }
  function postFree(text, chip) {
    chip.disabled = true;
    fetch(WALL_API, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "free", text: text })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.wish) {
        wallItems.unshift(d.wish);
        renderWall();
        chip.classList.add("sent");
        chip.textContent = F.presetSentText;
      } else {
        chip.disabled = false;
      }
    }).catch(function () { chip.disabled = false; });
  }
  renderPresets();
  var refreshBtn = $("preset-refresh");
  if (refreshBtn) refreshBtn.addEventListener("click", renderPresets);

  // candle light also adds a preset-style wish (free type with preset text = candle text is custom...)
  // -> candle wishes now just light visually + show cert; wall entry only via presets/patron.

  // ===== Patron custom card (>=10 USDT, verified on-chain, one per txid) =====
  var patronBtn = $("patron-btn");
  if (patronBtn) {
    patronBtn.addEventListener("click", function () {
      var name = $("patron-name").value.trim();
      var text = $("patron-text").value.trim();
      var txid = $("patron-txid").value.trim();
      var chain = $("patron-chain").value;
      var out = $("patron-result");
      if (!text || !txid) { out.textContent = F.patronNeedText; return; }
      out.textContent = "…";
      patronBtn.disabled = true;
      fetch(WALL_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "patron", name: name, text: text, txid: txid, chain: chain })
      }).then(function (r) { return r.json(); }).then(function (d) {
        patronBtn.disabled = false;
        if (d.wish) {
          wallItems.unshift(d.wish);
          renderWall();
          out.textContent = F.patronOkText;
          $("patron-text").value = ""; $("patron-txid").value = "";
        } else {
          out.textContent = d.error || F.patronFailText;
        }
      }).catch(function () {
        patronBtn.disabled = false;
        out.textContent = F.patronFailText;
      });
    });
  }

  // ===== Tasbih (muslim only) =====
  var tasbih = $("tasbih-btn");
  if (tasbih) {
    var tCount = parseInt(localStorage.getItem(store + "tasbih") || "0", 10);
    var tEl = $("tasbih-count"), tRound = $("tasbih-round");
    function tRender() {
      tEl.textContent = tCount % 33 === 0 && tCount > 0 ? 33 : tCount % 33;
      tRound.textContent = Math.floor(tCount / 99);
    }
    tRender();
    tasbih.addEventListener("click", function () {
      tCount++;
      localStorage.setItem(store + "tasbih", String(tCount));
      tRender();
    });
    $("tasbih-reset").addEventListener("click", function () {
      tCount = 0;
      localStorage.setItem(store + "tasbih", "0");
      tRender();
    });
  }

  // ===== Donation: addresses + QR + copy =====
  function setupDonate(addrId, qrId, addr) {
    var addrEl = $(addrId);
    if (addr) {
      addrEl.textContent = addr;
      new QRCode($(qrId), { text: addr, width: 128, height: 128 });
    }
  }
  setupDonate("addr-trc", "qr-trc", window.ADDR.trc20);
  setupDonate("addr-erc", "qr-erc", window.ADDR.erc20);

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var addr = $(btn.getAttribute("data-copy")).textContent;
      if (!addr || addr.indexOf("opening") >= 0) { btn.textContent = F.addrPendingText; return; }
      navigator.clipboard.writeText(addr).then(function () {
        btn.textContent = F.copiedText;
        setTimeout(function () { btn.textContent = F.copyText; }, 2000);
      });
    });
  });

  // ===== Patron wall (on-chain verified) =====
  function truncAddr(a) { return a.length > 16 ? a.slice(0, 8) + "…" + a.slice(-6) : a; }
  function tierOf(amount) {
    var t = F.tiers[0];
    F.tiers.forEach(function (x) { if (amount >= x.min) t = x; });
    return t;
  }
  function ago(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 3600) return Math.max(1, Math.floor(s / 60)) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    if (s < 2592000) return Math.floor(s / 86400) + "d ago";
    return new Date(ts).toLocaleDateString();
  }

  function fetchTrc() {
    if (!window.ADDR.trc20) return Promise.resolve([]);
    return fetch("https://api.trongrid.io/v1/accounts/" + window.ADDR.trc20 + "/transactions/trc20?only_to=true&limit=30")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        return (d.data || []).filter(function (t) {
          return t.token_info && t.token_info.symbol === "USDT" && t.to === window.ADDR.trc20;
        }).map(function (t) {
          return { from: t.from, amount: parseInt(t.value, 10) / 1e6, ts: t.block_timestamp, chain: "TRC20" };
        });
      }).catch(function () { return []; });
  }
  function fetchErc() {
    if (!window.ADDR.erc20) return Promise.resolve([]);
    return fetch("https://api.ethplorer.io/getAddressHistory/" + window.ADDR.erc20 +
        "?apiKey=freekey&token=0xdAC17F958D2ee523a2206206994597C13D831ec7&type=transfer&limit=30")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        return (d.operations || []).filter(function (t) {
          return t.to && t.to.toLowerCase() === window.ADDR.erc20.toLowerCase();
        }).map(function (t) {
          return { from: t.from, amount: parseFloat(t.value), ts: t.timestamp * 1000, chain: "ERC20" };
        });
      }).catch(function () { return []; });
  }

  function renderPatrons() {
    var list = $("patron-list");
    if (!list) return;
    Promise.all([fetchTrc(), fetchErc()]).then(function (rs) {
      var all = rs[0].concat(rs[1]);
      if (!all.length) {
        list.innerHTML = '<div class="wish"><p>' + F.noPatronsText + '</p></div>';
        return;
      }
      all.sort(function (a, b) { return b.ts - a.ts; });
      // aggregate per address
      var totals = {};
      all.forEach(function (t) { totals[t.from] = (totals[t.from] || 0) + t.amount; });
      var top = Object.keys(totals).map(function (k) { return { addr: k, total: totals[k] }; })
        .sort(function (a, b) { return b.total - a.total; }).slice(0, 3);

      var medals = ["🥇", "🥈", "🥉"];
      var topHtml = "";
      top.forEach(function (p, i) {
        var t = tierOf(p.total);
        topHtml += '<div class="patron-top-item"><div class="medal">' + medals[i] + '</div>' +
          '<b>' + esc(truncAddr(p.addr)) + '</b>' +
          '<span class="amt">$' + p.total.toFixed(2) + '</span>' +
          '<span class="tier">' + esc(t.name) + '</span></div>';
      });
      $("patron-top").innerHTML = topHtml;

      var html = "";
      all.slice(0, 12).forEach(function (t) {
        var tier = tierOf(t.amount);
        html += '<div class="wish"><b>' + esc(truncAddr(t.from)) + '</b>' +
          '<small> · ' + t.chain + ' · ' + ago(t.ts) + '</small>' +
          '<p>$' + t.amount.toFixed(2) + ' — ' + esc(tier.name) + '</p></div>';
      });
      list.innerHTML = html;
    });
  }
  renderPatrons();

  // ===== Rank checker + certificate =====
  function showCert(name, patron) {
    var box = $("cert-box");
    if (!box) return;
    box.classList.add("show");
    box.dataset.name = name;
    box.dataset.tier = patron ? patron.name : "";
    box.dataset.amount = patron ? patron.amount : "";
  }
  var rankBtn = $("rank-btn");
  if (rankBtn) {
    rankBtn.addEventListener("click", function () {
      var addr = $("rank-addr").value.trim();
      var out = $("rank-result");
      if (!addr) return;
      out.textContent = "…";
      Promise.all([fetchTrc(), fetchErc()]).then(function (rs) {
        var mine = rs[0].concat(rs[1]).filter(function (t) {
          return t.from.toLowerCase() === addr.toLowerCase();
        });
        if (!mine.length) { out.textContent = F.noRankText; return; }
        var total = mine.reduce(function (s, t) { return s + t.amount; }, 0);
        var tier = tierOf(total);
        out.innerHTML = F.rankResultText
          .replace("{amount}", "$" + total.toFixed(2))
          .replace("{tier}", tier.name);
        showCert(addr, { name: tier.name, amount: "$" + total.toFixed(2) });
      });
    });
  }

  var certBtn = $("cert-btn");
  if (certBtn) {
    certBtn.addEventListener("click", function () {
      var box = $("cert-box");
      var name = box.dataset.name || "Anonymous";
      var cv = document.createElement("canvas");
      cv.width = 880; cv.height = 520;
      var ctx = cv.getContext("2d");
      var g = ctx.createLinearGradient(0, 0, 0, 520);
      g.addColorStop(0, "#2a1013"); g.addColorStop(1, "#14080a");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 880, 520);
      ctx.strokeStyle = "#e8c15a"; ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, 832, 472);
      ctx.strokeRect(34, 34, 812, 452);
      ctx.fillStyle = "#e8c15a";
      ctx.textAlign = "center";
      ctx.font = "700 40px serif";
      ctx.fillText(F.certTitle, 440, 120);
      ctx.font = "20px serif"; ctx.fillStyle = "#b39a86";
      ctx.fillText(F.certSub, 440, 158);
      ctx.font = "32px serif"; ctx.fillStyle = "#f2e6d0";
      ctx.fillText(name, 440, 250);
      ctx.font = "22px serif";
      var line = F.certBody.replace("{date}", new Date().toLocaleDateString());
      if (box.dataset.tier) line += " · " + box.dataset.tier + " " + (box.dataset.amount || "");
      ctx.fillText(line, 440, 300);
      ctx.font = "18px serif"; ctx.fillStyle = "#e8c15a";
      ctx.fillText(location.host, 440, 440);
      // flame
      var fg = ctx.createRadialGradient(440, 380, 2, 440, 380, 30);
      fg.addColorStop(0, "#fff6c8"); fg.addColorStop(0.5, "#ffd35a"); fg.addColorStop(1, "rgba(255,140,46,0)");
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.ellipse(440, 380, 14, 22, 0, 0, Math.PI * 2); ctx.fill();
      var a = document.createElement("a");
      a.download = F.certFile + ".png";
      a.href = cv.toDataURL("image/png");
      a.click();
    });
  }

  // ===== Share =====
  var shareText = encodeURIComponent(F.shareText + " " + location.href);
  var map = {
    "share-x": "https://twitter.com/intent/tweet?text=" + shareText,
    "share-tg": "https://t.me/share/url?url=" + encodeURIComponent(location.href) + "&text=" + encodeURIComponent(F.shareText),
    "share-wa": "https://wa.me/?text=" + shareText
  };
  Object.keys(map).forEach(function (id) {
    var el = $(id);
    if (el) el.href = map[id];
  });
  var copyLink = $("share-copy");
  if (copyLink) copyLink.addEventListener("click", function () {
    navigator.clipboard.writeText(location.href);
    copyLink.textContent = F.linkCopiedText;
  });
})();
