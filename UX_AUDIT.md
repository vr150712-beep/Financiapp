# UX Audit — Navigation, Bottom Sheets & View Consistency

> First-pass audit of the live implementation vs. its own spec docs (`finance-tracker-architecture.md`, `UX_BEHAVIORS.md`, `DESIGN_SYSTEM.md`). Findings are grouped by theme; each includes the file:line, the user-facing symptom, and a suggested fix. Generated 2026-07-20 against the current checkout.

---

## TL;DR

The app drifted from its own spec during a nav restructuring that was never finished. Several fully-built screens and widgets (`SharedView`, `ProfileView`, `EquityWidget`, `HouseWidget`, `ProfileSwitcher`, `IncomePill`) are **dead code** — not imported anywhere — while the tab that *is* live for "Gastos" (`AllExpensesView`) behaves differently from what the architecture doc describes for that tab. Separately, the reported bottom-sheet scrolling bugs have an identifiable root cause: **two independent keyboard-avoidance systems fighting each other** on three of the four sheets, while the fourth sheet (`SettingsSheet`) has no keyboard handling at all.

---

## A. Navigation & Routing

**Root cause:** `src/app/tabs.ts` is just a bare type (`'home' | 'expenses' | 'goals' | 'profile'`) with no per-tab metadata. Every piece of tab-dependent behavior — title, FAB visibility, profile-switcher visibility, which view renders — is reimplemented by hand in `App.tsx`, `Header.tsx`, and `BottomNav.tsx` separately, so they've drifted from each other and from the spec.

1. **"Compartidos" was cut from the tab bar but its screen still exists, fully built, unreachable.**
   `src/app/tabs.ts:1` / `src/components/navigation/BottomNav.tsx:10-15` define `home / expenses / goals / profile` — "Perfil" replaces the spec's "Compartidos". `src/views/SharedView.tsx` (the read-only shared-expenses aggregation view from `UX_BEHAVIORS.md:136-141`) is never imported anywhere.
   → *Fix*: decide if Compartidos is coming back. If yes, wire `SharedView` into a tab. If no, delete it rather than leave it to rot.

2. **Two profile switchers exist; the one actually used isn't global.**
   `src/components/navigation/ProfileSwitcher.tsx` matches the spec (global dropdown, all tabs, `finance-tracker-architecture.md:49-52`) but is never rendered. `src/App.tsx` instead uses `Header.tsx`'s inline switcher, gated by `isHome` (`Header.tsx:31,62`) — **only visible on the Inicio tab**. Switching to Gastos/Metas/Perfil, you lose the ability to change active profile from the header.
   → *Fix*: either promote `Header`'s switcher to render on every tab, or swap in `ProfileSwitcher.tsx` globally and delete the duplicate.

3. **The spec's persistent income "pill" is built but never rendered.**
   `src/components/ui/IncomePill.tsx` exists, matches `DESIGN_SYSTEM.md`'s two-state (empty/filled) spec, but has zero usages in `src/`. The always-visible income summary described in `UX_BEHAVIORS.md:149-156` doesn't exist in the running app.
   → *Fix*: mount it in `App.tsx`'s shared header/shell, or remove it if the product direction has moved away from this pattern.

4. **`ProfileView.tsx` is dead code, near-duplicate of `HomeView.tsx`.**
   Structurally identical (same widgets + `ExpensesView` composition) but never imported — `App.tsx` routes the `profile` tab to `ProfileSettingsView` instead. Confusing to have both names present.
   → *Fix*: delete `ProfileView.tsx` unless there's a plan to differentiate it from Home.

5. **"Gastos" tab doesn't do what the architecture doc says "Gastos" does.**
   Spec (`finance-tracker-architecture.md:45`): "Gastos — lista del perfil activo, filtrable por categoría." Actual: `App.tsx:95-97` wires the `expenses` tab to `AllExpensesView.tsx`, which shows **all profiles'** expenses, filterable by **owner/shared**, not by category. The view that actually matches the spec (`ExpensesView.tsx`, category filter, single active profile) is nested inside the dead `HomeView`/`ProfileView` instead of wired to the Gastos tab.
   → *Fix*: this is the most user-visible one — clarify intended behavior (per-profile category list vs. all-profiles owner list) and wire the correct view to the Gastos tab; don't maintain both indefinitely.

