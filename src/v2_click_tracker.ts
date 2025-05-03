// v2_click_tracker.ts - Click event tracker and redirector
/**
 * Handle click tracking and redirect
 */
function handleClick(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  // Parse and validate parameters
  const id = e.parameter.id || '';
  const company = e.parameter.company || '';
  const jobTitle = e.parameter.job || '';
  const stage = e.parameter.stage || '';
  const redirect = e.parameter.redirect || '';
  if (id && company && jobTitle && stage && redirect) {
    logClick(id, company, jobTitle, stage, redirect);
  } else {
    Logger.log(`handleClick: missing parameters, received ${JSON.stringify(e.parameter)}`);
  }
  // Redirect via client-side script
  const html = `<script>window.location.href="${redirect}"</script>`;
  return HtmlService.createHtmlOutput(html);
}
