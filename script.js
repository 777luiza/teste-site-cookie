
(function () {
  // Número da loja com DDI e DDD, só dígitos. Exemplo: "5531900000000". Vazio esconde o botão do WhatsApp.
  var WHATS = "";
  var UNIT_PRICE = 14; // preço do cookie na unidade (exemplo)

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SIZES = [
    { n: 2, price: 24, tag: "para provar" },
    { n: 4, price: 44, tag: "para dividir" },
    { n: 6, price: 62, tag: "a mais pedida" },
    { n: 12, price: 118, tag: "para presentear" }
  ];
  var FLAVORS = [
    { id: "trad", name: "Tradicional", desc: "Massa amanteigada com gotas de chocolate ao leite.", dough: "#DDA763", chip: "#4A2B1F", tile: "#FFC46B" },
    { id: "belga", name: "Chocolate belga", desc: "Massa de cacau com pedaços de chocolate meio amargo.", dough: "#6B3F2C", chip: "#2A1510", tile: "#C98A6B" },
    { id: "red", name: "Red velvet", desc: "Massa vermelha com recheio de cream cheese.", dough: "#B8323C", chip: "#FFF1E6", tile: "#FF6B81" },
    { id: "pist", name: "Pistache", desc: "Creme de pistache e chocolate branco.", dough: "#A8BE74", chip: "#F7F1DC", tile: "#9FD36B" },
    { id: "ninho", name: "Ninho com Nutella", desc: "Leite em pó na massa e recheio de avelã.", dough: "#EBD3A0", chip: "#5A3320", tile: "#FFD98A" },
    { id: "dl", name: "Doce de leite", desc: "Recheio mole de doce de leite e flocos de sal.", dough: "#C98A44", chip: "#7A4524", tile: "#F2A04E" },
    { id: "lim", name: "Limão siciliano", desc: "Massa cítrica com cobertura de chocolate branco.", dough: "#E6CF5E", chip: "#FFFFFF", tile: "#FFE45C" },
    { id: "oreo", name: "Cookies and cream", desc: "Massa escura com pedaços de biscoito recheado.", dough: "#3E3430", chip: "#F4F0EA", tile: "#9A8CFF" }
  ];

  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 2147483647; return h; }
  function rng(seed) { var x = seed || 1; return function () { x = (x * 48271) % 2147483647; return x / 2147483647; }; }
  function darken(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(v) { return Math.max(0, Math.round(v * (1 - k))); }
    return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")";
  }

  // Cookie visto de cima, com borda irregular, volume, lascas e farelos.
  function cookieSvg(f, cls) {
    var r = rng(hash(f.id)), s = '<svg viewBox="-52 -52 104 104" xmlns="http://www.w3.org/2000/svg"' + (cls ? ' class="' + cls + '"' : '') + '>';
    s += '<ellipse cx="2" cy="9" rx="42" ry="38" fill="#000" opacity=".3" filter="url(#ck-blur)"/>';
    s += '<circle cx="0" cy="3.5" r="42" fill="' + darken(f.dough, 0.35) + '" filter="url(#ck-rough)"/>';
    s += '<circle r="42" fill="' + f.dough + '" filter="url(#ck-rough)"/>';
    s += '<circle r="42" fill="url(#ck-shade)" filter="url(#ck-rough)"/>';
    s += '<circle cx="-10" cy="-13" r="30" fill="url(#ck-light)"/>';
    var i, a, d, x, y;
    for (i = 0; i < 3; i++) {
      a = r() * 6.28; d = 8 + r() * 22; x = Math.cos(a) * d; y = Math.sin(a) * d;
      s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q' + (r() * 10 - 5).toFixed(1) + ' ' + (r() * 8).toFixed(1) + ' ' + (r() * 14 - 7).toFixed(1) + ' ' + (r() * 8 + 3).toFixed(1) + '" fill="none" stroke="' + darken(f.dough, 0.45) + '" stroke-opacity=".45" stroke-width="0.9" stroke-linecap="round"/>';
    }
    for (i = 0; i < 34; i++) {
      a = r() * 6.28; d = Math.sqrt(r()) * 38; x = Math.cos(a) * d; y = Math.sin(a) * d;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (0.4 + r() * 0.9).toFixed(2) + '" fill="' + (r() > 0.5 ? darken(f.dough, 0.35) : '#fff') + '" opacity=".35"/>';
    }
    for (i = 0; i < 9; i++) {
      a = (i / 9) * 6.28 + r() * 0.7; d = (i % 3 === 0 ? 8 : 26) + r() * 8;
      x = Math.cos(a) * d; y = Math.sin(a) * d;
      var pts = [], n = 6, k, rad, p1 = [], base = 4.2 + r() * 3.4;
      for (k = 0; k < n; k++) {
        rad = base * (0.7 + r() * 0.6);
        pts.push((x + Math.cos(k / n * 6.28) * rad).toFixed(1) + ',' + (y + Math.sin(k / n * 6.28) * rad * 0.82).toFixed(1));
        p1.push((x - 0.8 + Math.cos(k / n * 6.28) * rad * 0.55).toFixed(1) + ',' + (y - 0.9 + Math.sin(k / n * 6.28) * rad * 0.45).toFixed(1));
      }
      s += '<polygon points="' + pts.join(' ') + '" fill="' + f.chip + '" stroke="#000" stroke-opacity=".25" stroke-width=".6" stroke-linejoin="round"/>';
      s += '<polygon points="' + p1.join(' ') + '" fill="#fff" opacity=".28"/>';
    }
    return s + '</svg>';
  }

  function $(id) { return document.getElementById(id); }
  function brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function byId(id) { for (var i = 0; i < FLAVORS.length; i++) if (FLAVORS[i].id === id) return FLAVORS[i]; }
  function sizeInfo(n) { for (var i = 0; i < SIZES.length; i++) if (SIZES[i].n === n) return SIZES[i]; }
  function visible(el) { return !!(el && el.offsetParent !== null); }

  /* ---------- armazenamento (com reserva em memória) ---------- */
  var mem = {};
  var store = {
    get: function (k) { try { var v = window.localStorage.getItem(k); return v === null ? (mem[k] || null) : v; } catch (e) { return mem[k] || null; } },
    set: function (k, v) { mem[k] = v; try { window.localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { delete mem[k]; try { window.localStorage.removeItem(k); } catch (e) {} }
  };
  function readJSON(k, fallback) { try { var v = store.get(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }

  /* ---------- estado ---------- */
  var state = { size: 6, counts: {}, boxes: [], units: {}, mode: "box" };
  var prevFilled = 0, prevFull = false, session = null, afterLogin = "";

  function boxTotal() { var t = 0; for (var k in state.counts) t += state.counts[k]; return t; }
  function unitCount() { var t = 0; for (var k in state.units) t += state.units[k]; return t; }
  function cartCount() { return state.boxes.length + unitCount(); }
  function orderTotal() {
    return state.boxes.reduce(function (a, b) { return a + b.price; }, 0) + unitCount() * UNIT_PRICE;
  }

  function saveCart() { store.set("ck-cart", JSON.stringify({ boxes: state.boxes, units: state.units })); }
  function loadCart() {
    var d = readJSON("ck-cart", null);
    if (!d || typeof d !== "object") return;
    if (Array.isArray(d.boxes)) {
      d.boxes.forEach(function (b) {
        if (!b || !sizeInfo(b.size) || !b.counts || typeof b.counts !== "object") return;
        var counts = {}, sum = 0;
        FLAVORS.forEach(function (f) {
          var c = Math.floor(Number(b.counts[f.id]));
          if (c > 0) { counts[f.id] = c; sum += c; }
        });
        if (sum === b.size) state.boxes.push({ size: b.size, price: sizeInfo(b.size).price, counts: counts });
      });
    }
    if (d.units && typeof d.units === "object") {
      FLAVORS.forEach(function (f) {
        var c = Math.floor(Number(d.units[f.id]));
        if (c > 0) state.units[f.id] = Math.min(c, 99);
      });
    }
  }

  /* ---------- arte estática e hero ---------- */
  $("logo-cookie").innerHTML = cookieSvg(FLAVORS[0]);
  $("mini-cookie").innerHTML = cookieSvg(FLAVORS[0]);
  $("hero-main").innerHTML = cookieSvg(FLAVORS[0]);
  $("m1").innerHTML = cookieSvg(FLAVORS[1]);
  $("m2").innerHTML = cookieSvg(FLAVORS[2]);
  $("m3").innerHTML = cookieSvg(FLAVORS[3]);
  $("auth-art-l").innerHTML = cookieSvg(FLAVORS[2]);
  $("auth-art-r").innerHTML = cookieSvg(FLAVORS[4]);
  $("auth-art-c").innerHTML = cookieSvg(FLAVORS[0]);
  $("empty-art").innerHTML = cookieSvg(FLAVORS[5]);

  var heroArt = $("hero-art"), sr = rng(99), sc = ["#E0207A", "#FFD166", "#7BD3C4", "#9A8CFF", "#FF9F6B"];
  for (var si = 0; si < 16; si++) {
    var sp = document.createElement("i");
    sp.className = "sprinkle";
    sp.style.left = (sr() * 96).toFixed(1) + "%";
    sp.style.top = (sr() * 92).toFixed(1) + "%";
    sp.style.background = sc[si % sc.length];
    sp.style.setProperty("--r", Math.round(sr() * 180) + "deg");
    sp.style.animationDelay = (-sr() * 3).toFixed(2) + "s";
    heroArt.appendChild(sp);
  }

  var tk = "", words = ["Cookies artesanais", "Monte sua caixa", "Ou leve na unidade", "Peça pelo WhatsApp", "Sabores da semana"], w;
  for (w = 0; w < 2; w++) for (var wi = 0; wi < words.length; wi++) tk += "<span>" + words[wi] + "</span>";
  $("ticker").innerHTML = tk;

  var hero = $("hero");
  if (!reduce) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      heroArt.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      heroArt.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    hero.addEventListener("pointerleave", function () {
      heroArt.style.setProperty("--mx", 0); heroArt.style.setProperty("--my", 0);
    });
  }

  /* ---------- vitrine ---------- */
  var tilesEl = $("tiles");
 
    var d = document.createElement("article");
    d.className = "tile";
    d.dataset.id = f.id;
    d.style.setProperty("--c", f.tile);
    d.style.setProperty("--i", i);
    d.setAttribute("data-reveal", "");
    d.dataset.delay = (i % 4) * 80;
    d.innerHTML = '<span class="badge num" hidden></span><div class="art">' + + '</div>' +
      '<h3>' + f.name + '</h3><p class="desc">' + f.desc + '</p>' +
      '<button class="pill solid" type="button">Colocar na caixa</button>';
    tilesEl.appendChild(d);
    d.addEventListener("pointermove", function (e) {
      if (reduce) return;
      var r = d.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5;
      d.style.setProperty("--rot", (px * 36).toFixed(1) + "deg");
      d.style.setProperty("--sc", "1.08");
    });
    d.addEventListener("pointerleave", function () {
      d.style.setProperty("--rot", "0deg"); d.style.setProperty("--sc", "1");
    });
  });
  tilesEl.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn || btn.disabled) return;
    var tile = btn.closest(".tile"), svg = tile.querySelector(".art svg");
    if (state.mode === "unit") addUnit(tile.dataset.id, svg);
    else addOne(tile.dataset.id, svg);
  });

  function setMode(m) {
    state.mode = m;
    $("mode-box").setAttribute("aria-pressed", String(m === "box"));
    $("mode-unit").setAttribute("aria-pressed", String(m === "unit"));
    $("show-sub").textContent = m === "unit"
      ? "Leve só os cookies que quiser, sem montar caixa. Cada um custa " + brl(UNIT_PRICE) + "."
      : "Toque em um sabor para colocar na sua caixa.";
    updateTiles();
  }
  $("mode-box").addEventListener("click", function () { setMode("box"); });
  $("mode-unit").addEventListener("click", function () { setMode("unit"); });
  function goUnit(e) {
    if (e) e.preventDefault();
    setMode("unit");
    if (location.hash !== "#sabores") location.hash = "sabores"; else $("sabores").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $("go-unit").addEventListener("click", goUnit);
  $("hero-unit").addEventListener("click", function () { setMode("unit"); });
  $("empty-unit").addEventListener("click", function () { setMode("unit"); });

  function updateTiles() {
    var full = boxTotal() >= state.size, unit = state.mode === "unit";
    Array.prototype.forEach.call(tilesEl.children, function (tile) {
      var id = tile.dataset.id, badge = tile.querySelector(".badge"), btn = tile.querySelector("button");
      var c = unit ? (state.units[id] || 0) : (state.counts[id] || 0);
      var txt = c + (unit ? " no carrinho" : " na caixa");
      var was = badge.textContent;
      badge.hidden = c === 0;
      badge.textContent = txt;
      if (was !== txt && c > 0) { badge.style.animation = "none"; void badge.offsetWidth; badge.style.animation = ""; }
      if (unit) { btn.disabled = false; btn.textContent = "Adicionar 1 · " + brl(UNIT_PRICE); }
      else { btn.disabled = full; btn.textContent = full ? "Caixa cheia" : "Colocar na caixa"; }
    });
  }

  /* ---------- tamanhos e sabores do montador ---------- */
  var sizesEl = $("sizes");
  SIZES.forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "size";
    b.dataset.n = s.n;
    b.innerHTML = '<strong>' + s.n + '</strong><span>cookies, ' + s.tag + '</span><span class="price num">' + brl(s.price) + '</span>';
    b.addEventListener("click", function () { setSize(s.n); });
    sizesEl.appendChild(b);
  });

  var flavorsEl = $("flavors");
  FLAVORS.forEach(function (f) {
    var d = document.createElement("div");
    d.className = "flavor";
    d.dataset.id = f.id;
    d.innerHTML = cookieSvg(f) +
      '<h3>' + f.name + '</h3>' +
      '<div class="stepper">' +
      '<button class="round" type="button" data-act="minus" aria-label="Tirar um ' + f.name + '">&minus;</button>' +
      '<span class="qty num" aria-live="polite">0</span>' +
      '<button class="round" type="button" data-act="plus" aria-label="Adicionar um ' + f.name + '">+</button>' +
      '</div>';
    flavorsEl.appendChild(d);
  });
  flavorsEl.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-act]");
    if (!btn) return;
    var row = btn.closest(".flavor"), id = row.dataset.id;
    if (btn.dataset.act === "plus") addOne(id, row.querySelector("svg"));
    else if (state.counts[id] > 0) {
      state.counts[id]--;
      if (state.counts[id] === 0) delete state.counts[id];
      update(id);
    }
  });

  function addOne(id, srcEl) {
    if (boxTotal() >= state.size) return;
    state.counts[id] = (state.counts[id] || 0) + 1;
    fly(srcEl, id, visible($("box-btn")) ? $("box-btn") : $("cart-link"));
    update(id);
    snack(byId(id).name + " na caixa (" + boxTotal() + "/" + state.size + ")");
  }
  function addUnit(id, srcEl) {
    if ((state.units[id] || 0) >= 99) return;
    state.units[id] = (state.units[id] || 0) + 1;
    fly(srcEl, id, $("cart-link"));
    cartChanged();
    snack("1 " + byId(id).name + " no carrinho");
  }

  function setSize(n) {
    state.size = n;
    var ids = Object.keys(state.counts);
    while (boxTotal() > n && ids.length) {
      var last = ids[ids.length - 1];
      if (state.counts[last] > 1) state.counts[last]--;
      else { delete state.counts[last]; ids.pop(); }
    }
    update();
  }

  function expand(counts) {
    var arr = [];
    FLAVORS.forEach(function (f) { for (var i = 0; i < (counts[f.id] || 0); i++) arr.push(f.id); });
    return arr;
  }
  function describe(counts) {
    return FLAVORS.filter(function (f) { return counts[f.id]; })
      .map(function (f) { return counts[f.id] + "x " + f.name; }).join(", ");
  }

  /* ---------- efeitos ---------- */
  var snackTimer;
  function snack(msg) {
    var el = $("snack");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(snackTimer);
    snackTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }
  function bumpEl(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

  function fly(srcEl, id, target) {
    if (target) bumpEl(target);
    if (reduce || !srcEl || !srcEl.animate || !target) return;
    var a = srcEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    var size = Math.min(a.width, 90);
    var c = document.createElement("div");
    c.className = "fly";
    c.style.width = size + "px"; c.style.height = size + "px";
    c.style.left = (a.left + a.width / 2 - size / 2) + "px";
    c.style.top = (a.top + a.height / 2 - size / 2) + "px";
    c.innerHTML = cookieSvg(byId(id));
    document.body.appendChild(c);
    var dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    var an = c.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: "translate(" + (dx * 0.5) + "px," + (dy * 0.5 - 60) + "px) scale(.8) rotate(180deg)", opacity: 1, offset: 0.5 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.2) rotate(360deg)", opacity: .6 }
    ], { duration: 750, easing: "cubic-bezier(.5,0,.3,1)" });
    an.onfinish = function () { if (c.parentNode) c.parentNode.removeChild(c); };
  }

  function confetti(fromEl) {
    if (reduce || !fromEl.getBoundingClientRect) return;
    var r = fromEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var colors = ["#E0207A", "#FFD166", "#7BD3C4", "#9A8CFF", "#FF9F6B"];
    for (var i = 0; i < 28; i++) {
      var p = document.createElement("i");
      p.className = "confetti";
      p.style.left = cx + "px"; p.style.top = cy + "px";
      p.style.background = colors[i % colors.length];
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI - Math.PI, dist = 80 + Math.random() * 140;
      var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 40;
      (function (el, dx, dy) {
        var an = el.animate([
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + dx + "px," + dy + "px) rotate(" + (Math.random() * 540) + "deg)", opacity: 1, offset: 0.6 },
          { transform: "translate(" + dx * 1.1 + "px," + (dy + 160) + "px) rotate(720deg)", opacity: 0 }
        ], { duration: 1100 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.3,1)" });
        an.onfinish = function () { if (el.parentNode) el.parentNode.removeChild(el); };
      })(p, dx, dy);
    }
  }

  /* ---------- montador ---------- */
  function update(changedId) {
    var t = boxTotal(), size = sizeInfo(state.size), full = t >= state.size;
    Array.prototype.forEach.call(sizesEl.children, function (b) {
      b.setAttribute("aria-pressed", String(Number(b.dataset.n) === state.size));
    });
    Array.prototype.forEach.call(flavorsEl.children, function (card) {
      var id = card.dataset.id, c = state.counts[id] || 0, q = card.querySelector(".qty");
      if (q.textContent !== String(c)) {
        q.textContent = c;
        if (id === changedId) { q.classList.remove("tick"); void q.offsetWidth; q.classList.add("tick"); }
      }
      card.classList.toggle("has", c > 0);
      card.querySelector('[data-act="minus"]').disabled = c === 0;
      card.querySelector('[data-act="plus"]').disabled = full;
    });
    $("count-label").textContent = t + " de " + state.size + " escolhidos";
    $("panel-title").textContent = "Caixa de " + state.size + " cookies";
    $("box-count").textContent = t + "/" + state.size;
    $("bar-fill").style.width = (t / state.size * 100) + "%";

    var ids = expand(state.counts), html = "";
    for (var i = 0; i < state.size; i++) {
      if (ids[i]) html += '<div class="slot filled' + (i >= prevFilled ? ' pop' : '') + '">' + cookieSvg(byId(ids[i])) + '</div>';
      else html += '<div class="slot"></div>';
    }
    $("slots").innerHTML = html;
    prevFilled = ids.length;

    var left = state.size - t;
    $("status").innerHTML = left > 0
      ? 'Faltam <b>' + left + '</b> para fechar a caixa. Valor: <b>' + brl(size.price) + '</b>'
      : 'Caixa completa. Valor: <b>' + brl(size.price) + '</b>';
    var addBtn = $("add-box");
    addBtn.disabled = left !== 0;
    addBtn.classList.toggle("ready", left === 0);
    $("clear-box").disabled = t === 0;
    if (full && !prevFull && t > 0) { confetti(addBtn); snack("Caixa completa! Adicione ao carrinho."); }
    prevFull = full;
    updateTiles();
  }

  $("clear-box").addEventListener("click", function () { state.counts = {}; prevFilled = 0; update(); });
  $("add-box").addEventListener("click", function () {
    if (boxTotal() !== state.size) return;
    state.boxes.push({ size: state.size, price: sizeInfo(state.size).price, counts: JSON.parse(JSON.stringify(state.counts)) });
    state.counts = {};
    prevFilled = 0; prevFull = false;
    update();
    cartChanged();
    bumpEl($("cart-link"));
    snack("Caixa adicionada ao carrinho");
  });

  /* ---------- carrinho ---------- */
  function cartChanged() {
    saveCart();
    $("cart-cnt").textContent = cartCount();
    $("panel-cart").textContent = cartCount() ? "Ver carrinho (" + cartCount() + ")" : "Ver carrinho";
    updateTiles();
    renderCartPage();
  }

  var cartRendered = 0;
  function renderCartPage() {
    var n = cartCount(), empty = n === 0;
    $("cart-empty").hidden = !empty;
    $("cart-layout").hidden = empty;
    if (empty) { buildMessage(); cartRendered = 0; return; }
    var h = "", idx = 0;
    state.boxes.forEach(function (b, i) {
      var arts = expand(b.counts).map(function (id) { return cookieSvg(byId(id)); }).join("");
      h += '<div class="cart-item' + (idx < cartRendered ? ' nofx' : '') + '"><span class="tagbox">Caixa</span>' +
        '<div class="box-head"><strong>Caixa ' + (i + 1) + ' (' + b.size + ' cookies)</strong><span class="num">' + brl(b.price) + '</span></div>' +
        '<div class="box-art" aria-hidden="true">' + arts + '</div>' +
        '<p class="box-list">' + describe(b.counts) + '</p>' +
        '<button class="link-btn" type="button" data-rm-box="' + i + '">Remover caixa</button></div>';
      idx++;
    });
    FLAVORS.forEach(function (f) {
      var q = state.units[f.id];
      if (!q) return;
      h += '<div class="cart-item' + (idx < cartRendered ? ' nofx' : '') + '"><span class="tagbox">Unidade</span><div class="unit-row">' + cookieSvg(f, "ck") +
        '<div><h3>' + f.name + '</h3><p class="sub num">' + brl(UNIT_PRICE) + ' cada</p></div>' +
        '<div class="unit-side"><div class="stepper">' +
        '<button class="round" type="button" data-u="' + f.id + '" data-act="minus" aria-label="Tirar um ' + f.name + '">&minus;</button>' +
        '<span class="qty num">' + q + '</span>' +
        '<button class="round" type="button" data-u="' + f.id + '" data-act="plus" aria-label="Adicionar um ' + f.name + '"' + (q >= 99 ? ' disabled' : '') + '>+</button></div>' +
        '<span class="line-price num">' + brl(q * UNIT_PRICE) + '</span></div></div></div>';
      idx++;
    });
    cartRendered = idx;
    $("cart-items").innerHTML = h;

    var lines = "";
    if (state.boxes.length) lines += '<div class="sum-line num"><span>Caixas (' + state.boxes.length + ')</span><span>' + brl(state.boxes.reduce(function (a, b) { return a + b.price; }, 0)) + '</span></div>';
    if (unitCount()) lines += '<div class="sum-line num"><span>Cookies na unidade (' + unitCount() + ')</span><span>' + brl(unitCount() * UNIT_PRICE) + '</span></div>';
    lines += '<div class="sum-line"><span>Entrega</span><span>a combinar</span></div>';
    $("sum-lines").innerHTML = lines;
    $("sum-total").textContent = brl(orderTotal());
    buildMessage();
  }

  $("cart-items").addEventListener("click", function (e) {
    var rm = e.target.closest("[data-rm-box]");
    if (rm) { state.boxes.splice(Number(rm.dataset.rmBox), 1); cartRendered = 0; cartChanged(); snack("Caixa removida"); return; }
    var u = e.target.closest("[data-u]");
    if (u) {
      var id = u.dataset.u, q = state.units[id] || 0;
      if (u.dataset.act === "plus" && q < 99) q++;
      else if (u.dataset.act === "minus") q--;
      if (q <= 0) { delete state.units[id]; cartRendered = 0; snack(byId(id).name + " removido"); } else state.units[id] = q;
      cartChanged();
    }
  });

  function buildMessage() {
    var lines = [];
    var name = $("f-name").value.trim();
    lines.push("Olá, Coolkie! Quero fazer um pedido" + (name ? " em nome de " + name : "") + ".");
    lines.push("");
    if (!cartCount()) lines.push("(carrinho vazio)");
    state.boxes.forEach(function (b, i) {
      lines.push("Caixa " + (i + 1) + " (" + b.size + " cookies) - " + brl(b.price));
      lines.push(describe(b.counts));
      lines.push("");
    });
    if (unitCount()) {
      lines.push("Cookies na unidade (" + brl(UNIT_PRICE) + " cada):");
      FLAVORS.forEach(function (f) { if (state.units[f.id]) lines.push(state.units[f.id] + "x " + f.name); });
      lines.push("");
    }
    lines.push("Total: " + brl(orderTotal()));
    if ($("f-mode").value === "entrega") {
      var addr = $("f-addr").value.trim();
      lines.push("Entrega" + (addr ? ": " + addr : " (endereço a combinar)"));
    } else lines.push("Retirada na loja");
    var note = $("f-note").value.trim();
    if (note) lines.push("Obs.: " + note);
    var text = lines.join("\n");
    $("f-preview").value = text;
    var wa = $("wa-link");
    if (WHATS && cartCount()) { wa.hidden = false; wa.href = "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(text); }
    else wa.hidden = true;
    $("copy-btn").disabled = !cartCount();
    return text;
  }

  ["f-name", "f-addr", "f-note"].forEach(function (id) { $(id).addEventListener("input", buildMessage); });
  $("f-mode").addEventListener("change", function () {
    $("addr-wrap").hidden = $("f-mode").value !== "entrega";
    prefill();
    buildMessage();
  });

  $("copy-btn").addEventListener("click", function () {
    var text = buildMessage(), ta = $("f-preview");
    function fallback() {
      ta.focus(); ta.select();
      $("toast").textContent = "Selecionamos a mensagem. Use Copiar do seu aparelho.";
    }
    try {
      navigator.clipboard.writeText(text).then(function () { $("toast").textContent = "Mensagem copiada."; snack("Mensagem copiada"); }, fallback);
    } catch (e) { fallback(); }
  });

  /* ---------- contas (salvas só neste navegador) ---------- */
  function accounts() { return readJSON("ck-accounts", {}); }
  function saveAccounts(o) { store.set("ck-accounts", JSON.stringify(o)); }
  function normEmail(s) { return String(s || "").trim().toLowerCase(); }
  function currentAccount() { return session ? accounts()[session] : null; }

  function sha256(text) {
    if (!(window.crypto && window.crypto.subtle && window.TextEncoder)) return Promise.reject(new Error("nocrypto"));
    return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    });
  }
  function randomSalt() {
    var a = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
    else for (var i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 256);
    return Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }

  function refreshAccountUI() {
    var acc = currentAccount();
    var first = acc && acc.name ? acc.name.trim().split(/\s+/)[0] : "";
    $("acct-lbl").textContent = first || "Entrar";
    $("acct-link").setAttribute("href", acc ? "#conta" : "#entrar");
    $("acct-link").setAttribute("aria-label", acc ? "Minha conta" : "Entrar");
    $("foot-acct").textContent = acc ? "Minha conta" : "Entrar";
    $("foot-acct").setAttribute("href", acc ? "#conta" : "#entrar");
    var hint = $("acct-hint");
    if (acc) {
      hint.innerHTML = "";
      var s1 = document.createElement("span");
      s1.textContent = "Pedindo como " + (acc.name || acc.email) + ". Seus dados foram preenchidos abaixo.";
      hint.appendChild(s1);
    } else {
      hint.innerHTML = '<span>Não precisa de conta para pedir.</span><span><a href="#entrar" data-after="carrinho">Entrar</a> ou <a href="#cadastro" data-after="carrinho">criar conta</a> para salvar seus dados.</span>';
    }
  }
  $("acct-hint").addEventListener("click", function (e) {
    var a = e.target.closest("[data-after]");
    if (a) afterLogin = a.dataset.after;
  });

  function prefill() {
    var acc = currentAccount();
    if (!acc) return;
    if (!$("f-name").value) $("f-name").value = acc.name || "";
    if (!$("f-addr").value && acc.address) $("f-addr").value = acc.address;
  }

  function finishAuth(msg) {
    refreshAccountUI();
    snack(msg);
    var dest = afterLogin || (cartCount() ? "carrinho" : "conta");
    afterLogin = "";
    if (location.hash === "#" + dest) route(); else location.hash = dest;
  }

  $("form-signup").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("s-name").value.trim(), email = normEmail($("s-email").value), phone = $("s-phone").value.trim();
    var p1 = $("s-pass").value, p2 = $("s-pass2").value, addr = $("s-addr").value.trim(), err = $("s-err");
    ["s-name", "s-email", "s-phone", "s-pass", "s-pass2"].forEach(function (id) { $(id).removeAttribute("aria-invalid"); });
    function bad(id, msg) { $(id).setAttribute("aria-invalid", "true"); $(id).focus(); err.textContent = msg; }
    if (name.length < 2) return bad("s-name", "Digite seu nome.");
    if (phone.replace(/\D/g, "").length < 10) return bad("s-phone", "Digite o WhatsApp com DDD.");
    if (!validEmail(email)) return bad("s-email", "Digite um e-mail válido.");
    if (p1.length < 6) return bad("s-pass", "A senha precisa ter pelo menos 6 caracteres.");
    if (p1 !== p2) return bad("s-pass2", "As senhas não são iguais.");
    var all = accounts();
    if (all[email]) return bad("s-email", "Já existe uma conta com esse e-mail. Entre ou use outro e-mail.");
    err.textContent = "";
    var salt = randomSalt();
    sha256(salt + p1).then(function (hh) {
      all[email] = { name: name, phone: phone, address: addr, salt: salt, hash: hh };
      saveAccounts(all);
      session = email; store.set("ck-session", email);
      $("form-signup").reset();
      finishAuth("Conta criada. Bem-vinda(o), " + name.split(/\s+/)[0] + "!");
    }, function () { err.textContent = "Este navegador não permite criar conta aqui. Você ainda pode pedir sem conta."; });
  });

  $("form-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = normEmail($("l-email").value), pass = $("l-pass").value, err = $("l-err");
    ["l-email", "l-pass"].forEach(function (id) { $(id).removeAttribute("aria-invalid"); });
    if (!validEmail(email)) { $("l-email").setAttribute("aria-invalid", "true"); $("l-email").focus(); err.textContent = "Digite um e-mail válido."; return; }
    if (!pass) { $("l-pass").setAttribute("aria-invalid", "true"); $("l-pass").focus(); err.textContent = "Digite sua senha."; return; }
    var acc = accounts()[email];
    function wrong() { $("l-pass").setAttribute("aria-invalid", "true"); err.textContent = "E-mail ou senha incorretos."; }
    if (!acc) { sha256("x").then(wrong, wrong); return; }
    err.textContent = "";
    sha256(acc.salt + pass).then(function (hh) {
      if (hh !== acc.hash) return wrong();
      session = email; store.set("ck-session", email);
      $("form-login").reset();
      finishAuth("Você entrou na sua conta");
    }, function () { err.textContent = "Este navegador não permite entrar aqui. Você ainda pode pedir sem conta."; });
  });

  $("form-account").addEventListener("submit", function (e) {
    e.preventDefault();
    var acc = currentAccount(), err = $("c-err");
    if (!acc) return;
    var name = $("c-name").value.trim();
    if (name.length < 2) { err.textContent = "Digite seu nome."; $("c-name").focus(); return; }
    var all = accounts();
    all[session].name = name;
    all[session].phone = $("c-phone").value.trim();
    all[session].address = $("c-addr").value.trim();
    saveAccounts(all);
    err.textContent = "";
    refreshAccountUI();
    $("acct-hello").textContent = "Olá, " + name.split(/\s+/)[0] + "!";
    snack("Dados salvos");
  });

  $("logout-btn").addEventListener("click", function () {
    session = null; store.del("ck-session");
    refreshAccountUI();
    snack("Você saiu da conta");
    location.hash = "entrar";
  });

  document.addEventListener("click", function (e) {
    var eye = e.target.closest(".eye");
    if (!eye) return;
    var input = eye.parentNode.querySelector("input");
    var show = input.type === "password";
    input.type = show ? "text" : "password";
    eye.textContent = show ? "Ocultar" : "Mostrar";
  });

  function fillAccount() {
    var acc = currentAccount();
    if (!acc) return;
    $("c-email").value = session;
    $("c-name").value = acc.name || "";
    $("c-phone").value = acc.phone || "";
    $("c-addr").value = acc.address || "";
    $("acct-hello").textContent = "Olá, " + (acc.name || "").split(/\s+/)[0] + "!";
    $("c-err").textContent = "";
  }

  /* ---------- páginas (rotas por hash) ---------- */
  var PAGES = ["carrinho", "entrar", "cadastro", "conta"];
  var TITLES = { carrinho: "cart-title", entrar: "login-title", cadastro: "signup-title", conta: "conta-title" };
  function route() {
    var h = (location.hash || "").slice(1);
    if (h === "conta" && !currentAccount()) { location.hash = "entrar"; return; }
    if ((h === "entrar" || h === "cadastro") && currentAccount()) { location.hash = "conta"; return; }
    var v = PAGES.indexOf(h) >= 0 ? h : "home";
    ["home"].concat(PAGES).forEach(function (id) { $("view-" + id).hidden = id !== v; });
    if (v === "home") {
      var target = h && document.getElementById(h);
      if (target && $("view-home").contains(target)) {
        requestAnimationFrame(function () { target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); });
      } else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
      var t = $(TITLES[v]);
      if (t) t.focus({ preventScroll: true });
      if (v === "carrinho") { prefill(); renderCartPage(); }
      if (v === "conta") fillAccount();
    }
    onScroll();
  }
  window.addEventListener("hashchange", route);

  /* ---------- barra e rolagem ---------- */
  var nav = $("nav"), prog = $("progress"), ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop, max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("stuck", y > 8);
    prog.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------- entrada suave das seções ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(revealEls, function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.95 && r.height > 0) {
        el.classList.add("pre");
        if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "ms";
        io.observe(el);
      }
    });
    setTimeout(function () {
      Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("in"); });
    }, 6000);
  }

  /* ---------- início ---------- */
  loadCart();
  var saved = store.get("ck-session");
  if (saved && accounts()[saved]) session = saved;
  refreshAccountUI();
  update();
  cartChanged();
  route();
  onScroll();
})();
