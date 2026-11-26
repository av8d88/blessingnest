/* BlessingNest multi-faith engine — reads window.FAITH + window.ADDR config */
(function () {
  "use strict";
  var F = window.FAITH;
  var store = "bn_" + F.id + "_";

  // ===== Candles / Lamps =====
  var stage = document.getElementById("stage");
  var countEl = document.getElementById("my-count");
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

  document.getElementById("light-btn").addEventListener("click", function () {
    var name = document.getElementById("wish-name").value.trim();
    addCandle();
    myCount++;
    localStorage.setItem(store + "candles", String(myCount));
    countEl.textContent = myCount;
    if (name) addWish(F.candleWallText.replace("{name}", name));
  });

  // ===== Daily verse / dua / stick =====
  var drawn = false;
  document.getElementById("draw-btn").addEventListener("click", function () {
    var today = new Date().toDateString();
    if (localStorage.getItem(store + "drawn_date") === today && drawn) {
      document.getElementById("verse-mean").textContent = F.onceDailyText;
      return;
    }
    var v = F.verses[Math.floor(Math.random() * F.verses.length)];
    document.getElementById("verse-ref").textContent = v.ref;
    document.getElementById("verse-text").textContent = v.text;
    document.getElementById("verse-mean").textContent = v.mean;
    document.getElementById("verse-result").classList.add("show");
    localStorage.setItem(store + "drawn_date", today);
    drawn = true;
  });

  // ===== Blessing wall (local) =====
  var wallList = document.getElementById("wall-list");
  function getWishes() {
    try { return JSON.parse(localStorage.getItem(store + "wishes") || "[]"); } catch (e) { return []; }
  }
  function saveWishes(w) { localStorage.setItem(store + "wishes", JSON.stringify(w.slice(0, 50))); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function renderWall() {
    var html = "";
    getWishes().forEach(function (w) {
      html += '<div class="wish"><b>' + esc(w.n) + '</b><small> · ' + w.d + '</small><p>' + esc(w.t) + '</p></div>';
    });
    F.seeds.forEach(function (w) {
      html += '<div class="wish"><b>' + esc(w.n) + '</b><small> · ' + F.seedDate + '</small><p>' + esc(w.t) + '</p></div>';
    });
    wallList.innerHTML = html;
  }
  function addWish(text) {
    var w = getWishes();
    w.unshift({ t: text, n: F.youName, d: new Date().toLocaleDateString() });
    saveWishes(w);
    renderWall();
  }
  document.getElementById("hang-btn").addEventListener("click", function () {
    var t = document.getElementById("wish-text").value.trim();
    if (!t) return;
    addWish(t);
    document.getElementById("wish-text").value = "";
  });
  renderWall();

  // ===== Tasbih counter (muslim page only) =====
  var tasbih = document.getElementById("tasbih-btn");
  if (tasbih) {
    var tCount = parseInt(localStorage.getItem(store + "tasbih") || "0", 10);
    var tEl = document.getElementById("tasbih-count");
    var tRound = document.getElementById("tasbih-round");
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
    document.getElementById("tasbih-reset").addEventListener("click", function () {
      tCount = 0;
      localStorage.setItem(store + "tasbih", "0");
      tRender();
    });
  }

  // ===== Donation =====
  function setupDonate(addrId, qrId, addr) {
    var addrEl = document.getElementById(addrId);
    if (addr) {
      addrEl.textContent = addr;
      new QRCode(document.getElementById(qrId), { text: addr, width: 128, height: 128 });
    }
  }
  setupDonate("addr-trc", "qr-trc", window.ADDR.trc20);
  setupDonate("addr-erc", "qr-erc", window.ADDR.erc20);

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var addr = document.getElementById(btn.getAttribute("data-copy")).textContent;
      if (!addr || addr.indexOf("opening") >= 0 || addr.indexOf("开光") >= 0) {
        btn.textContent = F.addrPendingText;
        return;
      }
      navigator.clipboard.writeText(addr).then(function () {
        btn.textContent = F.copiedText;
        setTimeout(function () { btn.textContent = F.copyText; }, 2000);
      });
    });
  });
})();
