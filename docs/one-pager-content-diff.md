# One-pager PDF — regeneration content diff

**For AJ.** `public/triton-one-pager.pdf` cannot be safely hand-edited: its metadata
(`Producer: Skia/PDF`, `Creator: Chrome`) shows it was produced by printing a web
page/document to PDF (created 2026-07-10), and that source document is not in this
repo. Regenerate it from the original document with the changes below, then replace
`public/triton-one-pager.pdf`. Everything not listed here already matches the live site.

## 1. Specifications section title

| | |
|---|---|
| **Old (PDF)** | SPECIFICATIONS |
| **New** | TRITON V1 — Design Targets |

## 2. Communications row

| | |
|---|---|
| **Old (PDF)** | RF link to dock with autonomous fallback on signal loss |
| **New** | Fully autonomous during missions — no tether, no surface link. Data offload and recharge via short-range link at the dock; acoustic command channel on the roadmap. |

## 3. Table footnote — MISSING from the PDF, add it

| | |
|---|---|
| **Old (PDF)** | *(no footnote present)* |
| **New** | TRITON V1 is in active development. Confirmed values replace targets as validation progresses; "Pending" marks parameters we won't publish until measured. |

## 4. Sensor rows — split into two categories, wall-proximity removed

| | |
|---|---|
| **Old (PDF)** | **Navigation sensors:** IMU, DVL, motor encoders, GPS surface fix — sensor-fused pose estimation |
| | **Inspection sensors:** Camera, multibeam echosounder, sub-bottom profiler, sound velocity profiler, USBL acoustic positioning, cathodic-protection probe, wall-proximity sensing |
| **New** | **Navigation & positioning:** IMU, DVL, motor encoders, GPS surface fix, USBL acoustic positioning, sound velocity profiler — sensor-fused pose estimation |
| | **Inspection payload:** Camera, multibeam echosounder, sub-bottom profiler, cathodic-protection probe |

## 5. "How It Works" step 02 — recommended for consistency

| | |
|---|---|
| **Old (PDF)** | Patrol — navigates pre-planned inspection routes with sensor-fused navigation and wall-proximity standoff. |
| **New** | Patrol — navigates pre-planned inspection routes with sensor-fused navigation, using fused ranging data for wall-proximity awareness. |

*(Wall-proximity is a derived autonomy behavior, not a sensor — same rationale as the
site fix. This one is a recommendation, not required by the addendum.)*

## Unchanged sections (verified against the extracted PDF text)

Title block, TRL-4 status line, depth rating, docking residency, Pending rows,
weight rows, onboard compute row, How-It-Works steps 01/03/04/05, traction line,
and the footer contacts all already match the live site.
