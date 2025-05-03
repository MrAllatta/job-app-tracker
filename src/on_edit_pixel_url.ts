// on_edit_url_and_html.ts - Generate tracking URLs and Rendered HTML on edit
function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit): void {
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== APPLICATION_SHEET) return;

  const col = range.getColumn();
  const row = range.getRow();
  const MESSAGE_BODY_COL = 13;
  const RENDERED_HTML_COL = MESSAGE_BODY_COL + 1;

  const isUrlCol = col >= 1 && col <= 4;
  if (!isUrlCol && col !== MESSAGE_BODY_COL) return;

  const applicationId = sheet.getRange(row, 1).getDisplayValue();
  const company = sheet.getRange(row, 2).getDisplayValue();
  const jobTitle = sheet.getRange(row, 3).getDisplayValue();
  const stage = sheet.getRange(row, 4).getDisplayValue();
  if (!applicationId || !company || !jobTitle || !stage) {
    Logger.log(`onEdit: Row ${row} has incomplete A-D data, skipping`);
    return;
  }

  if (isUrlCol) {
    const scriptProps = PropertiesService.getScriptProperties();
    const deploymentId = scriptProps.getProperty('DEPLOYMENT_ID');
    if (!deploymentId) {
      Logger.log('onEdit: DEPLOYMENT_ID not set, skipping URL generation');
    } else {
      const baseUrl = `https://script.google.com/macros/s/${deploymentId}/exec`;
      const pixelUrl = `${baseUrl}?id=${encodeURIComponent(applicationId)}&company=${encodeURIComponent(company)}&job=${encodeURIComponent(jobTitle)}&stage=${encodeURIComponent(stage)}`;
      sheet.getRange(row, 5).setValue(pixelUrl);

      const redirectUrl = sheet.getRange(row, 7).getDisplayValue();
      if (redirectUrl) {
        const clickUrl = `${baseUrl}?click=true&id=${encodeURIComponent(applicationId)}&company=${encodeURIComponent(company)}&job=${encodeURIComponent(jobTitle)}&stage=${encodeURIComponent(stage)}&redirect=${encodeURIComponent(redirectUrl)}`;
        sheet.getRange(row, 6).setValue(clickUrl);
      }
    }
  }

  const pixelUrlValue = sheet.getRange(row, 5).getDisplayValue();
  const clickUrlValue = sheet.getRange(row, 6).getDisplayValue();
  const messageBody = sheet.getRange(row, MESSAGE_BODY_COL).getValue() as string;
  if (!pixelUrlValue) {
    Logger.log(`onEdit: Row ${row} missing Pixel URL, skipping HTML generation`);
    return;
  }
  if (!messageBody) {
    Logger.log(`onEdit: Row ${row} missing Message Body, skipping HTML generation`);
    return;
  }

  const htmlBody = htmlifyMessage(messageBody, pixelUrlValue, clickUrlValue, applicationId, company, jobTitle, stage);
  sheet.getRange(row, RENDERED_HTML_COL).setValue(htmlBody);
}



