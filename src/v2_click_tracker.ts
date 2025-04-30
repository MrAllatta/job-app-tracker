// v2_click_tracker.ts - Click event tracker and redirector
function handleClick(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  const appId = e.parameter.id;
  const stage = e.parameter.stage;
  const destination = e.parameter.destination || '';
  const userAgent = e.parameter.ua || 'Unknown';
  if (appId && stage && destination) {
    logClick(appId, stage, destination, userAgent);
  }
  const html = `
    <html>
      <head>
        <script>window.location.href = ${JSON.stringify(destination)};</script>
      </head>
      <body></body>
    </html>`;
  const output = HtmlService.createHtmlOutput(html);
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}
