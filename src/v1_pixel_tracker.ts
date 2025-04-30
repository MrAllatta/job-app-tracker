// v1_pixel_tracker.ts - Pixel open tracking handler
function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput | GoogleAppsScript.Content.BlobSource {
  if (e.parameter.click === 'true') {
    return handleClick(e);
  }
  return handlePixel(e);
}

function handlePixel(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.BlobSource {
  const appId = e.parameter.id;
  const stage = e.parameter.stage;
  const userAgent = e.parameter.ua || 'Unknown';
  if (appId && stage) {
    logPixel(appId, stage, userAgent);
    updateApplicationLastOpened(appId);
  }
  const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const bytes = Utilities.base64Decode(pixelBase64);
  return Utilities.newBlob(bytes, 'image/png');
}
