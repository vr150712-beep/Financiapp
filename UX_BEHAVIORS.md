# Finanzas — UX Behaviors & Edge Cases
> Claude Code must implement every behavior listed here exactly. These are validated and expected.

---

## Keyboard Types (mobile-first)

Every input must declare the correct inputMode. No exceptions.

```tsx
// Amount fields
<input inputMode="decimal" pattern="[0-9]*" />   // Monto total, Mi parte, Valor proyecto

// Integer fields  
<input inputMode="numeric" pattern="[0-9]*" />   // Meses del proyecto

// Text fields
<input inputMode="text" />                        // Nombre gasto, Nombre fuente, Nombre proyecto
```

| Field | inputMode | Notes |
|-------|-----------|-------|
| Monto total | `decimal` | Allows comma/period for cents |
| Mi parte (shared) | `decimal` | Same |
| Valor estimado (project) | `decimal` | Same |
| Meses | `numeric` | Integers only |
| Nombre del gasto | `text` | Full keyboard |
| Nombre fuente de ingreso | `text` | Full keyboard |
| Nombre del proyecto | `text` | Full keyboard |

---

## Input Validation (Zod — inline, real-time)

### Amount fields
- Reject non-numeric characters on input (filter in onChange)
- Do not accept: negative numbers, zero, NaN, empty string
- Maximum: 100,000,000
- Show error inline below field — never alert() or console
- Error clears immediately when user corrects the value

```typescript
const AmountSchema = z.number({
  invalid_type_error: 'Ingresa un monto válido',
}).positive('El monto debe ser mayor a 0')
  .max(100_000_000, 'Monto fuera de rango')
```

### Label / name fields
- Minimum 2 characters (trimmed)
- Maximum 50 characters
- Trim whitespace on submit, not on type
- Error: "Mínimo 2 caracteres"

```typescript
const LabelSchema = z.string()
  .min(2, 'Mínimo 2 caracteres')
  .max(50, 'Máximo 50 caracteres')
  .trim()
```

### Mi parte (shared expense)
- Must be > 0
- Must be ≤ monto total
- If monto total is empty, disable this field
- Error: "Tu parte no puede superar el total"
- Suggestion chip updates in real-time as user types

### Meses (project)
- Integer only — strip decimals silently
- Minimum 1, maximum 120
- Error: "Entre 1 y 120 meses"

### Income source amount
- Same rules as amount fields
- Error clears when corrected

---

## Real-time Behaviors

### Proportional suggestion (shared expense sheet)
- Recalculates on every keystroke in monto total field
- Recalculates on every keystroke in mi parte field
- Formula: `suggested = amount × splitRatio(activeProfile)`
- Shows diff: "pagas $X más / menos de lo proporcional" or "justo proporcional"
- Suggestion chip hidden if monto total is empty or zero

### Wellness recalculation
- Triggers immediately after: add expense, delete expense, edit income source
- All widgets on Home re-render with new values instantly
- No loading state needed — calculation is synchronous

### Income pill update
- Updates immediately when income source is added or removed
- Pill transitions from empty→filled state with Motion animation if first source is added
- Pill transitions from filled→empty if last source is removed

### Project preview
- Shows monthly split preview in real-time while filling form
- Appears only when both `amount > 0` AND `months > 0`
- Disappears if either field is cleared

---

## UI States

### Income pill
```
Empty:  dashed border · "• Añade tus ingresos" · color emerald-t
Filled: solid border  · "• $X.XXX.XXX / mes ▾" · dot emerald
Transition: Motion spring when switching between states
```

### Wellness widget (Home)
```
No income configured:
  → Show EmptyState component
  → Dashed border, emerald tint
  → Icon + "¿Cuánto ganas al mes, [name]?" 
  → CTA button "Añade tus ingresos" → opens IncomeSheet
  → Other widgets still render (equity, casa, etc.)

Income configured:
  → Show ring + hero amount + stat rows
  → Color: >40% emerald · 20–40% amber · <20% coral
```

