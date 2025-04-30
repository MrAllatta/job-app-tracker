"use strict";
// v1_pixel_tracker.ts - Pixel open tracking handler
function doGet(e) {
    if (e.parameter.click === 'true') {
        return handleClick(e);
    }
    return handlePixel(e);
}
function handlePixel(e) {
    var appId = e.parameter.id;
    var stage = e.parameter.stage;
    var userAgent = e.parameter.ua || 'Unknown';
    if (appId && stage) {
        logPixel(appId, stage, userAgent);
        updateApplicationLastOpened(appId);
    }
    var pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    var bytes = Utilities.base64Decode(pixelBase64);
    return Utilities.newBlob(bytes, 'image/png');
}
