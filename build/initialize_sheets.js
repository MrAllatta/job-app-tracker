"use strict";
// initialize_sheets.ts - Auto-create spreadsheet and sheets
function initializeSheets() {
    var scriptProps = PropertiesService.getScriptProperties();
    var ssId = scriptProps.getProperty(SCRIPT_PROP_SHEET_ID);
    var ss;
    if (!ssId) {
        ss = SpreadsheetApp.create('Application Tracking Data');
        ssId = ss.getId();
        scriptProps.setProperty(SCRIPT_PROP_SHEET_ID, ssId);
    }
    else {
        ss = SpreadsheetApp.openById(ssId);
    }
    var sheetNames = ss.getSheets().map(function (s) { return s.getName(); });
    // Applications sheet
    if (!sheetNames.includes(APPLICATION_SHEET)) {
        var sheet = ss.getSheets()[0];
        sheet.setName(APPLICATION_SHEET);
        sheet.clear();
        sheet.appendRow(['Application ID', 'Stage', 'Open Count', 'Last Opened', 'Pixel URL']);
    }
    // Pixel Log sheet
    if (!sheetNames.includes(PIXEL_LOG_SHEET)) {
        var pixelSheet = ss.insertSheet(PIXEL_LOG_SHEET);
        pixelSheet.appendRow(['Timestamp', 'Application ID', 'Stage', 'User Agent']);
    }
    // Click Log sheet
    if (!sheetNames.includes(CLICK_LOG_SHEET)) {
        var clickSheet = ss.insertSheet(CLICK_LOG_SHEET);
        clickSheet.appendRow(['Timestamp', 'Application ID', 'Stage', 'Destination', 'User Agent']);
    }
    Logger.log("Spreadsheet URL: ".concat(ss.getUrl()));
}
