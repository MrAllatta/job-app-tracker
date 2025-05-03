// utils_mail.ts - Utility function for constructing HTML email messages
/**
 * Converts a plain text message with placeholders into HTML email content.
 *
 * @param messageBody Plain text message containing {{click}} and {{pixel}} placeholders.
 * @param pixelUrl URL for the tracking pixel.
 * @param clickUrl Optional URL for the click-through link.
 * @param appId Optional application ID for click tracking.
 * @param company Optional company name for click tracking.
 * @param jobTitle Optional job title for click tracking.
 * @param stage Optional application stage for click tracking.
 * @returns HTML string with placeholders replaced and standard header, footer, tracking pixel, and click tracking link (if provided).
 */
function htmlifyMessage(
  messageBody: string,
  pixelUrl: string,
  clickUrl?: string,
  appId?: string,
  company?: string,
  jobTitle?: string,
  stage?: string
): string {
  let bodyContent = messageBody;
  // Replace click placeholder if URL provided
  if (clickUrl) {
    bodyContent = bodyContent.replace(
      /\{\{\s*click\s*\}\}/g,
      `<a href="${clickUrl}">our website</a>`
    );
  }
  // Replace pixel placeholder
  bodyContent = bodyContent.replace(
    /\{\{\s*pixel\s*\}\}/g,
    `<img src="${pixelUrl}" width="1" height="1" style="display:none;">`
  );

  // Wrap the body content in a paragraph
  const bodyHtml = `<p>${bodyContent}</p>`;

  // Standard header and footer
  const header = '<p>Dear Hiring Team,</p>';
  const footer = '<p>Sincerely,<br>Your Name</p>';
  const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none;">`;
  // Construct click tracking link if all parameters provided
  let signatureLinkHtml = '';
  if (clickUrl && appId && company && jobTitle && stage) {
    const deploymentId = PropertiesService.getScriptProperties().getProperty('DEPLOYMENT_ID')!;
    const wrappedClickUrl =
      `https://script.google.com/macros/s/${deploymentId}/exec?click=true` +
      `&id=${encodeURIComponent(appId)}` +
      `&company=${encodeURIComponent(company)}` +
      `&job=${encodeURIComponent(jobTitle)}` +
      `&stage=${encodeURIComponent(stage)}` +
      `&redirect=${encodeURIComponent(clickUrl)}`;
    signatureLinkHtml = `<p><a href="${wrappedClickUrl}">Visit our site</a></p>`;
  }

  // Assemble full HTML
  const parts = [header, bodyHtml, footer];
  if (signatureLinkHtml) {
    parts.push(signatureLinkHtml);
  }
  parts.push(trackingPixel);
  return parts.join('\n');
}