6. **No real scroll-position reset or filter-reset on profile switch.**
   Spec requires both (`UX_BEHAVIORS.md:149-156`). No `scrollTo`/`scrollTop` reset exists anywhere in the codebase. Category-filter "reset" only happens as an accidental side effect of `App.tsx:82`'s `key={tab + activeProfileId}` remounting `ExpensesView` — which doesn't even apply to the live `AllExpensesView` (its filter isn't profile-scoped at all per #5).
   → *Fix*: add an explicit scroll-to-top effect on tab/profile change; don't rely on incidental remounts.

7. **FAB visibility/branch logic has dead duplicate code.**
   `App.tsx:45-57`'s `handleFAB` has an `expenses` branch and a fallback branch that are byte-identical — copy-paste never consolidated. FAB hide condition is a single hardcoded `tab !== 'profile'` check (`App.tsx:114`) rather than driven by tab config.
   → *Fix*: once a tab-config table exists (see below), FAB visibility/action becomes a lookup, not a branch tree.

**Suggested structural fix for the whole section:** introduce one declarative table — `{ id, label, icon, headerTitle, showFab, showProfileSwitcher, view }` — consumed by `BottomNav`, `Header`, and `App.tsx`. This removes the three-hand-synced-switch-statement pattern that produced findings 1–7.

---

## B. Bottom Sheets, Scrolling & Keyboard — likely cause of the reported bugs

**Root cause:** Vaul's `Drawer.Root` already auto-repositions inputs when the keyboard opens (`repositionInputs: true` is the library default). Three of the four sheets *also* run a custom `useKeyboardHeight` hook that independently recomputes `bottom`/`maxHeight` on every `visualViewport` resize event — and two of them *also* manually `scrollIntoView` 320ms after focus. None of this is coordinated with Vaul's native behavior (`repositionInputs` is never set to `false` anywhere). Result: on focusing an input, the sheet can double-shift, then settle again ~320ms later — a very plausible match for "janky scrolling."

1. **Duplicate keyboard-avoidance systems fighting each other.**
   `ExpenseSheet.tsx:153`, `IncomeSheet.tsx:78`, `ProjectSheet.tsx:69` all set `style={{ bottom: kbH, transition: 'bottom 0.25s ease-out' }}` via the custom hook, on top of Vaul's own repositioning.
   → *Fix*: pick one system. Recommend disabling Vaul's `repositionInputs` explicitly and keeping the custom hook (more control), or removing the custom hook and leaning on Vaul (less code) — not both.

2. **`SettingsSheet.tsx` has none of this — inputs can end up unreachable behind the keyboard.**
   No `useKeyboardHeight` import, no `kbH`, no `overflow-y-auto`/`maxHeight` on its content div, unlike the other three sheets.
   → *Fix*: bring it in line with whichever pattern is chosen in #1.

3. **`onFocus` scroll-into-view is only implemented in half the sheets.**
   Present in `ExpenseSheet.tsx:142-145` (used at 187, 237, 275) and `ProjectSheet.tsx:25-28` (used at 87, 103, 118). Absent in `IncomeSheet.tsx` and `SettingsSheet.tsx` entirely.
   → *Fix*: extract into a shared hook/util used by all sheets that need it, once the keyboard strategy is unified.

4. **Arbitrary drift in maxHeight ratio and corner radius.**
   `ExpenseSheet.tsx:158`: `calc(92dvh - kbH)`; `IncomeSheet.tsx:83` / `ProjectSheet.tsx:73`: `calc(88dvh - kbH)`; `SettingsSheet.tsx`: none. Corner radius: `ExpenseSheet.tsx:152`/`IncomeSheet.tsx:77` hardcode `rounded-t-[16px]`; `ProjectSheet.tsx:68`/`SettingsSheet.tsx:35` use token classes (`rounded-sheet rounded-b-none`).
   → *Fix*: pull both into one design-token constant, use it in all four sheets.

5. **Field-reset-on-open spec requirement not met everywhere.**
   `ExpenseSheet.tsx:65-82` and `ProjectSheet.tsx:34-38` correctly reset fields on open. `IncomeSheet.tsx` has no reset effect — an abandoned half-typed "new source" entry persists across close/reopen. `SettingsSheet.tsx:17-20` seeds state once from the store with no resync — unsaved edits typed then dismissed via the X persist stale on reopen instead of reflecting the store.
   → *Fix*: add the same open-reset `useEffect` pattern to both sheets.

6. **No `env(safe-area-inset-bottom)` handling anywhere** — all four sheets use a fixed `pb-8` (32px), which can under/over-pad on devices with a home indicator, compounding the jump from #1.

7. **The spec itself over-promises** — `UX_BEHAVIORS.md:192` / `DESIGN_SYSTEM.md:176` specify "spring: stiffness 300, damping 30" for sheet motion, but Vaul v1.1.2 has no spring-physics API; it uses fixed CSS transitions. Worth updating the doc rather than chasing an unimplementable spec.

---

## C. View-Layer Consistency

1. **Bespoke empty states instead of the shared `EmptyState` component.**
   `WellnessWidget.tsx:18-58` and `DistributionWidget.tsx:26-42` both hand-roll their own empty/ghost states rather than using `EmptyState.tsx`, despite `UX_BEHAVIORS.md:115-122` explicitly requiring the shared component for the wellness case. This is the single most-seen screen (first-run Home) not benefiting from centralized styling.
   → *Fix*: refactor both to use `EmptyState` with custom icon/copy props.

2. **The live "Gastos" tab fails its own documented empty-state contrast.**
   Spec (`UX_BEHAVIORS.md:129-134`): no filter → CTA empty state; filtered with zero results → plain text, no CTA. `ExpensesView.tsx:55-68` implements this correctly — but it's not the view wired to the tab. `AllExpensesView.tsx:74-81` (the one that *is* live) always shows the full "add expense" CTA regardless of active filter, which is misleading when e.g. filtering to one person's expenses.
   → *Fix*: once A.5 is resolved (which view really owns "Gastos"), port this filtered/unfiltered distinction over.

3. **Duplicated, divergent shared-expense math.**
   Dead `HouseWidget.tsx:11-13` and dead `SharedView.tsx:25-30` each compute "how much of shared expenses is settled" independently and differently (one sums `myPart+otherPart`, the other branches on `ownerId`). No shared hook backs either. If one is resurrected without the other, the numbers won't agree.
   → *Fix*: if either view returns, extract the calculation into one hook (alongside `useSplitRatio`/`useEquity`) rather than inlining it twice.

4. **`useFilteredExpenses` hook exists but has zero callers.**
   `ExpensesView.tsx:27-28` reimplements the same filtering logic inline instead of calling `src/hooks/useFilteredExpenses.ts`. Any future change to filtering semantics made in the hook won't propagate.
   → *Fix*: have `ExpensesView` actually call the hook it was presumably built for.

5. **Copy/voice inconsistency between the two expense-list views' empty states.**
   `ExpensesView.tsx:60-61` / `SharedView.tsx:19`: "Toca + para registrar tu/un primer gasto." `AllExpensesView.tsx:78-79`: "Sin gastos aquí" / "Toca + para registrar un gasto." Same interaction, different phrasing.
   → *Fix*: converge on one copy pattern once the duplicate views are resolved.

6. **`Badge`'s `shared` variant exists but is bypassed twice.**
   `ExpensesView.tsx:126-136` and `AllExpensesView.tsx:138-153` both hand-roll their own "compartido" pill markup instead of using `Badge.tsx`'s existing `shared` variant (only actually used by dead `SharedView.tsx:64`). Any future color/padding token change needs to be made in three places instead of one.
   → *Fix*: swap both hand-rolled pills for `<Badge variant="shared">`.

---

## Suggested priority order

1. **Decide the "Gastos" tab's real behavior** (A.5 / C.2) — this is the one actual spec-vs-shipped behavioral bug affecting daily use, not just dead code.
2. **Fix the sheet keyboard double-repositioning** (B.1–B.3) — most likely direct cause of the scrolling bugs you noticed.
3. **Clean up dead code** (A.1, A.2, A.4, C.3) — resolve by either resurrecting or deleting `SharedView`, `ProfileView`, `EquityWidget`, `HouseWidget`, `ProfileSwitcher`, `IncomePill`.
4. **Introduce the tab-config table** (A, structural fix) — prevents this drift from recurring as the nav evolves.
5. **Converge empty states and badges on shared components** (C.1, C.6) — lower urgency, mostly a consistency/maintainability win.
