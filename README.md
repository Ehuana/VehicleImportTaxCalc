# Vehicle Import Tax Calculator (Cambodia)

Unofficial bilingual (English/Khmer) web calculator for estimating Cambodia vehicle import taxes using the 2026 structure defined in the project logic.

## Features

- Cascading tax calculation model (CD -> ST -> VAT)
- Vehicle category selection with rate reference table
- English/Khmer language switching
- Dark/Light theme switching
- Terms consent flow with access lock until accepted
- Separate terms page with persisted consent status

## Tech Stack

- HTML5
- CSS3 + Bootstrap 5
- Vanilla JavaScript
- Google Fonts + Font Awesome CDN

## Run Locally

1. Clone/download this repository.
2. Open the project folder.
3. Launch [index.html](index.html) in a browser.

No build step is required.

## Important Notice

This tool is unofficial and provides estimates only. Always confirm final tax/payable values with official Cambodia Customs channels before making financial decisions.

## Files

- [index.html](index.html): Main calculator UI
- [script.js](script.js): Calculator/business logic, i18n, terms gating
- [style.css](style.css): Theme and component styling
- [terms.html](terms.html): Full terms page
- [terms.js](terms.js): Terms page interactions

## Security and Hardening

- Content-Security-Policy and Referrer-Policy meta headers are configured.
- External links use `noopener noreferrer`.
- Terms return URL is sanitized.
- Local storage access is wrapped defensively for restricted browser modes.
