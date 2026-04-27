# UAT CHECKLIST (User Acceptance Testing)
**Project:** Urban Growth Time Machine (PoC #28)
**Goal:** Verify physical interaction and data integrity.

---

## 1. UI & DNA Layout
- [ ] **[ ]** Background is solid `#030712`.
- [ ] **[ ]** Sidebar is exactly 30% of the screen width and does not shift.
- [ ] **[ ]** Hovering over filters (LIVE, PILOT, etc.) shows a cyan glow and a tooltip.
- [ ] **[ ]** Sidebar contains Sections A (Overview), B (Why This Matters), C (Controls), D (Insights), and E (Download).

## 2. Intelligence Engine (MapStage)
- [ ] **[ ]** Toggle **2018_BASE** vs **2023_SYNC**. Verify markers change position/size.
- [ ] **[ ]** Toggle **[POPULATION_HEATMAP]**. Verify deck.gl density layer appears.
- [ ] **[ ]** Change Filter to **PILOT**. Verify map filters nodes immediately without reload.
- [ ] **[ ]** Verify "Trend Anomaly" text in sidebar changes context (e.g., STABLE vs ACCELERATING).

## 3. Persistence & Export
- [ ] **[ ]** Click **[SAVE_SNAPSHOT]**. Verify UI says `[SAVED]`.
- [ ] **[ ]** Open **LIBRARY** tab. Verify the new snapshot appears in the list.
- [ ] **[ ]** Click **Download Sample GeoJSON**. Verify a `.json` file is downloaded to your machine.
- [ ] **[ ]** Inspect downloaded JSON. Verify it contains `intelligence_score` and `insight`.

## 4. Guardrail (Failure Simulation)
- [ ] **[ ]** (Dev Test) Stop the Backend server (`Ctrl+C` in uvicorn terminal).
- [ ] **[ ]** Refresh Frontend. Verify UI shows `GUARDRAIL_FALLBACK` insight instead of crashing.

---

### Final Sign-Off:
**Tester Name:** _____________________
**Date:** 2026-04-27
**Status:** [ PASS / FAIL ]
