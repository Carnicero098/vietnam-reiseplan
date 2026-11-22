// Startinhalt aus „Vietnam_Reiseplan_Vorlage.docx“ (Stand 22.11.2026).
// Wird nur benutzt, solange auf dem Server noch kein Plan gespeichert ist.

const tag = (ort, programm = "", extra = {}) => Object.assign({ ort, strecke: "", programm, unterkunft: "", kosten: "" }, extra);
const CASA = "La Casa Di Dicembre, 6/9 Cách Mạng Tháng Tám, Stadtbezirk 1, 760000 Ho-Chi-Minh-Stadt";

export const STARTDATEN = {
  "plan/info": {
    reisende: "",
    route: "Hanoi → Saigon (Flug) → mit dem Roller zurück nach Hanoi",
    transport: "",
    tagesbudget: "",
    streckenplan: "",
    hinflug: "Mo., 04. Jan. 21:35 MUC · Flughafen München Franz Josef Strauß\nDi., 05. Jan. 06:35 AUH · Flughafen Abu Dhabi\nUmstieg 2 Std. 15 Min.\nDi., 05. Jan. 08:50 AUH · Flughafen Abu Dhabi\nDi., 05. Jan. 18:10 HAN · Flughafen Hanoi",
    inland: "06.01. 9:40 Hanoi – Saigon 11:50",
    rueckflug: "Do., 04. Feb. 08:15 (alt: 07:40) HAN · Flughafen Hanoi\nEtihad Airways EY 433 · Economy · Flugdauer 7 Std. 25 Min.\nDo., 04. Feb. 12:40 (alt: 12:15) AUH · Flughafen Abu Dhabi\nUmstieg 1 Std. 40 Min.\nDo., 04. Feb. 14:20 AUH · Flughafen Abu Dhabi\nEtihad Airways EY 127 · Economy · Flugdauer 6 Std. 50 Min.\nDo., 04. Feb. 18:10 MUC · Flughafen München Franz Josef Strauß",
    versicherung: "Insurance policy no. 807912623G60016\nTelephone: +49 40 55557877",
    notizen: ""
  },
  "days/2027-01-05": tag("Hanoi Flughafen", "Ankunft Hanoi 18:10 Uhr -> Unterkunft aufsuchen (Nimm Grab oder Green SM zum Festpreis, meide die Taxifahrer) -> Essen gehen", {
    strecke: "1 Stunde Gehweg",
    unterkunft: "HT Airport Inn, 25 Đường QL2, Mai Đình, Sóc Sơn, Phù Xá Ðoài, Vietnam",
    kosten: "6,44 €"
  }),
  "days/2027-01-06": tag("Hanoi -> Saigon (Flug)", "HAN Noi Bai International Airport 9:40 Uhr\nSaigon Ankunft 11:50 Uhr -> Green SM, um zur City zu kommen\nKriegsmuseum", {
    strecke: "20 – 30 min zur City mit Green SM", unterkunft: CASA, kosten: "22,00 €"
  }),
  "days/2027-01-07": tag("Saigon", "Cu Chi Tunnel Halbtagesausflug (Vormittag)\n14:00 Lukas & Adriana erstmal ankommen\n16:30 Ben Thanh Markt\n18:30 Rooftop (Sonnenuntergang) & Streetfood\n20:00 Nguyen Hue Walking Street & Bui Vien", {
    unterkunft: CASA, kosten: "11,00 €"
  }),
  "days/2027-01-08": tag("Saigon", "Siehe Beispieltag Kapitel 21\n9:30 Nudelsuppe & Kaffee, danach Stadt\n11:00 Koloniales Zentrum\n13:00 Com Tam zum Lunch\n15:00 Binh Tay Markt & Chinatown\n18:30 Nguyen Hue Walking Street & Bui Vien\nFlug um 21 Uhr (30 €)"),
  "days/2027-01-09": tag("Insel"),
  "days/2027-01-10": tag("Insel"),
  "days/2027-01-11": tag("Insel", "Abends: Flug nach Saigon 19:50–21 Uhr (40 €) und Nachtbus 23:45–7:15 Uhr (20 €)"),
  "days/2027-01-12": tag("Da Lat", "Ankunft 7:15 Uhr\nFrühstück: Bánh mì xíu mại Phương\nVor Ort Roller mieten\nWasser:\n- Canyoning / angucken\n- Datanla & Elephant Wasserfall\nAbends essen Hotpot (vegi): Lẩu Chay Hằng Thiện"),
  "days/2027-01-13": tag("Da Lat", "Stadt:\n- Crazy House (Hang Nga)\n- Xuan Huong See\n- Bahnhof Da Lat & Linh Phuoc Pagode\nAbends:\n- Maze Bar (100 Roofs) (Sonnenuntergang)\n- Nachtmarkt (Streetfood)\n(Essen vegi Alternative: Từ Sen Vegetarian & Café)"),
  "days/2027-01-14": tag("Da Lat", "Plantagen & Farmen:\n- Kaffeeplantagen\n- Blumen- & Erdbeerfarmen\n- Me Linh Coffee Garden (Nachmittagskaffee)\nAbends Schlafbus nach Hoi An (ca. 12 h, 20–25 €)"),
  "days/2027-01-15": tag("Hoi An", "Morgens ankommen\n(Anzug schneidern)\nMorgens/Mittags: Die gelbe Altstadt\nNachmittags: Radtour zu den Reisfeldern, Tra Que Vegetable Village\nEssen zwischen den Gemüsefeldern: Rao Cafe\nAbends: Laternen & Bootsfahrt"),
  "days/2027-01-16": tag("Hoi An", "Morgens: My Son Heiligtum (1 h entfernt, Dschungel, Tempel, Roller?)\nNachmittag mit Fahrrad: An Bang Beach\nAbends: Nightmarket\n(Essen vegi Alternative: Chay Tươi Vu)"),
  "days/2027-01-17": tag("Hue\nHoi An", "(Morgens: Café mit Aussicht: Faifo Coffee)\nTagestrip Hai Van Pass: Roller mieten und den wunderschönen Pass (150 km und kurvig) nach Hue, dort Roller abgeben (ca. 25 € p. P.)\n(Lang Co Beach Badestopp beim Pass)"),
  "days/2027-01-18": tag("Phong Nha\nHue", "(Regenzeit möglich!)\nVormittags:\n- Zitadelle & Verbotene Purpurne Stadt\n- Dong Ba Markt\nMittags:\n- Roller zu den Gräbern\nAbends:\n- Bootsfahrt auf dem Perfume River (Thien Mu Pagode)\n- Abendspaziergang am Fluss"),
  "days/2027-01-19": tag("Phong Nha"),
  "days/2027-01-20": tag("Phong Nha"),
  "days/2027-01-21": tag("Ninh Binh", "Adriana & Lukas Rückflug 21 Uhr Saigon"),
  "days/2027-01-22": tag("Ninh Binh"),
  "days/2027-01-23": tag("Ninh Binh"),
  "days/2027-01-24": tag("Halong"),
  "days/2027-01-25": tag("Halong"),
  "days/2027-01-26": tag("Sapa"),
  "days/2027-01-27": tag("Sapa"),
  "days/2027-01-28": tag("Sapa"),
  "days/2027-01-29": tag("Hanoi"),
  "days/2027-01-30": tag("Hanoi"),
  "days/2027-01-31": tag("Hanoi"),
  "days/2027-02-01": tag("Hanoi"),
  "days/2027-02-02": tag("Hanoi"),
  "days/2027-02-03": tag("Hanoi"),
  "days/2027-02-04": tag("Hanoi", "Rückflug nach Deutschland"),
  "budget/b01": { kategorie: "Flüge", geplant: "", tatsaechlich: "", order: 1 },
  "budget/b02": { kategorie: "Unterkünfte", geplant: "", tatsaechlich: "", order: 2 },
  "budget/b03": { kategorie: "Roller (Kauf / Miete / Rückkauf)", geplant: "", tatsaechlich: "", order: 3 },
  "budget/b04": { kategorie: "Benzin & Maut", geplant: "", tatsaechlich: "", order: 4 },
  "budget/b05": { kategorie: "Essen & Trinken", geplant: "", tatsaechlich: "", order: 5 },
  "budget/b06": { kategorie: "Eintritte & Touren", geplant: "", tatsaechlich: "", order: 6 },
  "budget/b07": { kategorie: "Visum, Versicherung, Sonstiges", geplant: "", tatsaechlich: "", order: 7 },
  "checklist/c01": { text: "Reisepass gültig, Einreisebestimmungen / Visum geprüft", done: false, order: 1 },
  "checklist/c02": { text: "Führerschein für Roller in Vietnam anerkannt (aktuell prüfen)", done: false, order: 2 },
  "checklist/c03": { text: "Auslandskrankenversicherung abgeschlossen", done: false, order: 3 },
  "checklist/c04": { text: "Impfungen und Reiseapotheke geklärt", done: false, order: 4 },
  "checklist/c05": { text: "Roller: Kauf oder Miete (One-Way) organisiert", done: false, order: 5 },
  "checklist/c06": { text: "Helm(e), Regenkleidung, Handyhalterung", done: false, order: 6 },
  "checklist/c07": { text: "eSIM / SIM-Karte und Powerbank", done: false, order: 7 },
  "checklist/c08": { text: "Reiserucksack passend zur Rollertour", done: false, order: 8 },
  "checklist/c09": { text: "Kopien der Dokumente (digital und Papier)", done: false, order: 9 },
  "checklist/c10": { text: "Unterkünfte für die ersten Nächte gebucht", done: false, order: 10 }
};
