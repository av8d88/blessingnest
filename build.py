#!/usr/bin/env python3
# BlessingNest multi-faith generator — pure stdlib.
import os, shutil, json

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "dist")
SITE_URL = "https://blessingnest.pages.dev"
INDEXNOW_KEY = "8f3e2a1c9b4d6e8f0a2c4e6b8d0f2a4c"
ADDR_TRC20 = "TJ7xmAQo2qUP3MTjKhag3zhRtXKg3pPP9H"
ADDR_ERC20 = "0xffed67d9c05208F171cf6b7823a0CB0B0Ad496Cd"

# ---------------- faith configs ----------------
FAITHS = [
dict(
  id="christian", path="christian-prayer", lang="en",
  title="Online Prayer Room — Light a Candle, Daily Bible Verse | BlessingNest",
  desc="Free online Christian prayer room: light a virtual candle, receive a Bible verse, leave your prayer on the wall, and give an offering via USDT.",
  h1="Online Prayer Room", tagline="Light a candle. Say a prayer. Be still.",
  theme="--bg:#0d1526; --bg2:#101b33; --card:#132036; --line:#22355c; --gold:#e8c15a; --gold2:#c9a227; --red:#4a6fb5; --ink:#eaf0fb; --muted:#8fa3c8;",
  item_name="candle", light_h2="Light a Prayer Candle",
  light_sub="A small flame, a quiet moment. Light a candle for someone you love.",
  wish_label="Who is this candle for? (optional)", wish_ph="e.g. Mom's health / my family / a friend in need",
  light_btn="Light a Candle", counter_text="You have lit %s candle(s) here · may your light shine",
  verse_h2="Verse of the Day", verse_sub="Quiet your heart, then receive today's word.",
  draw_btn="Receive a Verse", once_text="One verse a day is enough. Come back tomorrow.",
  candle_wall_text='lit a candle for "{name}"', you_name="You", seed_date="Opening Day",
  wall_h2="Prayer Wall", wall_sub="Leave your prayer here. The candles remember.",
  wall_label="Your prayer (120 chars max)", wall_ph="Lord, grant us peace...",
  hang_btn="Pin to Prayer Wall",
  donate_h2="Tithe & Offering", donate_sub="If this quiet corner brought you peace, your offering keeps the candles burning. Give as you feel led.",
  donate_note="Giving is completely voluntary · Double-check the network before sending",
  copy_text="Copy address", copied_text="Copied · God bless", pending_text="Opening soon",
  verses=[
    dict(ref="Psalm 23:1", text="The LORD is my shepherd; I shall not want.", mean="You are provided for. Rest in that today."),
    dict(ref="Philippians 4:13", text="I can do all things through Christ which strengtheneth me.", mean="Strength is given, not manufactured. Ask, then act."),
    dict(ref="Jeremiah 29:11", text="For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", mean="Your story ends well. Keep walking."),
    dict(ref="Matthew 11:28", text="Come unto me, all ye that labour and are heavy laden, and I will give you rest.", mean="Set the burden down for a moment. You are allowed to rest."),
    dict(ref="Proverbs 3:5", text="Trust in the LORD with all thine heart; and lean not unto thine own understanding.", mean="You don't have to figure it all out tonight."),
    dict(ref="Isaiah 41:10", text="Fear thou not; for I am with thee: be not dismayed; for I am thy God.", mean="Whatever you face tomorrow, you won't face it alone."),
    dict(ref="Psalm 46:1", text="God is our refuge and strength, a very present help in trouble.", mean="Help is not distant. It is present tense."),
    dict(ref="Romans 15:13", text="Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope.", mean="Hope is not naive. It is a discipline. Practice it."),
    dict(ref="Psalm 119:105", text="Thy word is a lamp unto my feet, and a light unto my path.", mean="You only need light for the next step, not the whole road."),
    dict(ref="Joshua 1:9", text="Be strong and of a good courage; be not afraid, neither be thou dismayed.", mean="Courage is not the absence of fear. Go anyway."),
  ],
  seeds=[
    dict(t="Praying for my father's recovery. Lord, give him strength.", n="Sarah"),
    dict(t="For peace in my heart and in the world.", n="Michael"),
    dict(t="Thank you God for another day. Amen.", n="Anonymous"),
  ]),

dict(
  id="muslim", path="muslim-dua", lang="en",
  title="Online Dua Corner — Daily Dua & Digital Tasbih | BlessingNest",
  desc="Free online dua corner: receive a daily dua from the Quran, count dhikr with a digital tasbih, leave your dua on the wall, and give sadaqah via USDT.",
  h1="Online Dua Corner", tagline="Raise your hands. Ask. He is near.",
  theme="--bg:#08160f; --bg2:#0c2117; --card:#0f2a1d; --line:#1d4a34; --gold:#e8c15a; --gold2:#c9a227; --red:#1f8a5a; --ink:#e9f5ee; --muted:#8fb8a5;",
  item_name="light", light_h2="Light a Light of Hope",
  light_sub="Nur upon nur. Light a small light for someone you make dua for.",
  wish_label="Who is this light for? (optional)", wish_ph="e.g. my mother's health / my family / the ummah",
  light_btn="Light a Light", counter_text="You have lit %s light(s) here · Allahumma amin",
  verse_h2="Dua of the Day", verse_sub="Purify your intention, then receive today's dua.",
  draw_btn="Receive a Dua", once_text="One sincere dua a day suffices. Return tomorrow, insha'Allah.",
  candle_wall_text='lit a light and made dua for "{name}"', you_name="You", seed_date="Opening Day",
  wall_h2="Dua Wall", wall_sub="Leave your dua here. Angels say amin to the dua of a brother or sister.",
  wall_label="Your dua (120 chars max)", wall_ph="Ya Allah, grant us shifa and rizq...",
  hang_btn="Pin to Dua Wall",
  donate_h2="Sadaqah", donate_sub="Charity does not decrease wealth. If this corner brought you comfort, your sadaqah keeps the lights on.",
  donate_note="Giving is completely voluntary · Double-check the network before sending",
  copy_text="Copy address", copied_text="Copied · BarakAllahu feek", pending_text="Opening soon",
  tasbih=True,
  verses=[
    dict(ref="Quran 2:152", text="So remember Me; I will remember you. And be grateful to Me and do not deny Me.", mean="Dhikr is a two-way door. Remember Him now."),
    dict(ref="Quran 2:286", text="Allah does not burden a soul beyond that it can bear.", mean="This test was measured for you. You can carry it."),
    dict(ref="Quran 94:6", text="Indeed, with hardship comes ease.", mean="Ease is attached to your hardship — not after it, with it."),
    dict(ref="Quran 13:28", text="Verily, in the remembrance of Allah do hearts find rest.", mean="The restlessness you feel has one address. Go there."),
    dict(ref="Quran 39:53", text="Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.", mean="No matter what you did last night, the door is open this morning."),
    dict(ref="Quran 2:201", text="Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.", mean="The most complete dua. Say it often."),
    dict(ref="Quran 3:173", text="Sufficient for us is Allah, and He is the best Disposer of affairs.", mean="Hand the matter over. He handles it better."),
    dict(ref="Quran 2:153", text="O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.", mean="Sabr is not passive. It is active trust. Keep going."),
    dict(ref="Quran 20:114", text="My Lord, increase me in knowledge.", mean="The dua of students and builders. Ask, then study."),
    dict(ref="Quran 3:139", text="Do not lose heart, and do not grieve, for you will have the upper hand if you are believers.", mean="Your position is higher than your mood today."),
  ],
  seeds=[
    dict(t="Ya Allah, grant shifa to my mother. Amin.", n="Umm Khalid"),
    dict(t="Dua for the ummah everywhere. Amin.", n="Anonymous"),
    dict(t="Rabbana atina fid-dunya hasanah. Amin.", n="Bilal"),
  ]),

dict(
  id="hindu", path="hindu-blessing", lang="en",
  title="Online Diya & Blessing — Daily Gita Verse | BlessingNest",
  desc="Free online Hindu blessing corner: light a virtual diya, receive a verse from the Bhagavad Gita, leave a blessing on the wall, and offer dana via USDT.",
  h1="Online Diya & Blessing", tagline="One flame, one mantra, one quiet breath.",
  theme="--bg:#1a0e04; --bg2:#241304; --card:#2c1a06; --line:#553a10; --gold:#f0a838; --gold2:#d98a1e; --red:#d96b1e; --ink:#fdf0dc; --muted:#c8a887;",
  item_name="diya", light_h2="Light a Diya",
  light_sub="Asato ma sad gamaya — from darkness, lead us to light. Light a diya for someone dear.",
  wish_label="Who is this diya for? (optional)", wish_ph="e.g. family wellbeing / health / success in exams",
  light_btn="Light a Diya", counter_text="You have lit %s diya(s) here · shubh kamna",
  verse_h2="Shloka of the Day", verse_sub="Still the mind, then receive today's wisdom.",
  draw_btn="Receive a Shloka", once_text="One shloka a day, meditated upon, is enough. Return tomorrow.",
  candle_wall_text='lit a diya for "{name}"', you_name="You", seed_date="Opening Day",
  wall_h2="Blessing Wall", wall_sub="Leave your blessing here. May it return to you multiplied.",
  wall_label="Your blessing (120 chars max)", wall_ph="May all beings be happy...",
  hang_btn="Pin to Blessing Wall",
  donate_h2="Dana / Offering", donate_sub="Giving purifies the giver. If this corner lit something in you, your dana keeps the diyas burning.",
  donate_note="Giving is completely voluntary · Double-check the network before sending",
  copy_text="Copy address", copied_text="Copied · Dhanyavaad", pending_text="Opening soon",
  verses=[
    dict(ref="Bhagavad Gita 2.47", text="You have a right to your actions, but never to the fruits of your actions.", mean="Do the work. Release the outcome."),
    dict(ref="Bhagavad Gita 6.5", text="Lift yourself by yourself; do not let yourself fall. The self alone is your friend, the self alone is your enemy.", mean="Your greatest ally is already inside you."),
    dict(ref="Bhagavad Gita 4.7", text="Whenever dharma declines, O descendant of Bharata, I manifest myself.", mean="Order returns. It always has."),
    dict(ref="Bhagavad Gita 2.62-63", text="From attachment comes desire, from desire anger, from anger delusion, from delusion loss of memory — and with that, the fall.", mean="Watch the chain at its first link: the small attachment."),
    dict(ref="Bhagavad Gita 9.22", text="To those who are ever devoted, I carry what they lack and preserve what they have.", mean="You are looked after more than you know."),
    dict(ref="Gayatri Mantra", text="Om bhur bhuvah svah, tat savitur varenyam, bhargo devasya dhimahi, dhiyo yo nah prachodayat.", mean="May the divine light illumine our intellect."),
    dict(ref="Bhagavad Gita 18.66", text="Abandon all varieties of duty and simply surrender unto Me. I shall deliver you from all sin. Do not fear.", mean="Surrender is not defeat. It is the deepest strategy."),
    dict(ref="Lokah Samastah", text="Lokah samastah sukhino bhavantu — May all beings everywhere be happy and free.", mean="Widen your prayer until it includes everyone."),
  ],
  seeds=[
    dict(t="For my parents' health and long life. Om shanti.", n="Priya"),
    dict(t="May I pass my exams and make my family proud.", n="Arjun"),
    dict(t="Lokah samastah sukhino bhavantu.", n="Anonymous"),
  ]),

dict(
  id="jewish", path="jewish-blessing", lang="en",
  title="Online Candle & Blessing — Daily Psalm | BlessingNest",
  desc="Free online Jewish blessing corner: light a virtual candle, receive a verse from Psalms, leave a bracha on the wall, and give tzedakah via USDT.",
  h1="Online Candle & Blessing", tagline="A little light dispels much darkness.",
  theme="--bg:#0a1424; --bg2:#0e1c33; --card:#12243f; --line:#24406b; --gold:#e8c15a; --gold2:#c9a227; --red:#3f6fb5; --ink:#e8effc; --muted:#93a9cc;",
  item_name="candle", light_h2="Light a Candle",
  light_sub="For the memory of a loved one, for healing, for peace — light a candle.",
  wish_label="Who is this candle for? (optional)", wish_ph="e.g. refuah shlema for... / in memory of...",
  light_btn="Light a Candle", counter_text="You have lit %s candle(s) here · ken yehi ratzon",
  verse_h2="Verse of the Day", verse_sub="Settle your spirit, then receive today's verse.",
  draw_btn="Receive a Verse", once_text="One verse a day, taken to heart. Return tomorrow.",
  candle_wall_text='lit a candle for "{name}"', you_name="You", seed_date="Opening Day",
  wall_h2="Blessing Wall", wall_sub="Leave a bracha here. Blessings multiply when spoken aloud.",
  wall_label="Your blessing (120 chars max)", wall_ph="May you be blessed and guarded...",
  hang_btn="Pin to Blessing Wall",
  donate_h2="Tzedakah", donate_sub="The world stands on Torah, service, and acts of lovingkindness. Your tzedakah keeps these candles lit.",
  donate_note="Giving is completely voluntary · Double-check the network before sending",
  copy_text="Copy address", copied_text="Copied · Toda raba", pending_text="Opening soon",
  verses=[
    dict(ref="Psalm 121:1-2", text="I lift up my eyes to the mountains — where does my help come from? My help comes from the LORD, the Maker of heaven and earth.", mean="Help has a source older than the mountains."),
    dict(ref="Psalm 23:4", text="Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me.", mean="The valley is a passage, not an address."),
    dict(ref="Numbers 6:24-26", text="May the LORD bless you and keep you; may He make His face shine upon you; may He lift up His countenance to you and give you peace.", mean="The oldest blessing still working. Receive it."),
    dict(ref="Pirkei Avot 2:16", text="It is not your duty to finish the work, but neither are you free to desist from it.", mean="You are not responsible for finishing — only for not stopping."),
    dict(ref="Pirkei Avot 4:1", text="Who is wise? One who learns from every person.", mean="Today's teacher may arrive in disguise."),
    dict(ref="Hillel, Pirkei Avot 1:14", text="If I am not for myself, who will be for me? If I am only for myself, what am I? And if not now, when?", mean="Three questions. One life. Answer the last one today."),
    dict(ref="Psalm 90:12", text="Teach us to number our days, that we may gain a heart of wisdom.", mean="Counting days is how days start to count."),
    dict(ref="Gam Zu L'Tovah", text="This too is for the good. — Nachum Ish Gamzu", mean="The hardest faith is retrospective. Trust the edit."),
  ],
  seeds=[
    dict(t="Refuah shlema for my grandmother. Ken yehi ratzon.", n="David"),
    dict(t="In memory of those we lost. May their memory be a blessing.", n="Anonymous"),
    dict(t="For peace in Jerusalem and everywhere. Amen.", n="Leah"),
  ]),

dict(
  id="buddhist", path="buddhist-blessing", lang="en",
  title="Online Blessing — Light a Candle, Daily Dharma | BlessingNest",
  desc="Free online Buddhist blessing corner: light a virtual candle, receive a verse from the Dhammapada, leave a blessing on the wall, and practice dana via USDT.",
  h1="Online Blessing Corner", tagline="Thousands of candles can be lit from a single candle.",
  theme="--bg:#160b04; --bg2:#1f0f06; --card:#28150a; --line:#4a2c14; --gold:#e8b15a; --gold2:#c9922a; --red:#b5562a; --ink:#f7ead6; --muted:#bfa183;",
  item_name="candle", light_h2="Light a Candle",
  light_sub="A candle never loses its flame by lighting another. Light one for someone you wish well.",
  wish_label="Who is this candle for? (optional)", wish_ph="e.g. all beings / my family / a suffering friend",
  light_btn="Light a Candle", counter_text="You have lit %s candle(s) here · sadhu sadhu",
  verse_h2="Dharma of the Day", verse_sub="Settle the mind like still water, then receive today's verse.",
  draw_btn="Receive a Verse", once_text="One verse, fully absorbed, is a day's practice. Return tomorrow.",
  candle_wall_text='lit a candle for "{name}"', you_name="You", seed_date="Opening Day",
  wall_h2="Blessing Wall", wall_sub="Leave your blessing here. May all beings share in the merit.",
  wall_label="Your blessing (120 chars max)", wall_ph="May all beings be free from suffering...",
  hang_btn="Pin to Blessing Wall",
  donate_h2="Dana", donate_sub="Generosity is the first perfection. If this corner quieted your mind, your dana keeps the candles lit.",
  donate_note="Giving is completely voluntary · Double-check the network before sending",
  copy_text="Copy address", copied_text="Copied · Sadhu", pending_text="Opening soon",
  verses=[
    dict(ref="Dhammapada 1", text="Mind precedes all phenomena. Mind is their chief; they are all mind-made.", mean="Your day is built in your head before it happens outside."),
    dict(ref="Dhammapada 5", text="Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased.", mean="You cannot put out a fire with fire. Bring water."),
    dict(ref="Dhammapada 100", text="Better than a thousand hollow words is one word that brings peace.", mean="Say less. Mean more."),
    dict(ref="Dhammapada 204", text="Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.", mean="Take inventory. You may be richer than you feel."),
    dict(ref="Dhammapada 276", text="You yourselves must strive; the Buddhas only point the way.", mean="The map is not the journey. Walk."),
    dict(ref="Dhammapada 277", text="All conditioned things are impermanent. When one sees this with wisdom, one turns away from suffering.", mean="This too shall pass — the bad, and also the deadline panic."),
    dict(ref="Attributed to the Buddha", text="Thousands of candles can be lit from a single candle, and the life of the candle will not be shortened.", mean="Kindness costs the giver nothing and doubles the light."),
    dict(ref="Dhammapada 183", text="To avoid all evil, to cultivate good, and to cleanse one's mind — this is the teaching of the Buddhas.", mean="Simple to remember, a lifetime to practice. Begin today."),
  ],
  seeds=[
    dict(t="May all beings be free from suffering. Sadhu.", n="Anonymous"),
    dict(t="For my mother's health and peace of mind.", n="Kusal"),
    dict(t="May I find stillness in the middle of chaos.", n="A traveler"),
  ]),

dict(
  id="chinese", path="chinese-blessing", lang="zh-CN",
  title="祈福阁 — 在线点灯祈福 · 每日一签 · 随喜功德 | BlessingNest",
  desc="祈福阁中文版：在线点一盏平安灯，抽一支灵签，写下心愿挂上祈福墙。随喜功德支持 USDT（TRC20/ERC20），心意直达，全程匿名。",
  h1="祈 福 阁", tagline="灯明一处，愿达十方。",
  theme="--bg:#14080a; --bg2:#1f0d10; --card:#241012; --line:#3d1d20; --gold:#e8c15a; --gold2:#c9a227; --red:#c0362c; --ink:#f2e6d0; --muted:#b39a86;",
  item_name="candle", light_h2="点 灯 祈 福",
  light_sub="为你在乎的人点一盏灯。",
  wish_label="为谁祈福（可留空）", wish_ph="例如：家人平安 / 自己 / 老板发财",
  light_btn="点一盏灯", counter_text="你已在祈福阁点亮 %s 盏灯 · 长明不息",
  verse_h2="每 日 一 签", verse_sub="净手静心，默念所求，然后抽签。每日首签最灵。",
  draw_btn="虔诚抽签", once_text="一日一签，心诚则灵。明日再来。",
  candle_wall_text="为「{name}」点了一盏平安灯", you_name="你", seed_date="开阁首日",
  wall_h2="祈 福 墙", wall_sub="把心愿挂在这里，灯火替你记得。",
  wall_label="你的心愿（30 字以内）", wall_ph="愿所求皆如愿，所行化坦途。",
  hang_btn="挂上祈福墙",
  donate_h2="随 喜 功 德", donate_sub="阁中灯火，赖十方善信添油。若此处曾安你心，欢迎随喜 —— 多少皆是功德。",
  donate_note="随喜完全自愿 · 不随喜照样灵 · 转账请认准网络，转错网络功德难寻",
  copy_text="复制地址", copied_text="已复制 · 功德+1", pending_text="地址尚未公布",
  verses=[
    dict(ref="上上签", text="云开见月正分明\n不须进退问前程\n婚姻皆由天注定\n和合清吉万事成", mean="签解：时运已至，所求皆顺，放胆去做。"),
    dict(ref="上上签", text="枯木逢春尽发新\n花香叶茂蝶来频\n桃源竞斗千红紫\n一叶渔舟误入津", mean="签解：沉寂已久，转机已现，把握当下。"),
    dict(ref="上上签", text="财如晓日腾云起\n利似春潮带雨来\n若问前程多大吉\n一帆风顺到蓬莱", mean="签解：财运亨通之兆，宜进取不宜守。"),
    dict(ref="上吉签", text="静坐常思己过\n闲谈莫论人非\n能受苦方为志士\n肯吃亏不是痴人", mean="签解：修身养性，厚道之人必有后福。"),
    dict(ref="上吉签", text="好把愁眉须展开\n大才大用荐将来\n一条大路平如掌\n凡有施为总称怀", mean="签解：才华将被看见，大胆展示自己。"),
    dict(ref="中吉签", text="事不三思终有悔\n人能百忍自无忧\n守得清心方为道\n退一步时天更阔", mean="签解：三思后行，忍耐是最近的上策。"),
    dict(ref="中吉签", text="行舟风顺正无疑\n遇有旋涡把舵移\n自此遂心随意去\n管取前途得意归", mean="签解：大局顺遂，小处留意，可保无虞。"),
    dict(ref="中吉签", text="不必著意求佳景\n自有奇逢应早春\n若问酒家何处有\n牧童遥指杏花村", mean="签解：刻意难求，无心反得，顺其自然。"),
    dict(ref="中下签", text="眼前风波多险阻\n宜守不宜进为佳\n待得云开雾散日\n方显英雄本色时", mean="签解：暂避锋芒，静观其变，守成为上。"),
    dict(ref="转运签", text="山重水复疑无路\n柳暗花明又一村\n莫道前途无知己\n天下谁人不识君", mean="签解：困境将尽，转机即至，坚持就是答案。"),
    dict(ref="转运签", text="否极泰来咫尺间\n渐渐君子出于山\n若逢虎兔佳音信\n立志忙中事即闲", mean="签解：最坏的时候正在过去，好运在敲门。"),
    dict(ref="上上签", text="一签抽出万事明\n东南西北任君行\n福禄寿喜财皆至\n合家安康乐太平", mean="签解：诸事大吉，做什么成什么，珍惜当下。"),
  ],
  seeds=[
    dict(t="愿父母身体健康，岁岁平安。", n="匿名善信"),
    dict(t="愿所求皆如愿，所行化坦途。", n="过路人"),
    dict(t="愿钱包渐鼓，烦恼渐消。", n="一位不愿透露姓名的老板"),
  ]),
]

