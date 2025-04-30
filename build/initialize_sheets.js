"use strict";
// initialize_sheets.ts - Auto-create spreadsheet and sheets
// ---------------------------------------------
function installOnEditTrigger() {
    var scriptProps = PropertiesService.getScriptProperties();
    var ssId = scriptProps.getProperty(SCRIPT_PROP_SHEET_ID);
    var triggers = ScriptApp.getProjectTriggers();
    var hasTrigger = triggers.some(function (t) { return t.getHandlerFunction() === 'onEdit'; });
    if (hasTrigger) {
        Logger.log('installOnEditTrigger: onEdit trigger already exists');
        return;
    }
    try {
        var ss = SpreadsheetApp.openById(ssId);
        ScriptApp.newTrigger('onEdit')
            .forSpreadsheet(ss)
            .onEdit()
            .create();
        Logger.log('installOnEditTrigger: onEdit trigger installed');
    } catch (e) {
        Logger.log('installOnEditTrigger: failed to install onEdit trigger: ' + e.message);
    }
}
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
    installOnEditTrigger();
}
