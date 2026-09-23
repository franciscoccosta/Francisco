/**
 * ReMade → Google Sheets receiver.
 *
 * Receives every form submission and every anonymous site event from the
 * ReMade site (SUBMISSIONS_WEBHOOK_URL) and writes them into this spreadsheet:
 *
 *   Resumo      — the validation numbers, calculated live
 *   Builders    — "I have wood to offer" forms (photos saved to Google Drive)
 *   Designers   — "I'm looking for wood" signups
 *   Requests    — "I'm interested in this material" requests
 *   Events      — page views, passport views, CTA clicks
 *
 * Setup instructions: docs/google-sheets.md
 */

const SHEETS = { supplier: "Builders", buyer: "Designers", request: "Requests" };
const EVENT_COLUMNS = ["createdAt", "type", "visitorId", "path", "materialId", "label", "referrer"];
const PHOTO_FOLDER = "ReMade — fotos de materiais";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.kind === "event") {
      sheet_("Events", EVENT_COLUMNS).appendRow(EVENT_COLUMNS.map((c) => data[c] || ""));
    } else {
      saveSubmission_(data);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function saveSubmission_(data) {
  const row = { createdAt: data.createdAt, materialId: data.materialId || "", email: "", ...data.payload };
  delete row.photos;

  const links = (data.files || []).map((f, i) => {
    const blob = Utilities.newBlob(Utilities.base64Decode(f.base64), f.type, `${data.createdAt.slice(0, 10)} ${row.company || ""} ${i + 1}`);
    return photoFolder_().createFile(blob).getUrl();
  });
  if (links.length) row.photos = links.join("\n");

  for (const k in row) if (Array.isArray(row[k])) row[k] = row[k].join(", ");

  const name = SHEETS[data.type] || "Other";
  const sheet = sheet_(name, Object.keys(row));
  // Add any new field as a new column, so the sheet follows the forms
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = Object.keys(row).filter((k) => headers.indexOf(k) === -1);
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
    headers = headers.concat(missing);
  }
  sheet.appendRow(headers.map((h) => (h in row ? row[h] : "")));
  // Let the numbers be visitor-linked for the conversion rate
  sheet_("_visitors", ["createdAt", "type", "visitorId"]).appendRow([data.createdAt, data.type, data.visitorId || ""]);
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function photoFolder_() {
  const it = DriveApp.getFoldersByName(PHOTO_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER);
}

/** Run once from the editor: creates the tabs and the live summary. */
function setup() {
  sheet_("Builders", ["createdAt", "materialId", "email"]);
  sheet_("Designers", ["createdAt", "materialId", "email"]);
  sheet_("Requests", ["createdAt", "materialId", "email"]);
  sheet_("Events", EVENT_COLUMNS);
  sheet_("_visitors", ["createdAt", "type", "visitorId"]).hideSheet();

  const s = sheet_("Resumo", ["Métrica", "Valor"]);
  const rows = [
    ["Visitantes (únicos)", '=IFERROR(COUNTUNIQUE(FILTER(Events!C2:C, Events!B2:B="page_view")), 0)'],
    ["Páginas vistas", '=COUNTIF(Events!B2:B, "page_view")'],
    ["Submissões de construtoras", "=COUNTA(Builders!A2:A)"],
    ["Registos de arquitetos/designers", "=COUNTA(Designers!A2:A)"],
    ["Pedidos de material", "=COUNTA(Requests!A2:A)"],
    ["Conversão visitante → registo", '=IFERROR(COUNTUNIQUE(FILTER(_visitors!C2:C, _visitors!B2:B<>"request", _visitors!C2:C<>"")) / B2, 0)'],
    ["Conversão passaporte visto → pedido", '=IFERROR(COUNTUNIQUE(FILTER(_visitors!C2:C, _visitors!B2:B="request", _visitors!C2:C<>"")) / COUNTUNIQUE(FILTER(Events!C2:C, Events!B2:B="passport_view")), 0)'],
  ];
  s.getRange(2, 1, rows.length, 2).setValues(rows);
  s.getRange(7, 2, 2, 1).setNumberFormat("0.0%");
  s.autoResizeColumn(1);
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(s);
  photoFolder_();
}
