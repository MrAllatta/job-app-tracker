// send_email_from_sheet.ts - Send pending emails from Applications sheet
/**
 * Scans the Applications sheet for rows without a sent flag,
 * injects {{pixel}} and {{click}} placeholders with tracking URLs,
 * sends email via MailApp, and marks rows as sent.
 */
function sendPendingEmailsFromSheet(): void {
  const sheet = getSheet(APPLICATION_SHEET);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues() as any[][];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const sentFlag = row[14]; // Column O (Sent Flag)
    if (sentFlag) continue;
    const to = row[9] as string;           // Column J (To Email)
    const cc = row[10] as string;          // Column K (CC Email)
    if (!to) {
      Logger.log(`sendPendingEmailsFromSheet: missing 'to' email for row ${i + 1}`);
      continue;
    }
    const subject = row[11] as string;     // Column L (Subject)
    const body = row[12] as string;        // Column M (Message Body)
    const pixelUrl = row[4] as string;     // Column E (Pixel URL)
    const clickUrl = row[5] as string;     // Column F (Click URL)
    const htmlBody = htmlifyMessage(body, pixelUrl, clickUrl);
    const attachmentsStr = row[13] as string; // Column N (Attachments)
    const attachmentNames = attachmentsStr
      ? attachmentsStr.split(',').map(s => s.trim()).filter(s => s)
      : [];
    const attachments: GoogleAppsScript.Base.Blob[] = [];
    attachmentNames.forEach(name => {
      const files = DriveApp.getFilesByName(name);
      if (files.hasNext()) {
        attachments.push(files.next().getBlob());
      } else {
        Logger.log(`sendPendingEmailsFromSheet: attachment "${name}" not found for row ${i + 1}`);
      }
    });
    try {
      MailApp.sendEmail({
        to,
        cc,
        subject,
        htmlBody,
        attachments,
      });
      sheet.getRange(i + 1, 15).setValue('TRUE');
      Logger.log(`sendPendingEmailsFromSheet: email sent to ${to} for row ${i + 1}`);
    } catch (e: any) {
      Logger.log(`sendPendingEmailsFromSheet: failed to send email to ${to} on row ${i + 1}: ${e.message}`);
    }
  }
}