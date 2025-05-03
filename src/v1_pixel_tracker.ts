// v1_pixel_tracker.ts - Pixel open tracking handler
function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput | GoogleAppsScript.Content.BlobSource {
  if (e.parameter.pixel === 'portfolio') {
    return handlePortfolioPixel(e);
  }
  if (e.parameter.click === 'true') {
    return handleClick(e);
  }
  return handlePixel(e);
}
/**
 * Handle portfolio analytics tracking via an invisible 1×1 pixel.
 * Logs page view data into a "PortfolioAnalytics" sheet.
 *
 * Example embedding in a static site (Jekyll):
 * <img src="https://SCRIPT_URL_HERE?pixel=portfolio&path=/about&referrer=teaching-portfolio" width="1" height="1" style="display:none" />
 */
function handlePortfolioPixel(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.BlobSource {
  const path = e.parameter.path || '';
  const referrer = e.parameter.referrer || '';
  const tsParam = e.parameter.ts || '';
  const timestamp = new Date();

  // Open the spreadsheet
  const ssId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_SHEET_ID);
  if (!ssId) {
    throw new Error('Spreadsheet ID not set. Please run initializeSheets first.');
  }
  const ss = SpreadsheetApp.openById(ssId);

  // Get or create the analytics sheet
  let sheet = ss.getSheetByName('PortfolioAnalytics');
  if (!sheet) {
    sheet = ss.insertSheet('PortfolioAnalytics');
    sheet.appendRow(['Timestamp', 'Path', 'Referrer', 'ParamTimestamp']);
  }

  // Append the page view record
  sheet.appendRow([timestamp, path, referrer, tsParam]);

  // Return a 1x1 transparent PNG
  const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const bytes = Utilities.base64Decode(pixelBase64);
  return Utilities.newBlob(bytes, 'image/png');
}

function handlePixel(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.BlobSource {
  // Debug: log received parameters and any missing fields
  logDebug(`Received parameters: ${JSON.stringify(e.parameter)}`);
  if (!e.parameter.id) {
    logDebug('Warning: Missing parameter "id"');
  }
  if (!e.parameter.company) {
    logDebug('Warning: Missing parameter "company"');
  }
  if (!e.parameter.job) {
    logDebug('Warning: Missing parameter "job"');
  }
  if (!e.parameter.stage) {
    logDebug('Warning: Missing parameter "stage"');
  }
  const appId = e.parameter.id || 'unknown';
  const company = e.parameter.company || 'unknown';
  const jobTitle = e.parameter.job || 'unknown';
  const stage = e.parameter.stage || 'unknown';
  logPixel(appId, company, jobTitle, stage);
  const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const bytes = Utilities.base64Decode(pixelBase64);
  return Utilities.newBlob(bytes, 'image/png');
}
