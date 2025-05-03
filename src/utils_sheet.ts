// utils_sheet.ts - Common utility functions for sheet operations
function getSheet(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const ssId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_SHEET_ID);
  if (!ssId) {
    throw new Error('Spreadsheet ID not set. Please run initializeSheets first.');
  }
  const ss = SpreadsheetApp.openById(ssId);
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet "${name}" not found in spreadsheet.`);
  }
  return sheet;
}

/**
 * Log a pixel event with structured parameters
 * @param appId Application ID
 * @param company Company name
 * @param jobTitle Job title
 * @param stage Application stage
 */
function logPixel(appId: string, company: string, jobTitle: string, stage: string): void {
  const sheet = getSheet(PIXEL_LOG_SHEET);
  sheet.appendRow([new Date(), appId, company, jobTitle, stage]);
}

/**
 * Log a click event with structured parameters
 * @param appId Application ID
 * @param company Company name
 * @param jobTitle Job title
 * @param stage Application stage
 * @param redirect Redirect URL
 */
function logClick(appId: string, company: string, jobTitle: string, stage: string, redirect: string): void {
  const sheet = getSheet(CLICK_LOG_SHEET);
  sheet.appendRow([new Date(), appId, company, jobTitle, stage, redirect]);
}

function updateApplicationLastOpened(appId: string): void {
  const sheet = getSheet(APPLICATION_SHEET);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === appId) {
      const row = i + 1;
      const countCell = sheet.getRange(row, 3);
      const prevCount = Number(countCell.getValue()) || 0;
      countCell.setValue(prevCount + 1);
      sheet.getRange(row, 4).setValue(new Date());
      return;
    }
  }
}
