# 🏆 BEEscore — South African B-BBEE Scorecard Calculator

> A free, privacy-first, browser-based tool that calculates your company's **Broad-Based Black Economic Empowerment (B-BBEE)** compliance level across all five elements of the Generic Scorecard — in under 10 minutes, with no registration required.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

1. [What is B-BBEE?](#what-is-b-bbee)
2. [Why B-BBEE Matters](#why-b-bbee-matters)
3. [The Five Pillars Explained](#the-five-pillars-explained)
   - [Pillar 1 — Ownership (Code 100)](#pillar-1--ownership-code-100)
   - [Pillar 2 — Management Control (Code 200)](#pillar-2--management-control-code-200)
   - [Pillar 3 — Skills Development (Code 300)](#pillar-3--skills-development-code-300)
   - [Pillar 4 — Enterprise & Supplier Development (Code 400)](#pillar-4--enterprise--supplier-development-code-400)
   - [Pillar 5 — Socio-Economic Development (Code 500)](#pillar-5--socio-economic-development-code-500)
4. [Company Size Categories](#company-size-categories)
5. [How B-BBEE Levels Are Calculated](#how-b-bbee-levels-are-calculated)
   - [Points → Level Conversion](#points--level-conversion)
   - [Priority Elements & Sub-minimums](#priority-elements--sub-minimums)
   - [Automatic Levels for EME and QSE](#automatic-levels-for-eme-and-qse)
   - [Procurement Recognition Multipliers](#procurement-recognition-multipliers)
6. [About This Application](#about-this-application)
7. [Application Architecture](#application-architecture)
   - [Project Structure](#project-structure)
   - [Tech Stack](#tech-stack)
   - [Data Flow](#data-flow)
   - [Key Modules Explained](#key-modules-explained)
8. [Running Locally](#running-locally)
   - [Prerequisites](#prerequisites)
   - [Quick Start](#quick-start)
   - [Available Scripts](#available-scripts)
9. [Using the Calculator](#using-the-calculator)
10. [Scoring Formulas Reference](#scoring-formulas-reference)
11. [Important Disclaimer](#important-disclaimer)
12. [Contributing](#contributing)
13. [License](#license)

---

## What is B-BBEE?

**Broad-Based Black Economic Empowerment (B-BBEE)** is a South African government policy framework designed to redress the economic inequalities created by apartheid. Introduced under the **Broad-Based Black Economic Empowerment Act 53 of 2003** (amended by Act 46 of 2013) and governed by the **Codes of Good Practice** gazetted in 2013, B-BBEE aims to transform the South African economy by increasing the participation of Black South Africans — including African, Coloured, and Indian people who are South African citizens — in the mainstream economy.

B-BBEE is **not voluntary** for companies doing business with the South African government or state-owned enterprises (SOEs). It also has powerful indirect effects in the private sector because companies with high B-BBEE levels receive preferential procurement recognition from their customers.

### Key Legislation
| Document | Purpose |
|---|---|
| B-BBEE Act 53 of 2003 | Primary enabling legislation |
| B-BBEE Amendment Act 46 of 2013 | Strengthened enforcement, added fronting penalties |
| Amended Codes of Good Practice (2013) | Technical measurement rules for all five elements |
| Sector Codes (various) | Industry-specific variations (Mining, Construction, ICT, etc.) |

---

## Why B-BBEE Matters

Your **B-BBEE Level** directly affects your company's commercial viability:

| Scenario | Impact |
|---|---|
| Government tender scoring | Companies with Level 1–4 score higher on tender evaluation criteria |
| Procurement by large businesses | Your customers count your spend toward *their* B-BBEE scorecard |
| Access to finance | Some DFIs (IDC, NEF) require minimum B-BBEE levels for funding |
| Licensing | Certain regulated industries (mining, telecoms) require minimum levels |
| Reputational & ESG | Investors and partners increasingly scrutinise transformation credentials |

A **Level 1** company adds **135%** of any spend to a customer's scorecard. A **Non-Compliant** company contributes **0%**. This is why B-BBEE level is a real commercial differentiator.

---

## The Five Pillars Explained

The Generic Scorecard (for companies with annual turnover ≥ R50 million) is scored across **five elements** with a total of **105 base points** plus up to **11 bonus points** (116 total possible):

| Element | Code | Base Points | Bonus Points | Priority? |
|---|---|---|---|---|
| Ownership | 100 | 25 | 0 | ✅ Yes |
| Management Control | 200 | 15 | 2 | ❌ No |
| Skills Development | 300 | 20 | 5 | ✅ Yes |
| Enterprise & Supplier Dev. | 400 | 40 | 4 | ✅ Yes |
| Socio-Economic Development | 500 | 5 | 0 | ❌ No |
| **Total** | | **105** | **11** | |

---

### Pillar 1 — Ownership (Code 100)

**Maximum: 25 points | Priority Element**

Ownership measures how much of the company is owned by Black South Africans in terms of both economic interest and voting rights.

#### What is measured?

| Sub-element | Target | Max Points |
|---|---|---|
| Black Exercisable Voting Rights | 51% | 3 |
| Black Women Voting Rights | 25% | 2 |
| Black Economic Interest | 51% | 4 |
| Black Women Economic Interest | 25% | 2 |
| **Net Value** (priority sub-element) | 25% | **8** |
| Ownership Fulfillment | 51% | 4 |

#### Net Value — the most complex sub-element

Net Value represents the **actual equity value** that Black shareholders have in the business *after* accounting for any debt used to fund their shareholding. It recognises that many Black shareholders bought into businesses using loans, and those loans need to be repaid before the shareholding has real economic value.

Net Value uses a **time-graduation factor** (Annexure 100F) that increases over 10 years as loans are assumed to be paid off:

| Years Since Share Issue | Time Factor |
|---|---|
| 0 | 0% |
| 1 | 8.5% |
| 2 | 17% |
| 3 | 26% |
| 4 | 34% |
| 5 | 40% |
| 6 | 52% |
| 7 | 61% |
| 8 | 70% |
| 9 | 87% |
| 10+ | 100% |

**Sub-minimum for Ownership:** The Net Value sub-element must score at least **3.2 out of 8 points** (40%). Failure to meet this sub-minimum results in a **one-level downgrade** of the final B-BBEE score.

---

### Pillar 2 — Management Control (Code 200)

**Maximum: 15 points + 2 bonus points | NOT a Priority Element**

Management Control measures the representation of Black people (and specifically Black women) across the management hierarchy of the business.

#### What is measured?

| Management Category | Black Target | Points | Black Women Target | Points |
|---|---|---|---|---|
| Board Members | 50% | 2 | 25% | 1 |
| Executive Directors | 50% | 2 | 25% | 1 |
| Other Executive Management | 60% | 2 | 30% | 1 |
| Senior Management | 60% | 2 | 30% | 1 |
| Middle Management | 75% | 2 | 38% | 1 |
| Junior Management | 88% | 1 | 44% | 1 |
| **Bonus:** Black Disabled Employees | 2% of staff | 2 (bonus) | — | — |

The targets increase as you go down the hierarchy because, in the South African demographic context, the expectation is that frontline and junior roles should reflect the broad population more closely than top executive positions.

---

### Pillar 3 — Skills Development (Code 300)

**Maximum: 20 points + 5 bonus points | Priority Element**

Skills Development measures how much a company invests in improving the skills and qualifications of its Black employees and learners.

#### What is measured?

| Sub-element | Target | Max Points |
|---|---|---|
| Black Skills Spend (SDL leviable amount) | 6% | 8 |
| Black Disabled Skills Spend | 0.3% | 4 |
| Employed Black Learners on programmes | 2.5% of staff | 4 |
| Unemployed Black Learners (internships etc.) | 2.5% of staff | 4 |
| **Bonus:** Absorption Rate (learners absorbed into employment) | 100% | 5 |

The **leviable amount** is your total payroll cost subject to Skills Development Levy (SDL) — broadly your total remuneration bill.

**Sub-minimum for Skills Development:** Skills Development must score at least **8 out of 20 points** (40%). Failure triggers a one-level downgrade.

---

### Pillar 4 — Enterprise & Supplier Development (Code 400)

**Maximum: 40 points + 4 bonus points | Priority Element**

ESD is the highest-weighted element. It has two components:

#### Preferential Procurement (PP) — 25 points
Measures the B-BBEE quality of your supplier base.

| Sub-element | Target | Max Points |
|---|---|---|
| Total Measured Procurement Spend (all B-BBEE suppliers) | 80% | 5 |
| QSE Suppliers | 15% | 3 |
| EME Suppliers | 15% | 3 |
| Black-Owned ≥51% Suppliers | 40% | 9 |
| Black Women ≥30% Owned Suppliers | 12% | 4 |
| Designated Group Suppliers | 2% | 1 |

Supplier spend is not taken at face value — it is **multiplied by a recognition factor** based on the supplier's own B-BBEE level (see [Procurement Recognition Multipliers](#procurement-recognition-multipliers)).

#### Enterprise & Supplier Development contributions — 15 points + 4 bonus
| Sub-element | Target (% of NPAT) | Max Points |
|---|---|---|
| Supplier Development contributions | 2% | 10 |
| Enterprise Development contributions | 1% | 5 |
| **Bonus:** Graduated beneficiary | — | 1 |
| **Bonus:** Jobs created | — | 3 |

**Sub-minimum for ESD:** Each of the three sub-categories (PP, SD, ED) must individually reach **40%** of their target. Failure in any sub-category triggers a one-level downgrade.

---

### Pillar 5 — Socio-Economic Development (Code 500)

**Maximum: 5 points | NOT a Priority Element**

SED measures contributions to projects that benefit society, specifically targeting Black beneficiaries.

#### What is measured?
| Sub-element | Target | Max Points |
|---|---|---|
| SED Contributions with ≥75% Black beneficiaries | 1% of NPAT | 5 |

Contributions with 50–74% Black beneficiaries count at **50%** of face value. Contributions with fewer than 50% Black beneficiaries are **excluded entirely**.

---

## Company Size Categories

B-BBEE measurement varies significantly depending on company size:

| Category | Annual Turnover | Measurement |
|---|---|---|
| **EME** (Exempt Micro Enterprise) | < R10 million | Automatically Level 4 (or better with Black ownership — see below) |
| **QSE** (Qualifying Small Enterprise) | R10m – R50m | Simplified scorecard — counts all 5 elements but with simpler targets |
| **Generic** (Large Enterprise) | ≥ R50 million | Full Generic Scorecard — all 5 elements at full complexity |

### Automatic Levels for Small Entities

EME and QSE companies with significant Black ownership receive **automatic B-BBEE levels** without needing to complete a full scorecard:

| Company Size | Black Ownership | Automatic Level |
|---|---|---|
| EME | Any | **Level 4** |
| EME | ≥ 51% Black-owned | **Level 2** |
| EME | 100% Black-owned | **Level 1** |
| QSE | ≥ 51% Black-owned | **Level 2** |
| QSE | 100% Black-owned | **Level 1** |

---

## How B-BBEE Levels Are Calculated

### Points → Level Conversion

Once total points are tallied (including bonuses), the score is mapped to a B-BBEE level using these thresholds:

| B-BBEE Level | Minimum Points Required | Procurement Recognition |
|---|---|---|
| **Level 1** | ≥ 100 | **135%** |
| **Level 2** | ≥ 95 | **125%** |
| **Level 3** | ≥ 90 | **110%** |
| **Level 4** | ≥ 80 | **100%** |
| **Level 5** | ≥ 75 | **80%** |
| **Level 6** | ≥ 70 | **60%** |
| **Level 7** | ≥ 55 | **50%** |
| **Level 8** | ≥ 40 | **10%** |
| **Non-Compliant** | < 40 | **0%** |

### Priority Elements & Sub-minimums

Three elements are **Priority Elements**: Ownership (Net Value sub-element), Skills Development, and ESD. Each has a **sub-minimum** — a floor score below which the company receives a **one-level downgrade penalty**.

| Priority Element | Sub-minimum Threshold |
|---|---|
| Ownership — Net Value | 40% of 8 pts = **3.2 pts** |
| Skills Development | 40% of 20 pts = **8 pts** |
| ESD — each sub-category | **40%** of each sub-target |

**Example:** If your calculated score is 95 points (Level 2), but you fail the Skills Development sub-minimum, your final level is downgraded to **Level 3**.

Multiple sub-minimum failures each cause a separate downgrade. If you fail two sub-minimums, you drop two levels.

### Automatic Levels for EME and QSE

Before applying the points calculation, the system checks whether the company qualifies for an automatic level based on size and Black ownership. If it does, the automatic level **overrides** the calculated score.

### Procurement Recognition Multipliers

When your company scores its supplier base, each supplier's spend is **adjusted** by a recognition multiplier based on *their* B-BBEE level. This creates a cascading incentive throughout supply chains.

| Supplier B-BBEE Level | Recognition Multiplier |
|---|---|
| Level 1 | 135% |
| Level 2 | 125% |
| Level 3 | 110% |
| Level 4 | 100% |
| Level 5 | 80% |
| Level 6 | 60% |
| Level 7 | 50% |
| Level 8 | 10% |
| Non-Compliant | 0% |

For example, if you spend R1,000,000 with a Level 1 supplier, that counts as **R1,350,000** toward your measured procurement spend.

---

## About This Application

BEEscore is a **client-side single-page application** (SPA). Every calculation runs **entirely in your browser** — no data is ever sent to a server. This means:

- ✅ **No registration required**
- ✅ **No data stored anywhere**
- ✅ **Works offline** once loaded
- ✅ **Free to use**

The calculator guides you through a **6-step wizard**:

1. **Company Info** — turnover, NPAT, employee count, leviable amount
2. **Ownership** — Black voting rights, economic interest, equity values
3. **Management Control** — headcounts per management category
4. **Skills Development** — training spend and learner numbers
5. **Enterprise & Supplier Development** — supplier data + contributions
6. **Socio-Economic Development** — community contribution records

After completing all steps, the app instantly calculates your full scorecard and displays:
- Final B-BBEE level and procurement recognition %
- Points earned per element with detailed breakdown
- Sub-minimum compliance status for priority elements
- Level discount alerts if any sub-minimums were missed
- A printable results page for your records

---

## Application Architecture

### Project Structure

```
beescore/
├── index.html                      # App entry point (Vite SPA shell)
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript strict-mode config
├── vite.config.ts                  # Vite bundler config
└── src/
    ├── main.tsx                    # React root mount
    ├── App.tsx                     # Router + ScorecardProvider wrapper
    ├── index.css                   # Full design system (CSS custom properties)
    ├── vite-env.d.ts               # Vite environment type declarations
    │
    ├── types/
    │   └── bbbee.ts                # All TypeScript interfaces and types
    │
    ├── lib/
    │   ├── calculations.ts         # Pure scoring functions (no side effects)
    │   ├── constants.ts            # B-BBEE thresholds, targets, lookup tables
    │   ├── formatters.ts           # Currency, percentage, number formatters
    │   └── validation.ts           # Zod schemas for all form inputs
    │
    ├── context/
    │   └── ScorecardContext.tsx    # Global state (useReducer + Context API)
    │
    ├── components/
    │   ├── Layout/
    │   │   ├── Navbar.tsx          # Top navigation bar
    │   │   └── Footer.tsx          # Footer with disclaimer
    │   ├── UI/
    │   │   ├── Button.tsx          # Multi-variant button component
    │   │   ├── FormField.tsx       # Input/Select with validation display
    │   │   ├── Alert.tsx           # Info/Warning/Error/Success alerts
    │   │   ├── ProgressBar.tsx     # Animated score progress bar
    │   │   ├── Badge.tsx           # Status badge component
    │   │   └── Stepper.tsx         # Multi-step wizard progress indicator
    │   └── Calculator/
    │       ├── ScoreSidebar.tsx    # Live score preview sidebar
    │       └── steps/
    │           ├── CompanyInfoStep.tsx
    │           ├── OwnershipStep.tsx
    │           ├── ManagementStep.tsx
    │           ├── SkillsStep.tsx
    │           ├── ESDStep.tsx
    │           └── SEDStep.tsx
    │
    └── pages/
        ├── LandingPage.tsx         # Home / marketing page
        ├── CalculatorPage.tsx      # Calculator shell with stepper + sidebar
        └── ResultsPage.tsx         # Full results breakdown page
```

---

### Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI component model, declarative rendering |
| **TypeScript** | 5 (strict mode) | Type safety — `noImplicitAny`, `strictNullChecks` |
| **Vite** | 5 | Dev server + production bundler (ESM-native, fast HMR) |
| **React Router DOM** | 6 | Client-side routing (`/`, `/calculator`, `/results`) |
| **Zod** | 3 | Runtime schema validation on all form inputs |

**No external UI library** — the design system is built with pure CSS custom properties (variables) for a zero-dependency, maintainable stylesheet.

---

### Data Flow

```
User Input (Form Fields)
        │
        ▼
  Zod Validation Schema
  (validation.ts)
        │  ── invalid ──► Error messages displayed inline
        │
        ▼ valid
  dispatch({ type: 'SET_OWNERSHIP', payload: ... })
        │
        ▼
  ScorecardContext (useReducer)
  formData state updated
        │
        ├──► ScoreSidebar reads context ──► live preview recalculated
        │
        ▼  (on final step submit)
  calculateScorecard(formData)
  (calculations.ts — pure function)
        │
        ▼
  BBBEEResult object
        │
  dispatch({ type: 'SET_RESULT', payload: result })
        │
        ▼
  navigate('/results')
        │
        ▼
  ResultsPage reads result from context
  Displays full breakdown
```

---

### Key Modules Explained

#### `src/types/bbbee.ts`
All TypeScript interfaces that describe the shape of data throughout the app:
- `CompanyInfo`, `OwnershipData`, `ManagementData`, `SkillsData`, `ESDData`, `SEDData` — form data per step
- `ScorecardFormData` — composite of all the above
- `ElementScore` — result of scoring one element (earned pts, max pts, breakdown items, sub-minimum status)
- `BBBEEResult` — the final output (final level, total points, all five element scores, discount flags)
- `ScoreBreakdownItem` — a single row in the detailed breakdown table

#### `src/lib/calculations.ts`
Contains **six pure functions** — one per element plus the orchestrator:
- `deriveCompanySize(turnover)` → `'EME' | 'QSE' | 'GENERIC'`
- `calcAutoLevel(size, blackOwnershipPct)` → `number | null`
- `calcOwnership(data)` → `ElementScore`
- `calcManagement(data, totalEmployees)` → `ElementScore`
- `calcSkills(data, leviableAmount, totalEmployees)` → `ElementScore`
- `calcESD(data, npat)` → `ElementScore`
- `calcSED(data, npat)` → `ElementScore`
- `calculateScorecard(formData)` → `BBBEEResult` ← orchestrates all of the above

All functions are **pure** (same input always produces same output, no side effects), making them easy to unit test.

#### `src/lib/constants.ts`
Single source of truth for all B-BBEE numerical targets:
- `BEE_LEVEL_THRESHOLDS` — array mapping points ranges to levels and recognition %
- `NET_VALUE_TIME_FACTORS` — the Annexure 100F array `[0, 0.085, 0.17, ...]`
- `SUPPLIER_RECOGNITION` — `{ 1: 1.35, 2: 1.25, ... }`
- `COMPANY_SIZE_THRESHOLDS` — `{ EME: 10_000_000, QSE: 50_000_000 }`

#### `src/context/ScorecardContext.tsx`
Global state management using React's built-in `useReducer` + `Context` API. Exports:
- `ScorecardProvider` — wrap your app in this
- `useScorecard()` — hook to access `{ state, dispatch, goToStep }`

State shape:
```ts
{
  currentStep: number;        // 0–5 (which wizard step is active)
  formData: ScorecardFormData; // all user inputs
  result: BBBEEResult | null;  // null until final submission
}
```

#### `src/lib/validation.ts`
Zod schemas validate every form input at the step boundary — before the data enters the context. This provides both TypeScript types (via `z.infer<>`) and runtime safety against invalid numbers (NaN, negative values, out-of-range percentages).

---

## Running Locally

### Prerequisites

| Requirement | Minimum Version | Check |
|---|---|---|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | Any recent | `git --version` |
| **Python** *(only if regenerating files)* | 3.9+ | `python --version` |

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ndlovumandla/beescore.git
cd beescore

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**

The development server supports **Hot Module Replacement (HMR)** — changes to source files are reflected in the browser instantly without a full page reload.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at `http://localhost:5173` |
| `npm run build` | TypeScript type-check + production bundle → `dist/` |
| `npm run preview` | Serve the production `dist/` build locally at `http://localhost:4173` |

### Production Build

```bash
npm run build
# Output goes to dist/
# Serve with any static file server, e.g.:
npx serve dist
```

The production build is a fully static bundle — no server required. You can deploy it to:
- **GitHub Pages** (free)
- **Netlify** (free tier, just drag-and-drop the `dist/` folder)
- **Vercel** (free tier, connect your GitHub repo)
- **Azure Static Web Apps** (free tier)
- Any web server capable of serving static files

### Troubleshooting

| Problem | Solution |
|---|---|
| `node_modules` missing | Run `npm install` |
| Port 5173 already in use | Run `npm run dev -- --port 3000` |
| TypeScript errors on build | Ensure Node.js ≥ 18 and TypeScript ≥ 5 |
| Blank page after `npm run build` | Check `vite.config.ts` `base` option if deploying to a subdirectory |

---

## Using the Calculator

1. **Navigate to `/calculator`** (or click "Start Assessment" on the home page)
2. **Step 1 — Company Info**: Enter your company's annual turnover, NPAT, total employees, and leviable payroll amount. The app automatically determines whether you are EME, QSE, or Generic.
3. **Step 2 — Ownership**: Enter Black voting rights %, economic interest %, Black women %, equity values, and how many years ago the shares were issued.
4. **Step 3 — Management Control**: Enter headcounts (total, Black, Black women) per management category.
5. **Step 4 — Skills Development**: Enter your Black skills spend, disabled spend, and learner numbers.
6. **Step 5 — ESD**: Add each supplier with their B-BBEE level, spend amount, and category flags (QSE/EME, Black-owned, etc.). Enter your SD and ED contribution amounts.
7. **Step 6 — SED**: Add each SED contribution with description, amount, and percentage of Black beneficiaries.
8. **Click "Calculate Scorecard"** — the results page will show your final B-BBEE level, element breakdown, and any applicable warnings.

> 💡 **Tip:** The live score sidebar on the right updates as you type — you can see your score change in real time before submitting each step.

---

## Scoring Formulas Reference

All formulas implement the **Amended Codes of Good Practice (2013)** and use proportional scoring:

```
Points Earned = (Actual / Target) × Maximum Points
```

Points are capped at the maximum for each sub-element (you cannot score more than the maximum even if you exceed the target), except for bonus points which are awarded as discrete thresholds.

### Example Calculation

> Company A: Generic entity, turnover R200M, 51% Black-owned

**Step 1 — Check auto-level:** Generic entities don't get auto-levels regardless of Black ownership.

**Step 2 — Score each element:**
- Ownership: Black voting 51%, Economic Interest 51%, Net Value (5 years, full equity) → ~22/25 pts
- Management: 60% Black at exec level, 75% at middle → ~12/15 pts
- Skills: 6% of leviable on Black training, 2.5% learners → ~16/20 pts *(sub-min met at 8+)*
- ESD: 85% measured spend, 55% Black-owned suppliers, 2% NPAT contributions → ~35/40 pts *(all sub-mins met)*
- SED: 1.2% NPAT to 80% Black beneficiary projects → 5/5 pts

**Step 3 — Total:** 22 + 12 + 16 + 35 + 5 = **90 points → Level 3**

**Step 4 — Sub-minimum check:** All three priority elements met their 40% floor → **no downgrade**

**Final result: Level 3 — 110% procurement recognition**

---

## Important Disclaimer

> ⚠️ **This tool provides indicative B-BBEE scores based on self-reported data. It is not a substitute for a formal B-BBEE verification conducted by an accredited B-BBEE Rating Agency (BVA). For official compliance purposes — particularly government procurement, financial applications, or legal obligations — always obtain a formal B-BBEE certificate from an accredited agency. Always consult a qualified B-BBEE consultant for advice specific to your situation.**

BEEscore is provided as a free educational and planning tool. The calculations implement the Amended Codes of Good Practice to the best of the developer's understanding, but sector-specific codes, transitional provisions, and individual company circumstances may apply. The developer accepts no liability for decisions made based on scores generated by this tool.

---

## Contributing

Contributions are welcome! If you find a calculation error, missing rule, or UX improvement:

1. Fork the repository
2. Create a feature branch: `git checkout -b fix/skills-formula`
3. Make your changes with clear TypeScript (strict mode, no `any`)
4. Open a pull request with a description of what changed and why

For issues related to B-BBEE rule interpretation, please cite the relevant section of the Codes of Good Practice in your issue or PR.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Built for the South African business community.