# ---------------- templates ----------------
def faith_page(f):
    config = {
        "id": f["id"], "candleWallText": f["candle_wall_text"], "youName": f["you_name"],
        "seedDate": f["seed_date"], "onceDailyText": f["once_text"],
        "copyText": f["copy_text"], "copiedText": f["copied_text"], "addrPendingText": f["pending_text"],
        "verses": f["verses"], "seeds": f["seeds"],
    }
    tasbih_html = ""
    if f.get("tasbih"):
        tasbih_html = """
<div class="card" id="tasbih">
<h2 class="sec">DIGITAL TASBIH</h2>
<p class="sub">SubhanAllah (33) · Alhamdulillah (33) · Allahu Akbar (33)</p>
<div style="font-size:56px;color:var(--gold);font-weight:700" id="tasbih-count">0</div>
<p class="sub">completed rounds of 99: <b id="tasbih-round">0</b></p>
<button class="btn" id="tasbih-btn">COUNT</button><br>
<button class="btn2" id="tasbih-reset">Reset</button>
</div>"""
    body = """
<header>
<div class="logo">""" + f["h1"] + """<small>""" + f["tagline"] + """</small></div>
</header>
<nav class="nav">
<a href="./">All Traditions</a><a href="#light">Light</a><a href="#verse">Daily</a><a href="#wall">Wall</a><a href="#donate">Give</a>
</nav>
<main class="wrap">
<div class="card" id="light">
<h2 class="sec">""" + f["light_h2"] + """</h2>
<p class="sub">""" + f["light_sub"] + """</p>
<div class="candle-stage" id="stage">
<div class="candle"><div class="flame"></div><div class="wick"></div><div class="stick"></div></div>
</div>
<label for="wish-name">""" + f["wish_label"] + """</label>
<input id="wish-name" maxlength="60" placeholder=\"""" + f["wish_ph"] + """\">
<button class="btn" id="light-btn">""" + f["light_btn"] + """</button>
<p class="counter">""" + (f["counter_text"] % '<b id="my-count">0</b>') + """</p>
</div>

<div class="card" id="verse">
<h2 class="sec">""" + f["verse_h2"] + """</h2>
<p class="sub">""" + f["verse_sub"] + """</p>
<button class="btn" id="draw-btn">""" + f["draw_btn"] + """</button>
<div class="stick-result" id="verse-result">
<span class="stick-level" id="verse-ref"></span>
<div class="stick-poem" id="verse-text"></div>
<p class="stick-mean" id="verse-mean"></p>
<p class="sub" style="margin-top:14px"><a href="#donate">""" + f["donate_h2"] + """ →</a></p>
</div>
</div>
""" + tasbih_html + """
<div class="card" id="wall">
<h2 class="sec">""" + f["wall_h2"] + """</h2>
<p class="sub">""" + f["wall_sub"] + """</p>
<label for="wish-text">""" + f["wall_label"] + """</label>
<textarea id="wish-text" maxlength="120" placeholder=\"""" + f["wall_ph"] + """\"></textarea>
<button class="btn2" id="hang-btn">""" + f["hang_btn"] + """</button>
<div class="wall" id="wall-list"></div>
</div>

<div class="card" id="donate">
<h2 class="sec">""" + f["donate_h2"] + """</h2>
<p class="sub">""" + f["donate_sub"] + """</p>
<div class="donate-grid">
<div class="donate-card">
<h3>USDT · TRC20</h3>
<small>Tron network · low fees · recommended</small>
<div class="qr" id="qr-trc"></div>
<div class="addr" id="addr-trc">(address opening soon)</div>
<button class="btn2" data-copy="addr-trc">""" + f["copy_text"] + """</button>
</div>
<div class="donate-card">
<h3>USDT · ERC20</h3>
<small>Ethereum network · higher fees</small>
<div class="qr" id="qr-erc"></div>
<div class="addr" id="addr-erc">(address opening soon)</div>
<button class="btn2" data-copy="addr-erc">""" + f["copy_text"] + """</button>
</div>
</div>
<p class="sub" style="margin-top:16px">""" + f["donate_note"] + """</p>
</div>
</main>
<footer>
BlessingNest · a quiet digital sanctuary ·
<a href="./">All Traditions</a><br>
Sisters: <a href="https://paychecknest.pages.dev/">PaycheckNest</a> ·
<a href="https://loannest.pages.dev/">LoanNest</a> ·
<a href="https://devnest-5nm.pages.dev/">DevNest</a><br>
An independent spiritual-comfort page. Not affiliated with any religious organization.
</footer>
<script>window.FAITH = """ + json.dumps(config, ensure_ascii=False) + """;
window.ADDR = """ + json.dumps({"trc20": ADDR_TRC20, "erc20": ADDR_ERC20}) + """;</script>
<script src="assets/qrcode.min.js"></script>
<script src="assets/app.js"></script>
</body></html>"""

    head = """<!DOCTYPE html>
<html lang=\"""" + f["lang"] + """\"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>""" + f["title"] + """</title>
<meta name="description" content=\"""" + f["desc"] + """\">
<link rel="canonical" href=\"""" + SITE_URL + "/" + f["path"] + """\">
<meta property="og:title" content=\"""" + f["title"] + """\">
<meta property="og:description" content=\"""" + f["desc"] + """\">
<meta property="og:type" content="website">
<link rel="stylesheet" href="assets/style.css">
<style>:root{""" + f["theme"] + """}</style>
</head><body>"""
    return (f["path"] + ".html", head + body)

