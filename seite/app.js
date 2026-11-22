// Vietnam-Reiseplan — Seite
//
// Holt den Plan alle paar Sekunden vom Server und schickt Änderungen
// feldweise. Auf localhost läuft alles ohne Server im Browser
// (localStorage, mehrere Tabs = mehrere Personen).

const START = Date.UTC(2027, 0, 4), N = 32;
const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const LOKAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const PW_KEY = "vietnam-reiseplan-pw";

// ---------- Verbindung ----------
let passwort = "";
try { passwort = localStorage.getItem(PW_KEY) || ""; } catch {}

class FalschesPasswort extends Error {}

async function api(methode, pfad, body) {
  if (LOKAL) return lokalApi(methode, pfad, body);
  const r = await fetch("/api/" + pfad, {
    method: methode,
    headers: Object.assign({ "x-passwort": passwort }, body ? { "Content-Type": "application/json", "x-reise": "1" } : {}),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });
  if (r.status === 401) throw new FalschesPasswort();
  const daten = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(daten.fehler || "server"), { status: r.status });
  return daten;
}

// Lokaler Test ohne Server: gleiche Logik wie funktionen/api.mjs
let planModul = null;
async function lokalApi(methode, pfad, body) {
  planModul = planModul || await import("../plan.mjs");
  if (!passwort) throw new FalschesPasswort();
  const KEY = "vietnam-reiseplan-lokal";
  let z = null;
  try { z = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (!z) z = planModul.startzustand();
  await new Promise((ok) => setTimeout(ok, 150));
  if (methode === "GET") {
    const v = Number(new URLSearchParams(pfad.split("?")[1]).get("v"));
    return v === z.version ? { gleich: true, version: z.version } : z;
  }
  const f = planModul.pruefe(body.aenderungen);
  if (f) throw new Error(f);
  planModul.wendeAn(z, body.aenderungen);
  localStorage.setItem(KEY, JSON.stringify(z));
  return { version: z.version };
}

// ---------- Anmeldung ----------
const loginEl = $("#login"), appEl = $("#app");
function zeigeLogin(fehler) {
  appEl.hidden = true; loginEl.hidden = false;
  $("#loginFehler").hidden = !fehler;
  stoppePolling();
  setTimeout(() => $("#pw").focus(), 50);
}
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  passwort = $("#pw").value;
  try {
    await ladePlan(true);
    try { localStorage.setItem(PW_KEY, passwort); } catch {}
    $("#pw").value = "";
    loginEl.hidden = true; appEl.hidden = false;
    $$("textarea").forEach(autosize);
    startePolling();
  } catch (err) {
    if (err instanceof FalschesPasswort) zeigeLogin(true);
    else { $("#loginFehler").hidden = false; $("#loginFehler").textContent = "Keine Verbindung zum Server. Bitte später erneut versuchen."; }
  }
});
$("#abmelden").addEventListener("click", () => {
  try { localStorage.removeItem(PW_KEY); } catch {}
  passwort = ""; zeigeLogin(false);
});

// ---------- Tage aufbauen ----------
const DAYS = [];
for (let i = 0; i < N; i++) {
  const d = new Date(START + i * 864e5);
  const dd = String(d.getUTCDate()).padStart(2, "0"), mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  DAYS.push({ n: i + 1, id: d.toISOString().slice(0, 10), label: WD[d.getUTCDay()] + " " + dd + "." + mm + ".", short: dd + "." + mm, wd: WD[d.getUTCDay()], we: d.getUTCDay() === 0 || d.getUTCDay() === 6 });
}
const daysEl = $("#days"), stripEl = $("#daystrip");
for (const x of DAYS) {
  const path = "days/" + x.id;
  const card = document.createElement("article");
  card.className = "day" + (x.we ? " we" : "");
  card.id = "tag-" + x.n;
  card.innerHTML =
    '<div class="dhead"><span class="n">Tag ' + x.n + '</span><span class="d">' + x.label + '</span><span class="open" hidden>offen</span></div>' +
    '<div class="ortwrap"><label class="f ort"><span>Ort</span><textarea rows="1" placeholder="Ort"></textarea></label>' +
    '<label class="f"><span>Strecke (km / Std.)</span><input type="text" placeholder="–"></label></div>' +
    '<label class="f"><span>Programm</span><textarea rows="1" placeholder="Programm eintragen"></textarea></label>' +
    '<div class="row2"><label class="f"><span>Unterkunft</span><textarea rows="1" placeholder="–"></textarea></label>' +
    '<label class="f kosten"><span>Kosten €</span><input type="text" inputmode="decimal" placeholder="0"></label></div>';
  const f = card.querySelectorAll("input,textarea");
  bind(f[0], path, "ort"); bind(f[1], path, "strecke"); bind(f[2], path, "programm");
  bind(f[3], path, "unterkunft"); bind(f[4], path, "kosten");
  daysEl.appendChild(card);
  const b = document.createElement("button");
  b.type = "button"; b.className = (x.we ? "we " : "") + "empty"; b.dataset.n = x.n;
  b.innerHTML = "<b>" + x.n + "</b><small>" + x.wd + " " + x.short + "</small>";
  b.title = "Tag " + x.n + ", " + x.label;
  b.addEventListener("click", () => {
    card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    card.classList.remove("flash"); void card.offsetWidth; card.classList.add("flash");
  });
  stripEl.appendChild(b);
}

