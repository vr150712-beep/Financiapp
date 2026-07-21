# Financiapp — Project Context

> Paste this file into a new Claude chat to give it full context on this project without needing repo access.

---

## What this is

A private, two-person finance tracker PWA for Víctor and Camila. It is **not a ledger** — there are no dates, no payment states. It's a static monthly snapshot of cash flow (personal + shared) that computes a "wellness" score per person: how much of your income is left after your personal and shared burden.

Data syncs across devices via Supabase (see `supabase/schema.sql`), gated by a shared PIN (`src/components/PinGate.tsx`).

### Core product decisions

- **Shared expenses (Model B)**: a shared expense doesn't belong to a profile, it belongs to the household. It's stored once — `ownerId` (who logged it), `myPart`, `otherPart` (`amount - myPart`). No duplication across profiles.
- **Proportional split, not 50/50**: `victor_ratio = victor_income / (victor_income + partner_income)`. Shared costs are supposed to split by earning power, not evenly.
- **Wellness formula**: `remaining = income - (personal_expenses + shared_expenses × myPart_or_otherPart)`; `wellness_pct = remaining / income × 100`.
- **Income as a list of sources** per profile (salary, freelance, etc.), summed for total monthly income.
- **localStorage-first** — Zustand + persist middleware, no backend yet (Supabase planned for v2).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 6 + TypeScript |
| State | Zustand 5 + persist (localStorage, key `finanzas-store`) |
| Validation | Zod 3 |
| Styling | Tailwind CSS 4, dark "Obsidiana Cálida" palette (warm black bg, emerald/amber/coral semantic colors, blue=Víctor, pink=Camila) |
| Animation | Motion (Framer) |
| Sheets | Vaul (bottom sheets) |
| Toasts | Sonner |
| Router | TanStack Router (declared, lightly used — nav is currently hand-rolled tab state in `App.tsx`) |
| Testing | Vitest + RTL (scaffolded, not verified populated) |
| Deploy | Vercel (`vercel.json` present) |

## Current navigation (as actually shipped)

4 bottom-nav tabs, defined in `src/app/tabs.ts` and switched in `src/App.tsx`:

**Inicio · Gastos · Metas · Perfil**

This differs from the original architecture spec (`finance-tracker-architecture.md`), which described **Inicio · Gastos · Compartidos · Proyectos** with a global persistent income "pill" and profile-switcher dropdown. The nav was restructured at some point but the restructuring was left incomplete — see `UX_AUDIT.md` for specifics.

## Folder structure

```
src/
├── core/            # zero React imports — schemas (Zod), calculations (wellness/split/equity), categories
├── store/           # Zustand stores: profiles, expenses, projects
├── hooks/           # useWellness, useFilteredExpenses, useSplitRatio, useEquity, useKeyboardHeight, useGreeting
├── components/
│   ├── ui/          # IncomePill, WellnessRing, StackedBar, EquityBar, Badge, EmptyState, FAB
│   ├── widgets/      # WellnessWidget, DistributionWidget, EquityWidget*, HouseWidget*
│   ├── sheets/       # ExpenseSheet, IncomeSheet, ProjectSheet, SettingsSheet
│   └── navigation/   # Header, BottomNav, ProfileSwitcher*
├── views/            # HomeView, ExpensesView*, AllExpensesView, SharedView*, ProjectsView, ProfileView*, ProfileSettingsView
└── app/tabs.ts
```
`*` = currently **not wired into the live app** (orphaned from the nav restructuring). Full detail in `UX_AUDIT.md`.

## Reference docs already in the repo

- `finance-tracker-architecture.md` — original product spec, data schemas, folder plan, decisions log, v2 backlog
- `DESIGN_SYSTEM.md` — typography, color tokens, spacing, component specs (single source of truth for visual design, though partially stale re: Vaul's actual animation API — see audit)
- `UX_BEHAVIORS.md` — intended interaction/validation/edge-case behavior, written as a spec for Claude Code to implement exactly

## Known issues

A three-part codebase audit (navigation, bottom sheets/scrolling, view-layer consistency) was just completed against the current implementation — see **`UX_AUDIT.md`** in this same folder for the full findings and suggested fixes. Headline items: several built screens/widgets are dead code from an incomplete nav restructuring, the live "Gastos" tab behaves differently from what the architecture doc promises, and the bottom-sheet scrolling bugs have an identified root cause (two competing keyboard-avoidance systems).
