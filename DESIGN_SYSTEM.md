# Finanzas — Design System
> Single source of truth for Claude Code. Apply every token exactly as specified.

---

## Typography

**Font**: Inter — load via `cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/index.css`

```css
/* Numbers — financial display */
.num-hero  { font-size: 40px; font-weight: 300; letter-spacing: -0.04em; line-height: 1; }
.num-xl    { font-size: 28px; font-weight: 300; letter-spacing: -0.04em; line-height: 1; }
.num-lg    { font-size: 22px; font-weight: 300; letter-spacing: -0.03em; line-height: 1; }
.num-md    { font-size: 17px; font-weight: 300; letter-spacing: -0.02em; line-height: 1; }

/* UI text */
.text-base { font-size: 15px; font-weight: 400; letter-spacing: -0.01em; }
.text-sm   { font-size: 13px; font-weight: 400; letter-spacing: -0.01em; }
.text-xs   { font-size: 11px; font-weight: 400; }

/* Labels — always uppercase */
.label     { font-size: 9px;  font-weight: 500; text-transform: uppercase; letter-spacing: 0.09em; }
```

---

## Color Tokens

```css
:root {
  /* Backgrounds — elevation via color, never shadows */
  --bg0: #0C0C0B;   /* page background — warm black */
  --s1:  #1C1C1A;   /* cards, widgets */
  --s2:  #252523;   /* inputs, elevated controls */
  --s3:  #2E2E2C;   /* overlays, tooltips */

  /* Text */
  --t1: #F5F5F3;    /* primary — warm off-white */
  --t2: #8A8A88;    /* secondary */
  --t3: #52524F;    /* muted, disabled, labels */

  /* Borders — hairline only */
  --border: 0.5px solid #2E2E2C;

  /* Semantic accents */
  --emerald:     #1D9E75;   /* positive, CTA, wellness ok */
  --emerald-dim: rgba(29,158,117,0.12);
  --emerald-t:   #4ECDA4;

  --amber:       #BA7517;   /* moderate alert */
  --amber-dim:   rgba(186,117,23,0.12);
  --amber-t:     #F0A830;

  --coral:       #D85A30;   /* critical, over budget */
  --coral-dim:   rgba(216,90,48,0.12);
  --coral-t:     #F07050;

  /* Identity */
  --blue:        #378ADD;   /* Víctor */
  --blue-dim:    rgba(55,138,221,0.12);
  --blue-t:      #6AAEE8;

  --pink:        #D4537E;   /* Camila */
  --pink-dim:    rgba(212,83,126,0.12);
  --pink-t:      #E880A8;
}
```

---

## Spacing

```
Base unit: 4px
Page padding: 16px sides, 20px top
Card padding: 16px
Section gap: 24px
Component gap: 8–12px
```

---

## Border Radius

```css
--r-input:  8px;    /* inputs, small controls */
--r-card:   12px;   /* cards, list items */
--r-sheet:  16px;   /* bottom sheet top corners */
--r-pill:   999px;  /* tags, badges, chips */
```

---

## Elevation

No shadows — elevation is surface color only:
```
L0 page:    #0C0C0B
L1 card:    #1C1C1A
L2 input:   #252523
L3 overlay: #2E2E2C
```

---

## Animation

```
Library: Motion (motion/react) + motion-primitives
Sheet slide-up:   y 100%→0, spring stiffness 300, damping 30
List stagger:     fade + translateY, 50ms delay between items
Number counters:  ease-out-expo on mount
Button press:     scale(0.97) + opacity 0.8
Hover:            opacity 0.75 + background rgba(255,255,255,0.04)
Focus:            outline 1.5px solid #1D9E75, offset 2px
Disabled:         opacity 0.35
```

---

## Iconography

```
Library: Lucide React
Size: 20px standard · 16px dense lists · 24px primary actions
Stroke: 1.5px, rounded caps
Color: inherit from text (--t2 secondary, --t1 primary)
```

---

## Components

