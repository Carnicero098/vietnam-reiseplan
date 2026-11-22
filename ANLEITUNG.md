# Vietnam-Reiseplan – online stellen

Gleicher Weg wie beim Betriebsbuch und beim Quizduell: GitHub → Netlify.
**Nicht per Drag-and-drop bei Netlify hochladen**, sonst fehlt der Speicher
und die Seite meldet „Keine Verbindung“.

1. Auf **github.com** oben rechts **+** → **New repository**
   - Name: `vietnam-reiseplan`
   - **Private** auswählen (wichtig: im Startinhalt steht die Versicherungsnummer)
   - **nicht** „Add a README“ anhaken → **Create repository**
2. Claude Bescheid geben – der Ordner ist als Git-Ablage vorbereitet und wird
   dann hochgeschoben.
3. Bei **app.netlify.com** → **Add new site** → **Import an existing project**
   → **GitHub** → `vietnam-reiseplan` → **Deploy**. Einstellungen kommen aus
   `netlify.toml`.
4. **Site configuration → Change site name**, z. B. `vietnam-reiseplan-2027`
   → Adresse `https://vietnam-reiseplan-2027.netlify.app`
5. Empfohlen: Unter **Environment variables** `REISE_PASSWORT` setzen. Dann
   gilt dieses Passwort statt des Standardpassworts aus dem Code. Danach
   einmal **Deploys → Trigger deploy** drücken.

## Bedienung

- Link und Passwort an die Mitreisenden schicken. Jeder gibt das Passwort
  einmal ein, der Browser merkt es sich.
- Jedes Feld antippen und schreiben – gespeichert wird automatisch.
  Änderungen der anderen erscheinen nach etwa 5 Sekunden.
- Ändern zwei Personen gleichzeitig **verschiedene** Felder, bleibt beides
  erhalten. Beim **selben** Feld gilt, wer zuletzt speichert.
- Auf dem Handy: im Browser-Menü „Zum Startbildschirm hinzufügen“.

## Aufbau

- `seite/` – die öffentliche Seite (nur dieser Ordner ist abrufbar)
- `funktionen/api.mjs` – Server, prüft das Passwort, speichert in Netlify Blobs (Frankfurt)
- `plan.mjs` – Logik zum Zusammenführen von Änderungen (Server und lokaler Test)
- `startdaten.mjs` – Inhalt aus der Word-Vorlage; gilt nur, bis zum ersten Mal gespeichert wurde

Lokal testen: Server „vietnam-reiseplan“ starten und `http://localhost:8766/seite/`
öffnen. Dort läuft alles im Browser ohne Server, jedes Passwort wird angenommen.
