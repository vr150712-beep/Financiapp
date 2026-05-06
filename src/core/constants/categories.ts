export const CATEGORIES = {
  vivienda:        { label: 'Vivienda',       icon: '🏠' },
  alimentacion:    { label: 'Alimentación',   icon: '🍽️' },
  transporte:      { label: 'Transporte',     icon: '🚌' },
  salud:           { label: 'Salud',          icon: '💊' },
  entretenimiento: { label: 'Entretenimiento',icon: '🎮' },
  suscripciones:   { label: 'Suscripciones',  icon: '📱' },
  otros:           { label: 'Otros',          icon: '📦' },
} as const

export type CategoryKey = keyof typeof CATEGORIES

// Used by Zod enum — must be a non-empty tuple
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]]
