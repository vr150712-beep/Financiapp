# Finance Tracker — Architecture, Spec & Design System
> Private SaaS for Víctor & Camila · Built for Claude Code

---

## Vision

Un "SaaS privado" para dos perfiles (Víctor + Camila) que mapea el flujo mensual de dinero — personal y compartido — y calcula una métrica real de bienestar financiero por persona. No es un ledger. Sin fechas, sin estados de pago. Mapeo estático de flujo mensual.

---

## Producto — Decisiones clave

### Modelo de gastos compartidos (Modelo B)
Un gasto compartido no pertenece a ningún perfil — pertenece a la casa. Cada quien registra cuánto puso de ese gasto desde su propio perfil. El sistema no duplica: el gasto vive una sola vez, con `myPart` y `otherPart`.

- `ownerId` → quién registró el gasto
- `myPart` → cuánto pone el registrador
- `otherPart` → el resto (calculado: `amount - myPart`)
- Al registrar un gasto compartido, el sistema sugiere la parte proporcional basada en ingresos pero permite entrada manual

### Split proporcional al ingreso
No 50/50. La proporción de casa se calcula:
```
victor_ratio  = victor_income / (victor_income + partner_income)
partner_ratio = 1 - victor_ratio
```

### Fórmula de bienestar
```
income        = sum(sources[].amount)
sharedBurden  = sum(shared_expenses × myPart or otherPart)
totalBurden   = personal_expenses + sharedBurden
remaining     = income - totalBurden
wellness_pct  = remaining / income × 100
savings_gap   = remaining - target_savings
```

---

## Navegación

**4 tabs (bottom nav):**
- **Inicio** — widgets modulares del perfil activo
- **Gastos** — lista del perfil activo, filtrable por categoría, FAB para agregar
- **Compartidos** — vista de solo lectura, agregación automática de ambos perfiles
- **Proyectos** — planeador de metas de pareja

**Header:**
- Nombre de la tab activa (izquierda)
- Profile switcher con dropdown (derecha) → cambia el perfil activo globalmente
- Desde el dropdown: acceso a Configuración

**Pill flotante (top center, siempre visible):**
- Estado vacío: `+ Añade tus ingresos` (verde sutil, borde dashed)
- Estado con datos: `$5.200.000 / mes` (filled, punto verde)
- Al tocar: bottom sheet de fuentes de ingreso
- Persiste en todas las tabs

**FAB (+):**
- Fijo sobre el bottom nav, derecha
- En tab Gastos: abre sheet de nuevo gasto
- En tab Proyectos: abre sheet de nuevo proyecto
- En tab Compartidos: oculto (solo lectura)

---

## Ingresos

Cada perfil tiene una lista de fuentes de ingreso:
```typescript
type IncomeSource = {
  id: string
  name: string      // "Salario", "Freelance", "Arriendo recibido"
  amount: number    // fijo mensual, editable
}
```
- El ingreso del perfil = `sum(sources[].amount)`
- Las fuentes son fijas cada mes pero editables
- La pill muestra el total del perfil activo

---

## Data Schema (Zod)

```typescript
// profile.schema.ts
const ProfileSchema = z.object({
  id:      z.enum(['victor', 'partner']),
  name:    z.string().min(2),
  savings: z.number().nonnegative(),
  color:   z.string(),
  sources: z.array(IncomeSourceSchema),
});

// income-source.schema.ts
const IncomeSourceSchema = z.object({
  id:     z.string().uuid(),
  name:   z.string().min(2).max(50),
  amount: z.number().positive().max(100_000_000),
});

// expense.schema.ts
const ExpenseSchema = z.object({
  id:        z.string().uuid(),
  ownerId:   z.enum(['victor', 'partner']),
  label:     z.string().min(2).max(50),
  amount:    z.number().positive().max(100_000_000),
  category:  CategoryEnum,
  shared:    z.boolean(),
  myPart:    z.number().nonnegative(),
  otherPart: z.number().nonnegative(),
});

// project.schema.ts
const ProjectSchema = z.object({
  id:     z.string().uuid(),
  label:  z.string().min(2).max(80),
  amount: z.number().positive(),
  months: z.number().int().min(1).max(120),
  note:   z.string().max(200).optional(),
});
```