def hub_page():
    cards = []
    info = [
        ("christian-prayer", "✝", "Christian Prayer Room", "Candles, Psalms & daily verses"),
        ("muslim-dua", "☪", "Muslim Dua Corner", "Daily dua & digital tasbih"),
        ("hindu-blessing", "🪔", "Hindu Diya & Blessing", "Light a diya, daily Gita wisdom"),
        ("jewish-blessing", "✡", "Jewish Candle & Blessing", "Candle lighting & daily Psalm"),
        ("buddhist-blessing", "☸", "Buddhist Blessing", "Candles & Dhammapada verses"),
        ("chinese-blessing", "🏮", "祈福阁", "点灯祈福 · 每日一签 · 功德随喜"),
    ]
    for path, icon, name, sub in info:
        cards.append('<a class="tile" href="%s"><span style="font-size:30px">%s</span><b>%s</b><small>%s</small></a>' % (path, icon, name, sub))
    body = """
<div class="hero" style="text-align:center;padding:60px 0 20px">
<div style="font-size:46px;letter-spacing:6px;color:var(--gold);font-weight:700">BLESSINGNEST</div>
<p style="color:var(--muted);margin-top:12px;font-size:17px">A quiet digital sanctuary for every tradition.<br>Light a candle. Say a prayer. Leave a blessing.</p>
</div>
<div class="grid hub-grid">""" + "".join(cards) + """</div>
<div class="card content" style="margin-top:30px">
<p style="color:var(--muted);font-size:14px;text-align:center">
Every tradition here shares one flame. Whatever you call it — prayer, dua, mantra, bracha, blessing, 祈福 —
the act of pausing to wish someone well is universal.<br><br>
BlessingNest is an independent spiritual-comfort project, not affiliated with any religious organization.<br>
Sisters: <a href="https://paychecknest.pages.dev/">PaycheckNest</a> ·
<a href="https://loannest.pages.dev/">LoanNest</a> ·
<a href="https://devnest-5nm.pages.dev/">DevNest</a></p>
</div>"""
    head = """<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BlessingNest — Online Prayer, Dua, Blessing & Candle Lighting for Every Faith</title>
<meta name="description" content="A quiet digital sanctuary: light a candle, receive a daily verse, and leave a blessing — Christian, Muslim, Hindu, Jewish, Buddhist and Chinese traditions. Optional USDT giving.">
<link rel="canonical" href=\"""" + SITE_URL + """/\">
<meta property="og:title" content="BlessingNest — Online Sanctuary for Every Faith">
<meta property="og:description" content="Light a candle. Say a prayer. Leave a blessing.">
<meta property="og:type" content="website">
<link rel="stylesheet" href="assets/style.css">
<style>
:root{--bg:#120c08;--bg2:#1c120a;--card:#221610;--line:#3d2a1c;--gold:#e8c15a;--gold2:#c9a227;--ink:#f2e6d0;--muted:#b39a86}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;max-width:760px;margin:20px auto;padding:0 20px}
.tile{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:26px 16px;color:var(--ink);text-decoration:none;text-align:center;transition:.15s}
.tile:hover{border-color:var(--gold);transform:translateY(-2px)}
.tile b{font-size:16px}
.tile small{color:var(--muted)}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:24px}
a{color:var(--gold)}
</style>
</head><body>"""
    return ("index.html", head + body + "</body></html>")

