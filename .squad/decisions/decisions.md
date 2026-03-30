# Decisions Log

## Security Review Outcomes — Basher

**Date:** 2026-03-30  
**Agent:** Basher (Security Specialist)

### Critical Issue Resolved

**Finding:** Plaintext password comments in `js/game.js` exposed all 5 game answers to any player opening DevTools → Sources tab.

**Decision:** Remove all inline password comments from the `levelPasswords` object. Retain SHA-256 hashes for server-side validation. All 5 levels remain solvable through intended puzzle mechanics.

**Status:** ✅ FIXED  
**Impact:** Eliminates critical information leakage vulnerability without breaking game functionality.

### Deployment Requirements

**Finding:** GAME_DESIGN.md (containing plaintext passwords) and .squad/ directory are accessible in the repo root and would be exposed if deployed as-is.

**Decision:** Exclude both from production deployment via:
- .htaccess rewrite rules, or
- Netlify _redirects file, or  
- Build-step file filtering

**Status:** ⏳ PENDING IMPLEMENTATION  
**Impact:** Protects puzzle integrity in production environment.

### Verification Complete

All 5 levels audited and verified:
- Clues and hidden elements function correctly
- SHA-256 hashes match all passwords
- Base64 encoding verified
- No cross-level password leakage

**Status:** ✅ VERIFIED