for (const k of ["reisende", "route", "transport", "tagesbudget", "hinflug", "inland", "streckenplan", "rueckflug", "versicherung", "notizen"]) {
  bind($("#f-" + k), "plan/info", k);
}

// Countdown / heutiger Tag
(() => {
  const now = new Date(), t = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((START - t) / 864e5), el = $("#countdown");
  if (diff > 1) el.textContent = "Noch " + diff + " Tage bis zum Abflug";
  else if (diff === 1) el.textContent = "Morgen geht es los";
  else if (-diff < N) {
    const n = -diff + 1; el.textContent = "Heute ist Tag " + n + " von " + N;
    $("#tag-" + n).classList.add("today"); $('.daystrip button[data-n="' + n + '"]').classList.add("today");
  } else el.textContent = "Reise abgeschlossen";
})();

// ---------- Navigation ----------
for (const b of $$("nav.tabs button")) {
  b.addEventListener("click", () => document.getElementById(b.dataset.go).scrollIntoView({ behavior: "smooth", block: "start" }));
}
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) for (const b of $$("nav.tabs button")) b.classList.toggle("on", b.dataset.go === e.target.id);
  }, { rootMargin: "-30% 0px -60% 0px" });
  for (const s of $$("main section")) io.observe(s);
}

// ---------- Hilfen ----------
function autosize(el) { if (el.tagName === "TEXTAREA") { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; } }
window.addEventListener("resize", () => $$("textarea").forEach(autosize));
function parseEuro(s) {
  let sum = 0;
  const m = String(s || "").replace(/\s/g, "").match(/-?\d[\d.,]*/g) || [];
  for (let t of m) {
    if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
    const v = parseFloat(t); if (!isNaN(v)) sum += v;
  }
  return sum;
}

function recompute() {
  let tot = 0;
  $$(".day").forEach((card, i) => {
    const f = card.querySelectorAll("input,textarea");
    tot += parseEuro(f[4].value);
    card.querySelector(".open").hidden = !!f[2].value.trim();
    stripEl.children[i].classList.toggle("empty", !f[0].value.trim() && !f[2].value.trim());
  });
  $("#dayTotal").textContent = euro.format(tot);
  let p = 0, r = 0;
  for (const tr of $$("#budgetBody tr")) { const f = tr.querySelectorAll("input"); p += parseEuro(f[1].value); r += parseEuro(f[2].value); }
  $("#sumPlan").textContent = euro.format(p); $("#sumReal").textContent = euro.format(r);
  const cs = $$("#checks .check"), done = cs.filter((c) => c.querySelector("input[type=checkbox]").checked).length;
  $("#progress").textContent = cs.length ? done + " von " + cs.length + " erledigt" : "";
  const stops = [];
  for (const card of $$(".day")) {
    const o = card.querySelector(".ort textarea").value.split("\n")[0].trim();
    if (!o) continue;
    if (stops.length && stops[stops.length - 1].o === o) stops[stops.length - 1].c++;
    else stops.push({ o, c: 1 });
  }
  const route = $("#route"); route.textContent = "";
  stops.forEach((s, i) => {
    if (i) { const a = document.createElement("span"); a.className = "arr"; a.textContent = "→"; route.appendChild(a); }
    const sp = document.createElement("span"); sp.className = "stop"; sp.textContent = s.o;
    const sm = document.createElement("small"); sm.textContent = s.c + (s.c === 1 ? " Tag" : " Tage"); sp.appendChild(sm);
    route.appendChild(sp);
  });
}

// ---------- Status ----------
const statusEl = $("#status");
const STATUS = { connecting: "Verbinde …", live: "Aktuell", saving: "Speichert …", saved: "Gespeichert", stale: "Keine Verbindung", error: "Speichern fehlgeschlagen" };
function setStatus(s, txt) { statusEl.dataset.s = s; statusEl.querySelector("span").textContent = txt || STATUS[s]; }

// ---------- Felder & Speichern ----------
let docs = {}, version = 0;
let pending = {}, sendeTimer = null, sendet = false;

