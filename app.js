"use strict";
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const cop = n => new Intl.NumberFormat("es-CO", { style:"currency", currency:"COP", maximumFractionDigits:0 }).format(n);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const waUrl = t => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
const wa = t => window.open(waUrl(t), "_blank", "noopener");
const find = id => PRODUCTS.find(p => p.id === id);
const DISP = { consultar:"Consulta la disponibilidad", disponible:"Disponible", agotado:"Agotado" };
const imgOf = p => p.img || `assets/images/${p.cat}.svg`;
const go = sel => $(sel).scrollIntoView({ behavior:"smooth" });
let toastT;
const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2200); };

/* Estado de filtros y carrito */
const S = { q:"", cat:"", brand:"", max:0, sort:"", moto:{ b:"", m:"", y:0 } };
let cart = store.get("gm-cart", {});
if (!cart || typeof cart !== "object" || Array.isArray(cart)) cart = {};

/* Compatibilidad: marca, modelo y año participan en el filtro */
const fits = (p, m) => !m.b || p.universal || (p.fits || []).some(f => f[0] === m.b && (!m.m || f[1] === m.m) && (!m.y || (m.y >= f[2] && m.y <= f[3])));
const motoText = () => S.moto.b ? [S.moto.b, S.moto.m, S.moto.y || ""].filter(Boolean).join(" ") : "";

