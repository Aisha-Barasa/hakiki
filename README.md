# 🩺 Hakiki Health

**"Grammarly for hospital claims."**

Hakiki Health is an AI-assisted, pre-submission validation module built for openIMIS. It intercepts SHA (Social Health Authority) claim data at the draft stage — flagging errors, checking eligibility rules, and scoring a claim's readiness — *before* it's ever formally submitted.

> *Hakiki* is Swahili for "verify" or "confirm." That's exactly what this tool does: it confirms a claim is clean before it goes anywhere near SHA.

By shifting claims handling from **reactive to proactive**, Hakiki Health cuts rejection rates, reduces administrative backlog, and protects revenue for healthcare facilities.

---

## 🚀 The Problem & The Solution

### The Reactive Reimbursement Crisis

Hospital billing today is entirely reactive: a clerk fills out a claim, submits it, and waits — sometimes days or weeks — for SHA to respond. If it's rejected over a mistyped ICD-10 code or a missing field, the facility eats the cost:

- Delayed cash flow and stalled revenue
- Hours spent diagnosing and refiling rejected claims
- Growing friction between providers and payers

### The Hakiki Shift

Hakiki Health sits between the clerk and SHA as an intelligent checkpoint. It reviews a claim the moment it's drafted and gives immediate, actionable feedback.

- **Catch errors early** — missing fields, bad codes, expired coverage, mismatched totals
- **Score every claim** — a transparent 0–100 readiness score, no black box
- **Explain in plain English** — Claude translates technical rule failures into instructions a claims clerk can act on
- **Zero disruption** — works entirely against draft/mock data until a claim is ready, then hands off a proper FHIR payload to openIMIS

---

## 🛠️ Architecture & System Flow

Hakiki Health is a **rule-based engine**, not a black-box classifier. Every score is traceable to a specific, named rule — auditable by design, and with no confusion matrix to defend to a room full of clinicians.

```
[ React Dashboard ]
        │
        ▼ (Select / edit a claim)
[ FastAPI Validation Engine ] ──► [ 7 Deterministic SHA Rules ]
        │                                   │
        │                                   ▼ (score + pass/fail per rule)
        │                         [ Claude API — Plain-English Explainer ]
        ▼                                   │
[ Score Gauge · Error Cards · Corrections ] ◄┘
        │
        ▼ (All errors resolved)
[ FHIR R4 ClaimResponse ] ──► [ openIMIS Core ]
```

### The step-by-step flow

1. **Draft / fetch** — The dashboard loads a claim, either from mock data or a live openIMIS FHIR `Claim` bundle.
2. **Rule pass** — Seven deterministic rules run against the claim: required fields, ICD-10 format, visit date sanity, item/service codes, coverage window, amount-vs-items match, and amount-reasonableness thresholds.
3. **Score** — Each failed rule deducts points (errors −20, warnings −10) off a base of 100, producing a color-coded status: 🟢 Ready · 🟡 Needs Review · 🔴 High Risk.
4. **Explain** — Every error is batched into a single Claude API call that returns a short, non-technical explanation and fix suggestion per rule.
5. **Correct & re-validate** — The clerk edits flagged fields inline; the claim is re-scored instantly, no resubmission needed.
6. **Submit** — Once all *errors* (not warnings) clear, a FHIR R4 `ClaimResponse` is built and POSTed to openIMIS — or held in mock mode until credentials are live.

---

## 📁 Project Structure

```
hakiki-health/
├── .env
├── .gitignore
├── backend/
│   ├── main.py                   ← FastAPI app, all routes
│   ├── config.py                 ← env var loader (mock vs. live mode)
│   ├── requirements.txt
│   ├── data/
│   │   └── mock_claims.py        ← 5 realistic SHA claims
│   ├── validation/
│   │   ├── rules.py               ← 7 rule functions
│   │   └── engine.py              ← runs rules, computes score
│   ├── fhir/
│   │   ├── client.py              ← openIMIS FHIR HTTP client
│   │   └── builder.py             ← builds ClaimResponse resource
│   ├── llm/
│   │   └── explainer.py           ← Claude plain-English explanations
│   └── tests/
│       └── test_validation.py
└── frontend/
    ├── package.json
    └── src/
        ├── App.jsx
        ├── api/client.js
        └── components/
            ├── ClaimList.jsx
            ├── ValidationPanel.jsx
            ├── ScoreGauge.jsx
            ├── ErrorCard.jsx
            └── StatusBadge.jsx
```

---

## ⚡ Getting Started

### Prerequisites

- Python 3.10+
- Node.js v18+
- An Anthropic API key (for plain-English explanations — optional, falls back gracefully)
- Access to a local openIMIS Docker stack (optional — the app runs entirely on mock data without it)

### Installation & Local Setup

**1. Clone and enter the project**

```bash
git clone https://github.com/Aisha-Barasa/hakiki.git
cd hakiki
```

**2. Configure environment variables**

Create a `.env` file at the project root:

```env
OPENIMIS_URL=https://localhost
OPENIMIS_TOKEN=            # leave blank to run on mock data
ANTHROPIC_API_KEY=your_key_here
DEBUG=true
```

**3. Set up the backend**

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
pytest tests/ -v              # 13 tests should pass
uvicorn main:app --reload --port 8001
```

**4. Set up the frontend**

```bash
cd frontend
npm install
npm run dev
```

**5. Verify the services**

| Service | URL |
|---|---|
| Validation API | `http://localhost:8001` |
| Dashboard UI | `http://localhost:5173` |

```bash
curl http://localhost:8001/
# {"service": "Hakiki Health", "status": "running", "mode": "mock", ...}
```

---

## 🧠 The Validation Engine

Hakiki Health scores claims using **seven transparent, deterministic rules** — no training data, no drift, no model to retrain when SHA policy changes. Just code you can read in five minutes.

| Rule | Checks | Severity |
|---|---|---|
| Required Fields | Patient ID, facility code, visit date, diagnosis code present | 🔴 Error |
| ICD-10 Format | Diagnosis code matches valid ICD-10 structure | 🔴 Error |
| Visit Date | Not malformed, not in the future | 🔴 Error |
| Items Present | At least one item with a valid service code and quantity | 🔴 Error |
| Coverage Active | Patient's SHA coverage hadn't expired on the visit date | 🔴 Error |
| Amount Match | Claimed total within 5% of the line-item sum | 🟡 Warning |
| Amount Reasonable | Claimed total under facility/maternity thresholds | 🟡 Warning |

Scores translate into three tiers:

- 🟢 **85–100 — Ready for Submission**
- 🟡 **60–84 — Needs Review**
- 🔴 **0–59 — High Risk, Errors Found**

---

## 🎯 Hackathon Track Focus

Hakiki Health was built for the **openIMIS Hackathon — Track 3 (Claims Management)**. By optimizing point-of-entry accuracy instead of chasing rejections after the fact, it targets the evaluation criteria around interoperability (FHIR R4), administrative cost reduction, and system reliability — with a validation core simple enough to demo, test, and trust on stage.

---

## 🗺️ Roadmap

- [ ] Full FHIR `Bundle` parser for live openIMIS claim ingestion
- [ ] Facility-level analytics on common rejection causes
- [ ] Coverage lookups via the openIMIS `Coverage` FHIR endpoint
- [ ] Responsible AI section documenting Claude's role (explanation only — never adjudication)