---

## Categorías

```typescript
const CATEGORIES = {
  vivienda:        { label: 'Vivienda',         icon: '🏠' },
  alimentacion:    { label: 'Alimentación',      icon: '🍽️' },
  transporte:      { label: 'Transporte',        icon: '🚌' },
  salud:           { label: 'Salud',             icon: '💊' },
  entretenimiento: { label: 'Entretenimiento',   icon: '🎮' },
  suscripciones:   { label: 'Suscripciones',     icon: '📱' },
  otros:           { label: 'Otros',             icon: '📦' },
}
```

---

## Widgets de Inicio

| Widget | Descripción | Requiere ingresos |
|--------|-------------|-------------------|
| Bienestar | Ring SVG + desglose de carga | Sí → empty state CTA |
| Meta de ahorro | Bar + % completado | Sí |
| Mayor gasto | Categoría top + monto | No |
| Distribución | Barra apilada por categoría | No |
| Equidad | Barra bicolor V vs C | No |
| Casa compartida | Total + split por persona | No |
| Último gasto | Card del gasto más reciente | No |

**Empty state de bienestar** (sin ingresos configurados):
- Widget con borde dashed
- Ícono + título contextual + descripción + CTA "Añade tus ingresos"
- Redirige a la pill / income sheet

---

## Proyectos de pareja

```
Nombre + Valor estimado + Meses → Cálculo automático

victor_monthly  = amount × victor_ratio / months
partner_monthly = amount × partner_ratio / months
```

- Cualquiera de los dos puede crear proyectos
- Son de pareja por definición
- Solo planeador, sin tracking de aportes (v2)
- Preview en tiempo real mientras se llena el form

---

## Folder Structure

```
finance-tracker/
├── src/
│   ├── core/                          # Zero React imports — pure TS
│   │   ├── schemas/
│   │   │   ├── profile.schema.ts
│   │   │   ├── income-source.schema.ts
│   │   │   ├── expense.schema.ts
│   │   │   └── project.schema.ts
│   │   ├── calculations/
│   │   │   ├── wellness.calc.ts
│   │   │   ├── split.calc.ts
│   │   │   └── equity.calc.ts
│   │   └── constants/
│   │       └── categories.ts
│   │
│   ├── store/                         # Zustand
│   │   ├── profiles.store.ts
│   │   ├── expenses.store.ts
│   │   ├── projects.store.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useWellness.ts
│   │   ├── useFilteredExpenses.ts
│   │   ├── useSplitRatio.ts
│   │   └── useEquity.ts
│   │
│   ├── components/
│   │   ├── ui/                        # Design system atoms
│   │   │   ├── IncomePill/
│   │   │   ├── WellnessRing/
│   │   │   ├── StackedBar/
│   │   │   ├── EquityBar/
│   │   │   ├── BottomSheet/
│   │   │   ├── FAB/
│   │   │   └── EmptyState/
│   │   ├── widgets/
│   │   │   ├── WellnessWidget/
│   │   │   ├── SavingsWidget/
│   │   │   ├── DistributionWidget/
│   │   │   ├── EquityWidget/
│   │   │   ├── HouseWidget/
│   │   │   └── LastExpenseWidget/
│   │   ├── sheets/
│   │   │   ├── IncomeSheet/
│   │   │   ├── ExpenseSheet/
│   │   │   ├── ProjectSheet/
│   │   │   └── SettingsSheet/
│   │   └── navigation/
│   │       ├── Header/
│   │       ├── ProfileSwitcher/
│   │       └── BottomNav/
│   │
│   ├── views/
│   │   ├── HomeView/
│   │   ├── ExpensesView/
│   │   ├── SharedView/
│   │   └── ProjectsView/
│   │
│   └── app/
│       ├── App.tsx
│       └── providers.tsx
│
└── package.json
```

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| State | Zustand 5 + persist | Sin boilerplate, localStorage gratis |
| Validation | Zod 3 | Runtime safety + TS inference |
| Styling | Tailwind CSS 4 | Utility-first |
| Animation | Motion (Framer) | Micro-interactions |
| Testing | Vitest + RTL | Rápido, ESM nativo |
| Router | TanStack Router | Type-safe |

