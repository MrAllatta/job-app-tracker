// debug_tools.ts - Testing and debugging utilities

/**
 * Simulate a doGet() call to handlePixel() with test parameters.
 * Callable from the Apps Script Editor for manual testing.
 */
function testHandlePixel(): void {
  const mockEvent = {
    parameter: {
      id: 'TEST_ID',
      company: 'DebugCo',
      job: 'Engineer',
      stage: 'Testing'
    }
  } as GoogleAppsScript.Events.DoGet;
  Logger.log(`Testing handlePixel with parameters: ${JSON.stringify(mockEvent.parameter)}`);
  try {
    const result = handlePixel(mockEvent);
    // Log blob details if available
    if (result && typeof result.getBytes === 'function') {
      const bytes = result.getBytes();
      Logger.log(`handlePixel returned blob of size: ${bytes.length}, content type: ${result.getContentType()}`);
    } else {
      Logger.log('handlePixel did not return a blob source as expected.');
    }
  } catch (err) {
    Logger.log(`Error in testHandlePixel: ${err}`);
  }
}

/**
 * Append a timestamped debug message to the 'Debug Log' sheet.
 * Creates the sheet with headers if it does not exist.
 * @param message - The debug message or object to log.
 */
function logDebug(message: string | object): void {
  const msgStr = typeof message === 'object' ? JSON.stringify(message) : message;
  Logger.log(`logDebug: ${msgStr}`);
  const ssId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_SHEET_ID);
  if (!ssId) {
    Logger.log('Spreadsheet ID not set. Please run initializeSheets first.');
    return;
  }
  const ss = SpreadsheetApp.openById(ssId);
  let sheet = ss.getSheetByName('Debug Log');
  if (!sheet) {
    sheet = ss.insertSheet('Debug Log');
    sheet.appendRow(['Timestamp', 'Message']);
  }
  try {
    sheet.appendRow([new Date(), msgStr]);
  } catch (err) {
    Logger.log(`Error writing to Debug Log sheet: ${err}`);
  }
}

/**
 * Read the last row of the 'Pixel Log' sheet and log it to the console.
 */
function inspectLastPixelLog(): void {
  const ssId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_SHEET_ID);
  if (!ssId) {
    throw new Error('Spreadsheet ID not set. Please run initializeSheets first.');
  }
  const ss = SpreadsheetApp.openById(ssId);
  const sheet = ss.getSheetByName(PIXEL_LOG_SHEET);
  if (!sheet) {
    Logger.log(`Sheet "${PIXEL_LOG_SHEET}" not found.`);
    return;
  }
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log('No entries found in Pixel Log sheet.');
    return;
  }
  const lastData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log(`Last Pixel Log entry: ${JSON.stringify(lastData)}`);
}