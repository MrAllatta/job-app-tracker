"use strict";
// v2_click_tracker.ts - Click event tracker and redirector
function handleClick(e) {
    var appId = e.parameter.id;
    var stage = e.parameter.stage;
    var destination = e.parameter.destination || '';
    var userAgent = e.parameter.ua || 'Unknown';
    if (appId && stage && destination) {
        logClick(appId, stage, destination, userAgent);
    }
    var html = "\n    <html>\n      <head>\n        <script>window.location.href = ".concat(JSON.stringify(destination), ";</script>\n      </head>\n      <body></body>\n    </html>");
    var output = HtmlService.createHtmlOutput(html);
    output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return output;
}