### Expense list (Gastos)
```
Has expenses:     → render list with category filter chips
Empty (no filter): → EmptyState: "Sin gastos este mes" + CTA to add
Empty (filtered):  → "Sin gastos en [categoría]" — no CTA, just text
```

### Shared view (Compartidos)
```
Has shared expenses: → render summary + detail list
Empty:               → EmptyState: "Sin gastos compartidos" + message
FAB:                 → HIDDEN on this view (read-only)
```

### Projects view
```
Has projects: → render project cards
Empty:        → EmptyState: icon + "Sin proyectos aún" + "Toca + para crear uno"
```

### Profile switcher
```
Switching profiles:
  → All views recalculate immediately for new active profile
  → Pill updates to show new profile's income
  → Category filter resets to "Todas"
  → Scroll position resets to top
```

---

## Toast Feedback (Sonner)

Every destructive or creative action triggers a toast. No silent actions.

```typescript
// Success toasts
toast.success('Gasto registrado')
toast.success('Proyecto creado')
toast.success('Ingreso guardado')
toast.success('Fuente de ingreso eliminada')

// Undo toast (delete actions)
toast('Gasto eliminado', {
  action: { label: 'Deshacer', onClick: () => restoreExpense(id) }
})

// Error toast (network/store failures only — not validation)
toast.error('Algo salió mal. Intenta de nuevo.')
```

Toast rules:
- Position: top-center
- Duration: 3000ms standard, 5000ms for undo actions
- Never show validation errors as toasts — those go inline below inputs

---

## Sheet Behaviors (Vaul)

### All sheets
- Drag to dismiss: enabled
- Backdrop: rgba(0,0,0,0.55)
- Spring: stiffness 300, damping 30
- On open: reset all fields to empty (except pre-filled context)
- On close: clear all validation errors

### Expense sheet
- Pre-fill type based on active tab:
  - From Gastos tab → personal pre-selected
  - From Compartidos tab → compartido pre-selected (but FAB is hidden there)
- Pre-fill ownerId with activeProfile
- Shared toggle OFF by default
- Mi parte field hidden until shared toggle is ON
- Suggestion chip hidden until monto > 0

### Income sheet
- Opens from pill tap (any tab)
- Lists existing sources with delete (×) button
- Add source form always visible at bottom
- "Listo" button closes sheet — no save needed (auto-saves on add)
- Total updates in real-time as sources are added/removed

### Project sheet
- Preview card appears in real-time (see above)
- On submit: animate new card into ProjectsView list

---

## Interaction Micro-behaviors

### Button press
```
scale(0.97) + opacity(0.8) on active/press
Transition: 100ms ease-out
```

### Hover (for web/desktop fallback)
```
opacity: 0.75
background: rgba(255,255,255,0.04)
```

### Focus ring
```
outline: 1.5px solid #1D9E75
outline-offset: 2px
```

### Disabled state
```
opacity: 0.35
pointer-events: none
cursor: not-allowed
```

### Delete (×) button on expense/source rows
```
Visible always on touch devices
Tap → immediate removal from store → undo toast
No confirmation dialog — undo toast is the safety net
```

### Category filter chips
```
Horizontal scroll, no wrap
Snap scroll on mobile
Selecting a chip → instant filter, no loading
"Todas" always first, resets filter
```

---

## Data Persistence

```typescript
// Zustand persist middleware — localStorage
// Key: 'finanzas-store'
// Persists: profiles (with sources), expenses, projects
// Does NOT persist: activeProfile, activeTab, UI state
```

On first load with no data:
- Both profiles have empty sources array
- Both profiles show EmptyState on wellness widget
- Expenses and projects arrays are empty
- App is fully functional — no onboarding gate

---

## Accessibility

```
All interactive elements: minimum 44×44px touch target
Bottom nav items: min 44px height
FAB: 52px circle
Inputs: min 44px height
Color is never the only indicator — always paired with text or icon
```