function list() {
  const q = S.q.trim().toLowerCase();
  const L = PRODUCTS.filter(p => (!S.cat || p.cat === S.cat) && (!S.brand || p.brand === S.brand) && (!S.max || p.price <= S.max)
    && (!q || `${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(q)) && fits(p, S.moto));
  if (S.sort) L.sort((a, b) => S.sort === "a" ? a.price - b.price : b.price - a.price);
  return L;
}

const card = p => {
  const off = p.oldPrice ? Math.round(100 - p.price * 100 / p.oldPrice) : 0;
  const tag = off ? `<span class="tag">-${off}%</span>` : (p.tags || []).includes("destacado") ? `<span class="tag y">Destacado</span>` : "";
  return `<article class="card"><button class="thumb" data-view="${p.id}" aria-label="Ver detalle de ${esc(p.name)}"><img src="${esc(imgOf(p))}" alt="${esc(p.name)}" width="400" height="300" loading="lazy">${tag}</button>
<div class="in"><small>${esc(p.brand)}</small><h3>${esc(p.name)}</h3><small>${esc(CATEGORIAS[p.cat])}</small>
<div class="price">${cop(p.price)}${p.oldPrice ? `<s>${cop(p.oldPrice)}</s>` : ""}</div><small>${DISP[p.disp || "consultar"]}</small>
<div class="row"><button class="btn" data-add="${p.id}"${p.disp === "agotado" ? " disabled" : ""}>Agregar</button><button class="btn alt" data-view="${p.id}">Detalle</button></div></div></article>`;
};

function renderCatalog() {
  const L = list(), mt = motoText();
  $("#grid").innerHTML = L.length ? L.map(card).join("")
    : `<div class="empty"><p>No encontramos repuestos con esos filtros${mt ? " para " + esc(mt) : ""}.</p><button class="btn" data-ask>Consultar por WhatsApp</button></div>`;
  $("#resN").textContent = `${L.length} producto${L.length === 1 ? "" : "s"}`;
  $("#motoBar").hidden = !mt; $("#motoTxt").textContent = mt;
}

function renderRecent() {
  const L = store.get("gm-recent", []).map(find).filter(Boolean);
  $("#recientes").hidden = !L.length; $("#gridRec").innerHTML = L.map(card).join("");
}
function pushRecent(id) { store.set("gm-recent", [id, ...store.get("gm-recent", []).filter(x => x !== id)].slice(0, 4)); renderRecent(); }

/* Detalle de producto */
function openP(id) {
  const p = find(id); if (!p) return;
  pushRecent(id);
  const comp = p.universal ? "Universal" : (p.fits || []).map(f => `${esc(f[0])} ${esc(f[1])} (${f[2]} a ${f[3]})`).join(", ") || "Consultar";
  $("#mBody").innerHTML = `<img src="${esc(imgOf(p))}" alt="${esc(p.name)}" width="400" height="300"><div class="mi">
<small>${esc(p.brand)} | ${esc(CATEGORIAS[p.cat])} | Ref. ${esc(p.sku)}</small><h2 id="mT">${esc(p.name)}</h2>
<div class="price" style="padding:0">${cop(p.price)}${p.oldPrice ? `<s>${cop(p.oldPrice)}</s>` : ""}</div><p>${esc(p.desc)}</p>
<dl><dt>Disponibilidad</dt><dd>${DISP[p.disp || "consultar"]}</dd><dt>Compatibilidad de referencia</dt><dd>${comp}</dd></dl>
<div class="row"><button class="btn" data-add="${p.id}" data-close>Agregar al carrito</button><button class="btn alt" data-askp="${p.id}">Consultar por WhatsApp</button></div></div>`;
  $("#modal").showModal();
}

/* Carrito */
function saveCart() {
  Object.keys(cart).forEach(k => { const q = Math.floor(cart[k]); if (!find(+k) || !(q > 0)) delete cart[k]; else cart[k] = Math.min(q, 99); });
  store.set("gm-cart", cart);
}
function renderCart() {
  saveCart();
  const ids = Object.keys(cart); let tot = 0, n = 0;
  $("#items").innerHTML = ids.length ? ids.map(k => {
    const p = find(+k), q = cart[k]; tot += p.price * q; n += q;
    return `<li class="it"><div><strong>${esc(p.name)}</strong><small>${esc(p.sku)} | ${cop(p.price)} c/u</small></div><b>${cop(p.price * q)}</b>
<div class="q"><button data-dec="${k}" aria-label="Quitar una unidad">−</button><span>${q}</span><button data-inc="${k}" aria-label="Agregar una unidad">+</button></div><button class="lnk" data-del="${k}">Eliminar</button></li>`;
  }).join("") : `<li class="emp">Tu carrito está vacío. Agrega repuestos del catálogo y arma tu pedido.</li>`;
  $("#sub").textContent = $("#total").textContent = cop(tot);
  $("#cartN").textContent = n;
  const F = CONFIG.envioGratisDesde; $("#ship").hidden = !F || !n;
  if (F) { $("#shipBar").style.width = Math.min(100, tot * 100 / F) + "%"; $("#shipTxt").textContent = tot >= F ? "Tu pedido califica para envío gratis" : `Te faltan ${cop(F - tot)} para el envío gratis`; }
  $("#wa").disabled = $("#clear").disabled = !n;
}
function add(id) {
  const p = find(id); if (!p || p.disp === "agotado") return;
  cart[id] = (cart[id] || 0) + 1; renderCart(); toast(`Agregado: ${p.name}`);
  const b = $("#cartN"); b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse");
}
function checkout() {
  const ids = Object.keys(cart); if (!ids.length) return;
  let tot = 0;
  const lines = ids.map((k, i) => { const p = find(+k), q = cart[k]; tot += p.price * q; return `${i + 1}. ${q} x ${p.name} (${p.sku}) - ${cop(p.price * q)}`; });
  wa(`Hola ${CONFIG.nombre}, quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${cop(tot)}\n\nQuedo atento a la confirmación de disponibilidad, pago y envío. Gracias.`);
}

/* Interfaz */
function setTheme(t) {
  document.documentElement.dataset.theme = t; store.set("gm-theme", t);
  $("#theme").setAttribute("aria-pressed", t === "dark"); $("#theme").textContent = t === "dark" ? "☀" : "☾";
}
function fillConfig() {
  $$("[data-cfg]").forEach(e => { if (CONFIG[e.dataset.cfg] != null) e.textContent = CONFIG[e.dataset.cfg]; });
  $$("[data-social]").forEach(a => { const u = CONFIG.redes[a.dataset.social]; if (u) a.href = u; else a.hidden = true; });
  $$("[data-mail]").forEach(a => a.href = "mailto:" + CONFIG.correo);
  $$("[data-wa]").forEach(a => a.href = waUrl(`Hola ${CONFIG.nombre}, quisiera información.`));
}

function init() {
  fillConfig();
  setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  $("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  $("#burger").onclick = () => { const on = $("#nav").classList.toggle("on"); $("#burger").setAttribute("aria-expanded", on); };
  $$("#nav a").forEach(a => a.addEventListener("click", () => { $("#nav").classList.remove("on"); $("#burger").setAttribute("aria-expanded", "false"); }));

  /* Selectores del buscador y filtros, construidos desde los datos */
  const motos = {};
  PRODUCTS.forEach(p => (p.fits || []).forEach(([b, m]) => { (motos[b] ??= new Set()).add(m); }));
  const fM = $("#fMarca"), fMo = $("#fModelo"), fY = $("#fAnio");
  Object.keys(motos).sort().forEach(b => fM.add(new Option(b, b)));
  for (let y = new Date().getFullYear(); y >= 2000; y--) fY.add(new Option(y, y));
  fM.onchange = () => { fMo.length = 1; [...(motos[fM.value] || [])].sort().forEach(m => fMo.add(new Option(m, m))); };
  $("#finder").onsubmit = e => {
    e.preventDefault();
    if (!fM.value) { toast("Elige primero la marca de tu moto"); fM.focus(); return; }
    S.moto = { b:fM.value, m:fMo.value, y:+fY.value || 0 }; renderCatalog(); go("#catalogo");
  };
  $("#motoClear").onclick = () => { S.moto = { b:"", m:"", y:0 }; renderCatalog(); };

  Object.entries(CATEGORIAS).forEach(([k, v]) => $("#fCat").add(new Option(v, k)));
  [...new Set(PRODUCTS.map(p => p.brand))].sort().forEach(b => $("#fBrand").add(new Option(b, b)));
  $("#cats").innerHTML = Object.entries(CATEGORIAS).map(([k, v]) => `<button class="cat" data-cat="${k}" aria-pressed="false"><img src="assets/images/${k}.svg" alt="" width="400" height="300" loading="lazy"><span>${esc(v)}</span></button>`).join("");
  $("#chipM").innerHTML = Object.keys(motos).sort().map(b => `<span>${esc(b)}</span>`).join("");
  $("#chipR").innerHTML = [...new Set(PRODUCTS.map(p => p.brand).filter(b => b !== "Genérico"))].sort().map(b => `<span>${esc(b)}</span>`).join("");

  const bind = (id, key, num) => $(id).addEventListener("input", e => { S[key] = num ? +e.target.value : e.target.value; if (key === "cat") syncCats(); renderCatalog(); });
  bind("#q", "q"); bind("#fCat", "cat"); bind("#fBrand", "brand"); bind("#fPrice", "max", 1); bind("#fSort", "sort");
  const syncCats = () => { $("#fCat").value = S.cat; $$(".cat").forEach(c => c.setAttribute("aria-pressed", c.dataset.cat === S.cat)); };
  $("#reset").onclick = () => { Object.assign(S, { q:"", cat:"", brand:"", max:0, sort:"" }); ["#q", "#fCat", "#fBrand", "#fPrice", "#fSort"].forEach(i => $(i).value = i === "#fPrice" ? "0" : ""); syncCats(); renderCatalog(); };

  $("#gridFeat").innerHTML = PRODUCTS.filter(p => (p.tags || []).includes("destacado")).slice(0, 4).map(card).join("");
  $("#gridOff").innerHTML = PRODUCTS.filter(p => p.oldPrice).map(card).join("");
  renderCatalog(); renderRecent(); renderCart();

  /* Clics delegados */
  document.addEventListener("click", e => {
    const c = s => e.target.closest(s); let x;
    if ((x = c("[data-add]"))) add(+x.dataset.add);
    else if ((x = c("[data-view]"))) openP(+x.dataset.view);
    else if ((x = c("[data-inc]"))) { cart[x.dataset.inc]++; renderCart(); }
    else if ((x = c("[data-dec]"))) { cart[x.dataset.dec]--; renderCart(); }
    else if ((x = c("[data-del]"))) { delete cart[x.dataset.del]; renderCart(); }
    else if ((x = c("[data-cat]"))) { S.cat = S.cat === x.dataset.cat ? "" : x.dataset.cat; syncCats(); renderCatalog(); go("#catalogo"); }
    else if (c("[data-ask]")) wa(`Hola ${CONFIG.nombre}, busco un repuesto${motoText() ? " para mi moto " + motoText() : ""}${S.q ? ": " + S.q : ""}. ¿Me pueden ayudar?`);
    else if ((x = c("[data-askp]"))) { const p = find(+x.dataset.askp); wa(`Hola ${CONFIG.nombre}, quiero consultar disponibilidad y compatibilidad de: ${p.name} (${p.sku}) - ${cop(p.price)}.${motoText() ? " Mi moto es " + motoText() + "." : ""}`); }
    else if (c("[data-taller]")) wa(`Hola ${CONFIG.nombre}, quisiera agendar una cita en el taller. ¿Qué disponibilidad tienen?`);
    if ((x = c("[data-close]"))) x.closest("dialog").close();
  });
  $$("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));
  $("#openCart").onclick = () => $("#cart").showModal();
  $("#wa").onclick = checkout;
  $("#clear").onclick = () => { if (confirm("¿Vaciar el carrito?")) { cart = {}; renderCart(); toast("Carrito vacío"); } };

  /* Formulario con validación */
  $("#cf").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target, tel = f.tel.value.replace(/\D/g, "");
    const err = {
      nombre: f.nombre.value.trim().length < 2 ? "Escribe tu nombre." : "",
      tel: tel.length < 7 || tel.length > 15 ? "Escribe un teléfono válido, solo números." : "",
      msg: f.msg.value.trim().length < 10 ? "Cuéntanos qué necesitas (mínimo 10 caracteres)." : ""
    };
    Object.entries(err).forEach(([k, v]) => { $("#e-" + k).textContent = v; f[k].setAttribute("aria-invalid", !!v); });
    if (Object.values(err).some(Boolean)) return;
    wa(`Hola ${CONFIG.nombre}, soy ${f.nombre.value.trim()}.\nTema: ${f.tipo.value}\nTeléfono: ${f.tel.value.trim()}${f.moto.value.trim() ? "\nMoto: " + f.moto.value.trim() : ""}\n\n${f.msg.value.trim()}`);
    toast("Abriendo WhatsApp…"); f.reset();
  });

  const topBtn = $("#top");
  addEventListener("scroll", () => { topBtn.hidden = scrollY < 700; }, { passive:true });
  topBtn.onclick = () => scrollTo({ top:0, behavior:"smooth" });
  addEventListener("error", e => { const i = e.target; if (i && i.tagName === "IMG" && !i.dataset.f) { i.dataset.f = 1; i.src = "assets/images/placeholder.svg"; } }, true);
}

try { init(); }
catch (err) {
  console.error(err);
  const g = $("#grid"); if (g) g.innerHTML = `<div class="empty"><p>No pudimos cargar el catálogo. Recarga la página o escríbenos por WhatsApp.</p></div>`;
}
})();
