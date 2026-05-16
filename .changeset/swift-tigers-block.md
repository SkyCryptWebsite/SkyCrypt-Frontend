---
"skycrypt-frontend": patch
---

Harden security headers against iframe-based phishing. The phishing site `sky.shiiiyu.moe` was embedding the real site in an invisible cross-origin iframe and rewriting `history.pushState` to disguise the URL bar. The fix layers three browser-enforced controls: `Content-Security-Policy: frame-ancestors 'self'` (modern browsers) and `X-Frame-Options: DENY` (older-browser fallback) refuse the iframe outright, and `Cross-Origin-Opener-Policy: same-origin` isolates the top-level browsing context group so a malicious opener cannot reach back via `window.opener`. The `/api/*` surface is unaffected — partner integrations (e.g., Lunar Client) that call the Go backend directly continue to work.