function bind(el, path, field) {
  el.dataset.path = path; el.dataset.field = field;
  el.addEventListener("input", () => {
    autosize(el); recompute();
    merke(path, field, el.type === "checkbox" ? el.checked : el.value, el.type === "checkbox" ? 0 : 800);
  });
  el.addEventListener("blur", () => { if (Object.keys(pending).length) sende(); });
}
function merke(path, field, value, delay) {
  pending[path] = pending[path] || {}; pending[path][field] = value;
  clearTimeout(sendeTimer);
  sendeTimer = setTimeout(sende, delay);
  aktiv();
}
async function sende() {
  clearTimeout(sendeTimer);
  if (sendet) { sendeTimer = setTimeout(sende, 300); return; }
  const pfade = Object.keys(pending);
  if (!pfade.length) return;
  const paket = pending; pending = {};
  const aenderungen = pfade.map((p) => paket[p] === null ? { pfad: p, loeschen: true } : { pfad: p, felder: paket[p] });
  sendet = true; setStatus("saving");
  try {
    await api("POST", "aendern", { aenderungen });
    for (const p of pfade) { if (paket[p] === null) delete docs[p]; else docs[p] = Object.assign({}, docs[p] || {}, paket[p]); }
    sendet = false;
    if (Object.keys(pending).length) sende(); else { setStatus("saved"); ladePlan().catch(() => {}); }
  } catch (e) {
    sendet = false;
    // Nicht Gesendetes zurücklegen, neuere Eingaben haben Vorrang
    for (const p of pfade) {
      if (paket[p] === null) { if (!(p in pending)) pending[p] = null; }
      else if (pending[p] !== null) pending[p] = Object.assign({}, paket[p], pending[p] || {});
    }
    if (e instanceof FalschesPasswort) { zeigeLogin(true); return; }
    setStatus("error", e.status === 413 ? "Plan ist voll" : STATUS.error);
    sendeTimer = setTimeout(sende, 4000 + Math.random() * 2000);
  }
}
function loesche(path) {
  pending[path] = null; delete docs[path];
  clearTimeout(sendeTimer); sende();
}

function apply(path, data) {
  for (const el of $$('[data-path="' + path + '"]')) {
    const f = el.dataset.field;
    if (el === document.activeElement && el.type !== "checkbox") continue;
    if (pending[path] && f in pending[path]) continue;
    const v = data && data[f] != null ? data[f] : (el.type === "checkbox" ? false : "");
    if (el.type === "checkbox") { el.checked = !!v; const row = el.closest(".check"); if (row) row.classList.toggle("done", !!v); }
    else if (el.value !== String(v)) el.value = String(v);
    autosize(el);
  }
}

// ---------- Budget-Zeilen ----------
const budgetBody = $("#budgetBody");
function delButton(onDelete) {
  const b = document.createElement("button"); b.type = "button"; b.className = "del"; b.textContent = "✕"; b.title = "Löschen";
  let t;
  b.addEventListener("click", () => {
    if (b.classList.contains("confirm")) { clearTimeout(t); onDelete(); return; }
    b.classList.add("confirm"); b.textContent = "Löschen?";
    t = setTimeout(() => { b.classList.remove("confirm"); b.textContent = "✕"; }, 3000);
  });
  return b;
}
function ensureBudgetRow(id) {
  let tr = budgetBody.querySelector('tr[data-id="' + id + '"]');
  if (tr) return tr;
  tr = document.createElement("tr"); tr.dataset.id = id;
  tr.innerHTML = '<td><input type="text" placeholder="Kategorie" aria-label="Kategorie"></td><td class="num"><input type="text" inputmode="decimal" placeholder="0" aria-label="Geplant"></td><td class="num"><input type="text" inputmode="decimal" placeholder="0" aria-label="Tatsächlich"></td><td class="act"></td>';
  const f = tr.querySelectorAll("input"), path = "budget/" + id;
  bind(f[0], path, "kategorie"); bind(f[1], path, "geplant"); bind(f[2], path, "tatsaechlich");
  tr.lastChild.appendChild(delButton(() => { tr.remove(); loesche(path); recompute(); }));
  budgetBody.appendChild(tr);
  return tr;
}
$("#addBudget").addEventListener("click", () => {
  const id = "b" + Date.now().toString(36), path = "budget/" + id;
  docs[path] = { kategorie: "", geplant: "", tatsaechlich: "", order: Date.now() };
  const tr = ensureBudgetRow(id);
  pending[path] = Object.assign({}, docs[path]); sende();
  tr.querySelector("input").focus();
});

