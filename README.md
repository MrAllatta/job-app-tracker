# Lightweight Pixel and Click Tracker for Job Applications

This project implements a scalable, lightweight email tracking system for job application emails using Google Apps Script and TypeScript.

## Structure

- `src/config.ts`: Constants (Sheet IDs, Sheet Names)
- `src/utils_sheet.ts`: Common Sheet Utilities (logging, updating rows)
- `src/v1_pixel_tracker.ts`: Pixel tracking endpoint
 - `src/v2_click_tracker.ts`: Click tracking + redirection endpoint
 - `src/send_email_from_sheet.ts`: Pending email sender with tracking pixel injection and sent flagging


## Deployment Steps

1. Run `clasp push --watch` to push code and watch for changes.

2. In the Apps Script Editor:
   - Run `initializeSheets()` manually.
   - Accept any permission prompts.

3. Deploy as Web App:
   - Execute as: Me
   - Access: Anyone, even anonymous

4. After deployment, copy the Deployment ID from the Web App URL:

	https://script.google.com/macros/s/**DEPLOYMENT_ID**/exec

5. Manually store the Deployment ID:
   `PropertiesService.getScriptProperties().setProperty('DEPLOYMENT_ID', 'PASTE_DEPLOYMENT_ID_HERE');`

Note: Deployment ID cannot be accessed programmatically from Apps Script. Manual storage is required once after deployment to enable proper pixel-URL generation via onEdit.

## Pixel URL format
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?id=APPLICATION_ID&stage=STAGE

## Click URL format

https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?click=true&id=APPLICATION_ID&stage=STAGE&destination=DESTINATION_URL

## Portfolio Analytics Tracking Pixel

Track page views on your static (Jekyll) site by embedding an invisible 1×1 tracking pixel. Events are logged to the "PortfolioAnalytics" sheet (created automatically).

HTML example:
```html
<img src="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?pixel=portfolio&path=/about&referrer=teaching-portfolio" width="1" height="1" style="display:none" />
```

## Initialize System
 
- In the Apps Script editor or via clasp, run the `initializeSheets` function to create the necessary Google Sheets and store the Spreadsheet ID.
 
## Reset System
 
- Run the `resetSystem` function to trash the existing spreadsheet and rebuild a fresh system.


## Notes
- All opens and clicks are logged into corresponding Google Sheets.
- Versioned modular code for future upgrades.