### Income Pill (always visible, top center)
```
Empty:  dashed border rgba(29,158,117,0.35) · color --emerald-t · "• Añade tus ingresos"
Filled: bg --s1 · border --border · dot --emerald · "$X.XXX.XXX / mes ▾"
```

### Wellness Ring
```
SVG circle · stroke-width 5.5px
Track: --s2
Fill: semantic color (emerald/amber/coral)
Center text: percentage, Inter 300, tight tracking
States: >40% emerald · 20-40% amber · <20% coral
```

### Cards
```
bg: --s1
border: var(--border)
border-radius: var(--r-card)
padding: 16px
no box-shadow
```

### Badges / Chips
```
shared:   bg --blue-dim   · color --blue-t  · "⊕ compartido"
personal: bg --s2         · color --t2      · "personal"
ok:       bg --emerald-dim· color --emerald-t
warning:  bg --amber-dim  · color --amber-t
critical: bg --coral-dim  · color --coral-t
border-radius: var(--r-pill)
font-size: 9px, weight 500
```

### Bottom Sheet (Vaul)
```
bg: --s1
border-radius: 16px 16px 0 0
handle: 32px × 3px · bg --s3 · margin 10px auto
backdrop: rgba(0,0,0,0.55)
spring: stiffness 300, damping 30
drag to dismiss: enabled
```

### Inputs
```
bg: --s2
border: var(--border)
border-radius: var(--r-input)
padding: 10px 12px
font-size: 12px
color: --t1
placeholder: --t3
focus: outline 1.5px solid --emerald
```

### Primary Button
```
bg: --blue (#378ADD)   ← blue, NOT emerald
color: white
border-radius: var(--r-input)
padding: 12px
font-size: 13px, weight 500
press: scale(0.97)
```

### FAB
```
Position: bottom nav center, elevated
size: 52px circle
bg: --blue
icon: Plus, 24px, white
shadow: none
```

### Bottom Nav
```
5 tabs: Inicio · Gastos · + (FAB) · Presup. · Pareja
bg: --bg0
border-top: var(--border)
active label: --t1
inactive label: --t3
active dot: 3px circle --emerald below label
```

### Suggestion Chip (shared expense)
```
bg: --emerald-dim
border: 0.5px solid rgba(29,158,117,0.2)
border-radius: var(--r-input)
icon: checkmark circle --emerald
text: --emerald-t, 10px
content: "Sugerido $X (56% proporcional) — justo proporcional"
```

### Toasts (Sonner)
```
Position: top
Style: dark, rounded
Success: --emerald accent
Error: --coral accent
```

---

## Voice & Copy

```
Language: Spanish (Latin American)
Personal:  "Mi saldo", "Mis gastos"
Couple:    "Nuestro saldo", "Lo que gastamos juntos"
Greeting:  "Buenos días / tardes / noches"
Positive:  "Todo en orden 🟢"
Alert:     "Ojo, casi sin presupuesto"  ← never shame
Numbers:   $1.234.000 format (COP)
Labels:    Title Case → "Gastos del Mes"
Categories: lowercase → "comida", "transporte"
```

---

## Screen Reference

### Home
```
Header: "Buenos días" + "Mis finanzas" (large) + avatars V/C top right
Income pill: top, full width pill with income total
Bienestar card: ring left + hero amount right + "saldo disponible" label
Distribución card: stacked bar + legend
Equidad card: bicolor bar + names + amounts + insight text
Hogar compartido card: icon + title + progress bar + percentage
Bottom nav: 5 tabs with central FAB
```

### Gastos
```
Header: "Gastos" + profile switcher
Category filter chips: horizontal scroll
Expense list: icon + name + category + badge + amount + sub-amount if shared
FAB: bottom right (not center on this screen)
```

### Add Expense Sheet (Vaul)
```
Hero amount input: large, top of sheet, $X.XXX.XXX display size
Name field below
Category selector + Compartido toggle in same row
Mi Parte field with suggestion chip below
Primary CTA: "Guardar gasto" — blue button
```