// ---------- Checkliste ----------
const checksEl = $("#checks");
function ensureCheck(id) {
  let row = checksEl.querySelector('.check[data-id="' + id + '"]');
  if (row) return row;
  const em = checksEl.querySelector(".empty"); if (em) em.remove();
  row = document.createElement("div"); row.className = "check"; row.dataset.id = id;
  row.innerHTML = '<input type="checkbox" aria-label="Erledigt"><input type="text" aria-label="Punkt">';
  const path = "checklist/" + id, f = row.querySelectorAll("input");
  bind(f[0], path, "done"); bind(f[1], path, "text");
  f[0].addEventListener("change", () => row.classList.toggle("done", f[0].checked));
  row.appendChild(delButton(() => { row.remove(); loesche(path); leerHinweis(); recompute(); }));
  checksEl.appendChild(row);
  return row;
}
function leerHinweis() {
  if (!checksEl.querySelector(".check") && !checksEl.querySelector(".empty")) {
    const em = document.createElement("div"); em.className = "empty"; em.textContent = "Noch keine Punkte. Füge unten den ersten hinzu."; checksEl.appendChild(em);
  }
}
$("#addCheckForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const inp = $("#newCheck"), text = inp.value.trim();
  if (!text) return;
  const id = "c" + Date.now().toString(36), path = "checklist/" + id;
  docs[path] = { text, done: false, order: Date.now() };
  ensureCheck(id); apply(path, docs[path]); recompute();
  pending[path] = Object.assign({}, docs[path]); sende();
  inp.value = "";
});

function sortRows(container, sel, prefix) {
  const rows = $$(sel, container);
  rows.sort((a, b) => ((docs[prefix + a.dataset.id] || {}).order || 0) - ((docs[prefix + b.dataset.id] || {}).order || 0));
  for (const r of rows) container.appendChild(r);
}

// ---------- Plan laden & abgleichen ----------
function zeige(neu) {
  docs = neu;
  for (const d of DAYS) apply("days/" + d.id, docs["days/" + d.id]);
  apply("plan/info", docs["plan/info"]);
  // Budget & Checkliste: Zeilen anlegen bzw. entfernen
  const ids = (prefix) => Object.keys(docs).filter((p) => p.startsWith(prefix)).map((p) => p.slice(prefix.length));
  const bIds = ids("budget/");
  for (const id of bIds) { ensureBudgetRow(id); apply("budget/" + id, docs["budget/" + id]); }
  for (const tr of $$("tr[data-id]", budgetBody)) if (!bIds.includes(tr.dataset.id) && !(("budget/" + tr.dataset.id) in pending)) tr.remove();
  const cIds = ids("checklist/");
  for (const id of cIds) { ensureCheck(id); apply("checklist/" + id, docs["checklist/" + id]); }
  for (const r of $$(".check[data-id]", checksEl)) if (!cIds.includes(r.dataset.id) && !(("checklist/" + r.dataset.id) in pending)) r.remove();
  leerHinweis();
  sortRows(budgetBody, "tr", "budget/"); sortRows(checksEl, ".check", "checklist/");
  recompute();
}

let laedt = false;
async function ladePlan(voll) {
  if (laedt) return; laedt = true;
  try {
    const r = await api("GET", "plan" + (voll || !version ? "" : "?v=" + version));
    if (!r.gleich) { version = r.version; zeige(r.docs || {}); }
    if (!sendet && !Object.keys(pending).length) setStatus("live");
  } finally { laedt = false; }
}

// Abfragen: alle 5 s, solange jemand die Seite benutzt; nach 5 Minuten
// ohne Eingabe nur noch jede Minute; im Hintergrund gar nicht.
let pollTimer = null, letzteAktivitaet = Date.now();
function aktiv() { letzteAktivitaet = Date.now(); }
["pointerdown", "keydown", "scroll", "touchstart"].forEach((ev) => addEventListener(ev, aktiv, { passive: true }));
function intervall() { return Date.now() - letzteAktivitaet > 5 * 60e3 ? 60e3 : 5e3; }
async function tick() {
  if (document.visibilityState === "visible") {
    try { await ladePlan(); }
    catch (e) { if (e instanceof FalschesPasswort) { zeigeLogin(true); return; } setStatus("stale"); }
  }
  pollTimer = setTimeout(tick, intervall());
}
function startePolling() { stoppePolling(); pollTimer = setTimeout(tick, intervall()); }
function stoppePolling() { clearTimeout(pollTimer); pollTimer = null; }
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && pollTimer) { aktiv(); stoppePolling(); tick(); }
  else if (document.visibilityState === "hidden" && Object.keys(pending).length) sende();
});
addEventListener("pagehide", () => { if (Object.keys(pending).length) sende(); });
if (LOKAL) addEventListener("storage", () => ladePlan().catch(() => {}));

// ---------- Start ----------
recompute();
(async () => {
  if (!passwort) { zeigeLogin(false); return; }
  loginEl.hidden = true; appEl.hidden = false;
  $$("textarea").forEach(autosize);
  try { await ladePlan(true); }
  catch (e) { if (e instanceof FalschesPasswort) { zeigeLogin(true); return; } setStatus("stale"); }
  $$("textarea").forEach(autosize);
  startePolling();
})();
