// utils_mail.ts - Utility function for constructing HTML email messages
/**
 * Converts a plain text message with placeholders into HTML email content.
 *
 * @param messageBody Plain text message containing {{click}} and {{pixel}} placeholders.
 * @param pixelUrl URL for the tracking pixel.
 * @param clickUrl Optional URL for the click-through link.
 * @returns HTML string with placeholders replaced and standard header/footer.
 */
function htmlifyMessage(
  messageBody: string,
  pixelUrl: string,
  clickUrl?: string
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

  // Assemble full HTML
  return [header, bodyHtml, footer, trackingPixel].join('\n');
}