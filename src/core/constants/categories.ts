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

export const CATEGORY_COLORS: Record<string, string> = {
  vivienda:        'var(--cat-vivienda)',
  alimentacion:    'var(--cat-alimentacion)',
  transporte:      'var(--cat-transporte)',
  salud:           'var(--cat-salud)',
  entretenimiento: 'var(--cat-entretenimiento)',
  suscripciones:   'var(--cat-suscripciones)',
  otros:           'var(--cat-otros)',
}

// Light background tints for category icon tiles
export const CATEGORY_TINTS: Record<string, string> = {
  vivienda:        '#E7F4FC',
  alimentacion:    '#F2F7DC',
  transporte:      '#FBEAE3',
  salud:           '#FBEAF0',
  entretenimiento: '#EEEBFB',
  suscripciones:   '#E4F5F7',
  otros:           '#F0EFEB',
}
