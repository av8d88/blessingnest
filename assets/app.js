/* 祈福阁 app.js */
(function () {
  "use strict";

  // ===== 功德地址（主持开光后填入真实地址）=====
  var ADDR_TRC20 = ""; // TRC20 USDT address (starts with T...)
  var ADDR_ERC20 = ""; // ERC20 USDT address (starts with 0x...)

  // ===== 点灯 =====
  var stage = document.getElementById("stage");
  var countEl = document.getElementById("my-count");
  var myCount = parseInt(localStorage.getItem("bn_candles") || "0", 10);
  countEl.textContent = myCount;

  function addCandle() {
    var c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<div class="flame"></div><div class="wick"></div><div class="stick"></div>';
    stage.appendChild(c);
    // 最多展示 12 盏，多余的化作灯河
    var candles = stage.querySelectorAll(".candle");
    if (candles.length > 12) candles[0].remove();
  }
  // 恢复之前点过的（最多显示 6 盏）
  for (var i = 0; i < Math.min(myCount, 6); i++) addCandle();

  document.getElementById("light-btn").addEventListener("click", function () {
    var name = document.getElementById("wish-name").value.trim();
    addCandle();
    myCount++;
    localStorage.setItem("bn_candles", String(myCount));
    countEl.textContent = myCount;
    // 顺手挂一条墙
    if (name) {
      addWish("为「" + name + "」点了一盏平安灯", true);
    }
  });

  // ===== 灵签 =====
  var STICKS = [
    { level: "上上签", poem: "云开见月正分明\n不须进退问前程\n婚姻皆由天注定\n和合清吉万事成", mean: "签解：时运已至，所求皆顺，放胆去做。" },
    { level: "上上签", poem: "枯木逢春尽发新\n花香叶茂蝶来频\n桃源竞斗千红紫\n一叶渔舟误入津", mean: "签解：沉寂已久，转机已现，把握当下。" },
    { level: "上上签", poem: "财如晓日腾云起\n利似春潮带雨来\n若问前程多大吉\n一帆风顺到蓬莱", mean: "签解：财运亨通之兆，宜进取不宜守。" },
    { level: "上吉签", poem: "静坐常思己过\n闲谈莫论人非\n能受苦方为志士\n肯吃亏不是痴人", mean: "签解：修身养性，厚道之人必有后福。" },
    { level: "上吉签", poem: "花开结子一半枯\n可惜今年汝虚度\n渐渐日落西山去\n劝君不用向前途", mean: "签解：前半耕耘后半收，莫急，果子在结。" },
    { level: "上吉签", poem: "好把愁眉须展开\n大才大用荐将来\n一条大路平如掌\n凡有施为总称怀", mean: "签解：才华将被看见，大胆展示自己。" },
    { level: "中吉签", poem: "事不三思终有悔\n人能百忍自无忧\n守得清心方为道\n退一步时天更阔", mean: "签解：三思后行，忍耐是最近的上策。" },
    { level: "中吉签", poem: "行舟风顺正无疑\n遇有旋涡把舵移\n自此遂心随意去\n管取前途得意归", mean: "签解：大局顺遂，小处留意，可保无虞。" },
    { level: "中吉签", poem: "不必著意求佳景\n自有奇逢应早春\n若问酒家何处有\n牧童遥指杏花村", mean: "签解：刻意难求，无心反得，顺其自然。" },
    { level: "中吉签", poem: "勤耕田地莫蹉跎\n收获之时庆丰多\n若问一年农事好\n春分种下秋来割", mean: "签解：一分耕耘一分收获，贵在坚持。" },
    { level: "中下签", poem: "眼前风波多险阻\n宜守不宜进为佳\n待得云开雾散日\n方显英雄本色时", mean: "签解：暂避锋芒，静观其变，守成为上。" },
    { level: "中下签", poem: "事多反复少成谋\n且把心宽莫强求\n若得贵人相引处\n那时方好上高楼", mean: "签解：暂有阻滞，宜广结善缘，借力而行。" },
    { level: "转运签", poem: "山重水复疑无路\n柳暗花明又一村\n莫道前途无知己\n天下谁人不识君", mean: "签解：困境将尽，转机即至，坚持就是答案。" },
    { level: "转运签", poem: "否极泰来咫尺间\n渐渐君子出于山\n若逢虎兔佳音信\n立志忙中事即闲", mean: "签解：最坏的时候正在过去，好运在敲门。" },
    { level: "上上签", poem: "一签抽出万事明\n东南西北任君行\n福禄寿喜财皆至\n合家安康乐太平", mean: "签解：诸事大吉，做什么成什么，珍惜当下。" },
    { level: "上吉签", poem: "黄金非宝书为宝\n万事皆空善不空\n积德虽无人见\n行善自有天知", mean: "签解：但行好事，莫问前程，福报已在路上。" }
  ];

  var drawn = false;
  document.getElementById("draw-btn").addEventListener("click", function () {
    var today = new Date().toDateString();
    if (localStorage.getItem("bn_drawn_date") === today && drawn) {
      document.getElementById("stick-mean").textContent = "一日一签，心诚则灵。明日再来。";
      return;
    }
    var s = STICKS[Math.floor(Math.random() * STICKS.length)];
    document.getElementById("stick-level").textContent = s.level;
    document.getElementById("stick-poem").textContent = s.poem;
    document.getElementById("stick-mean").textContent = s.mean;
    document.getElementById("stick-result").classList.add("show");
    localStorage.setItem("bn_drawn_date", today);
    drawn = true;
  });

  // ===== 祈福墙（本机长明）=====
  var wallList = document.getElementById("wall-list");
  var SEEDS = [
    { t: "愿父母身体健康，岁岁平安。", n: "匿名善信" },
    { t: "愿项目顺利上线，代码无 bug。", n: " debug 到凌晨的人" },
    { t: "愿所求皆如愿，所行化坦途。", n: "过路人" },
    { t: "愿今年上岸，心想事成。", n: "备考ing" },
    { t: "愿钱包渐鼓，烦恼渐消。", n: "一位不愿透露姓名的老板" }
  ];

  function getWishes() {
    try { return JSON.parse(localStorage.getItem("bn_wishes") || "[]"); } catch (e) { return []; }
  }
  function saveWishes(w) { localStorage.setItem("bn_wishes", JSON.stringify(w.slice(0, 50))); }

  function renderWall() {
    var html = "";
    getWishes().forEach(function (w) {
      html += '<div class="wish"><b>' + esc(w.n) + '</b><small> · ' + w.d + '</small><p>' + esc(w.t) + '</p></div>';
    });
    SEEDS.forEach(function (w) {
      html += '<div class="wish"><b>' + esc(w.n) + '</b><small> · 开阁首日</small><p>' + esc(w.t) + '</p></div>';
    });
    wallList.innerHTML = html;
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function addWish(text, silent) {
    var w = getWishes();
    w.unshift({ t: text, n: "你", d: new Date().toLocaleDateString("zh-CN") });
    saveWishes(w);
    if (!silent) renderWall(); else renderWall();
  }

  document.getElementById("hang-btn").addEventListener("click", function () {
    var t = document.getElementById("wish-text").value.trim();
    if (!t) return;
    addWish(t);
    document.getElementById("wish-text").value = "";
  });
  renderWall();

  // ===== 功德箱 =====
  function setupDonate(addrId, qrId, addr) {
    var addrEl = document.getElementById(addrId);
    if (addr) {
      addrEl.textContent = addr;
      new QRCode(document.getElementById(qrId), { text: addr, width: 128, height: 128 });
    }
  }
  setupDonate("addr-trc", "qr-trc", ADDR_TRC20);
  setupDonate("addr-erc", "qr-erc", ADDR_ERC20);

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var addr = document.getElementById(btn.getAttribute("data-copy")).textContent;
      if (!addr || addr.indexOf("待主持") >= 0) { btn.textContent = "地址尚未公布"; return; }
      navigator.clipboard.writeText(addr).then(function () {
        btn.textContent = "已复制 · 功德+1";
        setTimeout(function () { btn.textContent = "复制地址"; }, 2000);
      });
    });
  });
})();
