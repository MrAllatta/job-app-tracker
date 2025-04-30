// on_edit_pixel_url.ts - Auto-generate pixel URLs on edit
function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit): void {
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== APPLICATION_SHEET) return;
  const col = range.getColumn();
  if (col === 1 || col === 2) {
    const row = range.getRow();
    const applicationId = sheet.getRange(row, 1).getDisplayValue();
    const stage = sheet.getRange(row, 2).getDisplayValue();
    if (applicationId && stage) {
      const scriptId = ScriptApp.getScriptId();
      const url = `https://script.google.com/macros/s/${scriptId}/exec?id=${encodeURIComponent(applicationId)}&stage=${encodeURIComponent(stage)}`;
      sheet.getRange(row, 5).setValue(url);
    }
  }
}