---

## Design System — Dirección

### Estética: Luxury Minimal
Inspirado en Copilot Money, Monarch, Mercury Bank. Tipografía editorial con peso, espaciado generoso, color como información no decoración.

### Tokens de diseño
```
Typeface display:  Instrument Serif o Editorial New (números grandes)
Typeface UI:       Geist o DM Sans (interfaces)
Radius:            4px inputs · 12px cards · 16px sheets · 999px pills
Spacing:           Base 4px, escala ×2
Motion:            spring(stiffness: 300, damping: 30)
Shadow:            Ninguna — bordes 0.5px como separación
```

### Paleta semántica
```
Emerald:  #1D9E75  — bienestar positivo, ahorro, ok
Amber:    #BA7517  — alerta moderada
Coral:    #D85A30  — alerta crítica, sobregasto
Blue:     #378ADD  — Víctor (identidad)
Pink:     #D4537E  — Camila (identidad)
```

### Componentes clave del design system
- `IncomePill` — transición animada vacío → filled
- `WellnessRing` — SVG con stroke-dasharray animado, color semafórico
- `StackedBar` — distribución horizontal por categoría
- `EquityBar` — bicolor con línea de centro fija
- `BottomSheet` — handle + spring + backdrop blur
- `EmptyState` — dashed border, ícono, CTA contextual
- `SuggestionChip` — tooltip de proporción en gastos compartidos

---

## Plan de diseño — Fases

### Fase 1: Design System (tokens + átomos)
Definir tipografía, color, espaciado, radio, motion. Construir los átomos: botones, inputs, pills, badges, rings, bars.

### Fase 2: Componentes compuestos
WellnessWidget, EquityBar, IncomePill en sus dos estados, BottomSheet con animación.

### Fase 3: Pantallas completas
- Home — layout de widgets
- Gastos — lista + filtros + empty state
- Compartidos — vista consolidada
- Proyectos — cards + planeador

### Fase 4: Flujos interactivos
- Agregar gasto con toggle compartido + sugerencia proporcional
- Gestionar fuentes de ingreso
- Crear proyecto con preview en tiempo real
- Profile switcher con cambio de contexto

---

## Bootstrap Claude Code

```bash
npm create vite@latest finance-tracker -- --template react-ts
cd finance-tracker
npm install zustand zod @tanstack/react-router motion
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react
```

---

## Decisions Log

| Decisión | Rationale |
|----------|-----------|
| Modelo B para compartidos | Sin duplicación, una fuente de verdad |
| Split proporcional (no 50/50) | Equidad real basada en capacidad económica |
| Sugerencia proporcional + entrada manual | Control + inteligencia sin rigidez |
| Ingresos como lista de fuentes | Refleja realidad de ingresos múltiples |
| Pill persistente para ingresos | Mayor frecuencia de uso que settings |
| Compartidos = solo lectura | Evita conflictos de edición entre perfiles |
| Proyectos = planeador sin tracking | Reduce complejidad de v1 |
| localStorage first | Zero infra para v1, Supabase en v2 |
| `core/` sin imports de React | 100% testeable sin DOM |

---

## Backlog v2

- Concepto de mes activo + "Cerrar mes"
- Resumen comparativo mes anterior
- Notas en proyectos
- Supabase sync entre dispositivos
- Categorías personalizadas
- Tracking de aportes en proyectos
