// Vietnam-Reiseplan — gemeinsame Logik für Server und lokalen Test.
//
// Der ganze Plan ist ein einziger Datensatz:
//   { version, geaendert, docs: { "plan/info": {...}, "days/2027-01-05": {...}, ... } }
// Änderungen kommen feldweise an und werden in den Datensatz gemischt.
// So überschreibt niemand die Felder, die eine andere Person gerade ändert.

import { STARTDATEN } from "./startdaten.mjs";

const PFAD = /^(plan\/info|days\/\d{4}-\d{2}-\d{2}|budget\/[a-z0-9]{1,24}|checklist\/[a-z0-9]{1,24})$/;
const FELD = /^[a-z]{1,20}$/;
const MAX_TEXT = 8000;
const MAX_DOCS = 600;

export function startzustand() {
  return { version: 1, geaendert: new Date().toISOString(), docs: JSON.parse(JSON.stringify(STARTDATEN)) };
}

// Prüft eine Liste von Änderungen. Gibt eine Fehlermeldung zurück oder null.
export function pruefe(aenderungen) {
  if (!Array.isArray(aenderungen) || aenderungen.length === 0 || aenderungen.length > 100) return "liste";
  for (const a of aenderungen) {
    if (!a || typeof a.pfad !== "string" || !PFAD.test(a.pfad)) return "pfad";
    if (a.loeschen === true) continue;
    if (!a.felder || typeof a.felder !== "object" || Array.isArray(a.felder)) return "felder";
    for (const [k, v] of Object.entries(a.felder)) {
      if (!FELD.test(k)) return "feldname";
      if (typeof v === "string") { if (v.length > MAX_TEXT) return "zu_lang"; }
      else if (typeof v !== "boolean" && !(typeof v === "number" && Number.isFinite(v))) return "wert";
    }
  }
  return null;
}

// Mischt die Änderungen in einen Zustand (verändert ihn) und erhöht die Version.
export function wendeAn(zustand, aenderungen) {
  for (const a of aenderungen) {
    if (a.loeschen) { delete zustand.docs[a.pfad]; continue; }
    if (!zustand.docs[a.pfad] && Object.keys(zustand.docs).length >= MAX_DOCS) throw new Error("voll");
    zustand.docs[a.pfad] = Object.assign({}, zustand.docs[a.pfad] || {}, a.felder);
  }
  zustand.version = (zustand.version || 0) + 1;
  zustand.geaendert = new Date().toISOString();
  return zustand;
}
