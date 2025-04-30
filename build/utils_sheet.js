"use strict";
// utils_sheet.ts - Common utility functions for sheet operations
function getSheet(name) {
    var ssId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_SHEET_ID);
    if (!ssId) {
        throw new Error('Spreadsheet ID not set. Please run initializeSheets first.');
    }
    var ss = SpreadsheetApp.openById(ssId);
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
        throw new Error("Sheet \"".concat(name, "\" not found in spreadsheet."));
    }
    return sheet;
}
function logPixel(appId, stage, userAgent) {
    var sheet = getSheet(PIXEL_LOG_SHEET);
    sheet.appendRow([new Date(), appId, stage, userAgent]);
}
function logClick(appId, stage, destination, userAgent) {
    var sheet = getSheet(CLICK_LOG_SHEET);
    sheet.appendRow([new Date(), appId, stage, destination, userAgent]);
}
function updateApplicationLastOpened(appId) {
    var sheet = getSheet(APPLICATION_SHEET);
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
        if (values[i][0] === appId) {
            var row = i + 1;
            var countCell = sheet.getRange(row, 3);
            var prevCount = Number(countCell.getValue()) || 0;
            countCell.setValue(prevCount + 1);
            sheet.getRange(row, 4).setValue(new Date());
            return;
        }
    }
}
