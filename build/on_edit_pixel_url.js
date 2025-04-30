"use strict";
// on_edit_pixel_url.ts - Auto-generate pixel URLs on edit
function onEdit(e) {
    var range = e.range;
    var sheet = range.getSheet();
    if (sheet.getName() !== APPLICATION_SHEET)
        return;
    var col = range.getColumn();
    if (col === 1 || col === 2) {
        var row = range.getRow();
        var applicationId = sheet.getRange(row, 1).getDisplayValue();
        var stage = sheet.getRange(row, 2).getDisplayValue();
        if (applicationId && stage) {
            var scriptId = ScriptApp.getScriptId();
            var url = "https://script.google.com/macros/s/".concat(scriptId, "/exec?id=").concat(encodeURIComponent(applicationId), "&stage=").concat(encodeURIComponent(stage));
            sheet.getRange(row, 5).setValue(url);
        }
    }
}
