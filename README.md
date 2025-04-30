# Lightweight Pixel and Click Tracker for Job Applications

This project implements a scalable, lightweight email tracking system for job application emails using Google Apps Script and TypeScript.

## Structure

- `src/config.ts`: Constants (Sheet IDs, Sheet Names)
- `src/utils_sheet.ts`: Common Sheet Utilities (logging, updating rows)
- `src/v1_pixel_tracker.ts`: Pixel tracking endpoint
- `src/v2_click_tracker.ts`: Click tracking + redirection endpoint

## Usage


1. `npm install -g @google/clasp`
2. Login with `clasp login`
3. Create a new Apps Script project or clone existing
4. Set up `.clasp.json` with your `scriptId`
5. Push code using: `clasp push --watch --transpile`
6. Deploy the Web App:
- Execute as: Me
- Access: Anyone, even anonymous

7. Embed pixel URLs and click URLs into emails.

## Pixel URL format
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?id=APPLICATION_ID&stage=STAGE

## Click URL format

https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?click=true&id=APPLICATION_ID&stage=STAGE&redirect=DESTINATION_URL


## Notes
- All opens and clicks are logged into corresponding Google Sheets.
- Versioned modular code for future upgrades.