def main():
    os.makedirs(DIST, exist_ok=True)
    shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(DIST, "assets"), dirs_exist_ok=True)

    pages = [hub_page()]
    for f in FAITHS:
        pages.append(faith_page(f))

    for filename, html in pages:
        with open(os.path.join(DIST, filename), "w", encoding="utf-8") as fp:
            fp.write(html)

    urls = [SITE_URL + ("/" if fn == "index.html" else "/" + fn[:-5]) for fn, _ in pages]
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sitemap.append("<url><loc>%s</loc></url>" % u)
    sitemap.append("</urlset>")
    with open(os.path.join(DIST, "sitemap.xml"), "w", encoding="utf-8") as fp:
        fp.write("\n".join(sitemap))
    with open(os.path.join(DIST, "robots.txt"), "w", encoding="utf-8") as fp:
        fp.write("User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n" % SITE_URL)
    with open(os.path.join(DIST, INDEXNOW_KEY + ".txt"), "w", encoding="utf-8") as fp:
        fp.write(INDEXNOW_KEY)
    with open(os.path.join(DIST, "googlea71fab601229e434.html"), "w", encoding="utf-8") as fp:
        fp.write("google-site-verification: googlea71fab601229e434.html")

    print("Built %d pages -> %s" % (len(pages), DIST))

if __name__ == "__main__":
    main()
