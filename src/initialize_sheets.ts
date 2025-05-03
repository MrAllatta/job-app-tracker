// initialize_sheets.ts - Auto-create spreadsheet and sheets
// ---------------------------------------------
/**
 * Install an onEdit trigger if not already installed
 */
function installOnEditTrigger(): void {
  const scriptProps = PropertiesService.getScriptProperties();
  const ssId = scriptProps.getProperty(SCRIPT_PROP_SHEET_ID)!;
  const triggers = ScriptApp.getProjectTriggers();
  const hasTrigger = triggers.some(t => t.getHandlerFunction() === 'onEdit');
  if (hasTrigger) {
    Logger.log('installOnEditTrigger: onEdit trigger already exists');
    return;
  }
  try {
    const ss = SpreadsheetApp.openById(ssId);
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(ss)
      .onEdit()
      .create();
    Logger.log('installOnEditTrigger: onEdit trigger installed');
  } catch (e: any) {
    Logger.log('installOnEditTrigger: failed to install onEdit trigger: ' + e.message);
  }
}
function initializeSheets(): void {
  const scriptProps = PropertiesService.getScriptProperties();
  let ssId = scriptProps.getProperty(SCRIPT_PROP_SHEET_ID);
  let ss: GoogleAppsScript.Spreadsheet.Spreadsheet;
  if (!ssId) {
    ss = SpreadsheetApp.create('Application Tracking Data');
    ssId = ss.getId();
    scriptProps.setProperty(SCRIPT_PROP_SHEET_ID, ssId);
  } else {
    ss = SpreadsheetApp.openById(ssId);
  }
  const sheetNames = ss.getSheets().map(s => s.getName());
  // Applications sheet
  if (!sheetNames.includes(APPLICATION_SHEET)) {
    const sheet = ss.getSheets()[0];
    sheet.setName(APPLICATION_SHEET);
    sheet.clear();
    const headers = [
      'Application ID',
      'Company',
      'Job Title',
      'Stage',
      'Pixel URL',
      'Click URL',
      'Redirect URL',
      'Last Opened',
      'Open Count',
      'To Email',
      'CC Email',
      'Subject',
      'Message Body',
      'Rendered HTML',
      'Attachments',
      'Sent Flag',
    ];
    sheet.appendRow(headers);
    Logger.log('initializeSheets: Applications sheet created');
  }
  // Ensure Attachments column exists in Applications sheet
  {
    const appSheet = ss.getSheetByName(APPLICATION_SHEET)!;
    const existingHeaders = appSheet
      .getRange(1, 1, 1, appSheet.getLastColumn())
      .getValues()[0] as string[];
    if (existingHeaders.indexOf('Attachments') === -1) {
      appSheet.getRange(1, existingHeaders.length + 1).setValue('Attachments');
      Logger.log('initializeSheets: added missing header Attachments');
    }
  }
  // Pixel Log sheet
  if (!sheetNames.includes(PIXEL_LOG_SHEET)) {
    const pixelSheet = ss.insertSheet(PIXEL_LOG_SHEET);
    pixelSheet.appendRow([
      'Timestamp',
      'Application ID',
      'Company',
      'Job Title',
      'Stage',
    ]);
    Logger.log('initializeSheets: Pixel Log sheet created');
  }
  // Click Log sheet
  if (!sheetNames.includes(CLICK_LOG_SHEET)) {
    const clickSheet = ss.insertSheet(CLICK_LOG_SHEET);
    clickSheet.appendRow(['Timestamp', 'Application ID', 'Company', 'Job Title', 'Stage', 'Redirect URL']);
    Logger.log('initializeSheets: Click Log sheet created');
  }
  Logger.log(`Spreadsheet URL: ${ss.getUrl()}`);
  installOnEditTrigger();
}
