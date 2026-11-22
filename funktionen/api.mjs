// Vietnam-Reiseplan — Server
//
// GET  /api/plan?v=<version>  → ganzer Plan (oder {gleich:true}, wenn unverändert)
// POST /api/aendern            → { aenderungen: [{ pfad, felder } | { pfad, loeschen:true }] }
// Beide brauchen den Kopf x-passwort.

import { getStore } from "@netlify/blobs";
import { startzustand, pruefe, wendeAn } from "../plan.mjs";

export const config = { path: "/api/*" };

// Gemeinsames Reise-Passwort. Bei Netlify unter „Environment variables“
// mit REISE_PASSWORT überschreibbar.
const PASSWORT = process.env.REISE_PASSWORT || "Traumfrau123";
const SCHLUESSEL = "plan";

const speicher = () => getStore({ name: "vietnam-reiseplan", region: "eu-central-1", consistency: "strong" });

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });

async function lies(b) {
  const r = await b.getWithMetadata(SCHLUESSEL, { type: "json" });
  if (r && r.data) return { zustand: r.data, etag: r.etag };
  return { zustand: null, etag: null };
}

export default async (req) => {
  const url = new URL(req.url);
  const pfad = url.pathname.replace(/^\/(\.netlify\/functions\/)?api\/?/, "");
  if (req.headers.get("x-passwort") !== PASSWORT) return json({ fehler: "passwort" }, 401);

  const b = speicher();
  try {
    if (req.method === "GET" && pfad === "plan") {
      let { zustand } = await lies(b);
      if (!zustand) zustand = startzustand();
      const v = Number(url.searchParams.get("v"));
      if (v && v === zustand.version) return json({ gleich: true, version: zustand.version });
      return json(zustand);
    }

    if (req.method === "POST" && pfad === "aendern") {
      // Eigener Kopf: ein Formular einer fremden Seite kann ihn nicht mitschicken
      if (req.headers.get("x-reise") !== "1") return json({ fehler: "kein_header" }, 400);
      let body;
      try { body = await req.json(); } catch { return json({ fehler: "kaputt" }, 400); }
      const fehler = pruefe(body && body.aenderungen);
      if (fehler) return json({ fehler }, 400);

      // Lesen – mischen – nur schreiben, wenn niemand dazwischen gespeichert hat.
      for (let versuch = 0; versuch < 6; versuch++) {
        const { zustand, etag } = await lies(b);
        const neu = wendeAn(zustand || startzustand(), body.aenderungen);
        const r = etag
          ? await b.setJSON(SCHLUESSEL, neu, { onlyIfMatch: etag })
          : await b.setJSON(SCHLUESSEL, neu, { onlyIfNew: true });
        if (!r || r.modified !== false) return json({ version: neu.version });
        await new Promise((ok) => setTimeout(ok, 40 + Math.random() * 120));
      }
      return json({ fehler: "besetzt" }, 409);
    }

    return json({ fehler: "unbekannt" }, 404);
  } catch (e) {
    console.error(e);
    if (String(e && e.message) === "voll") return json({ fehler: "voll" }, 413);
    return json({ fehler: "server" }, 500);
  }
};
