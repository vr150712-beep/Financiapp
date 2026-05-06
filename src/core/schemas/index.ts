export * from './income-source.schema'
export * from './profile.schema'
export * from './expense.schema'
export * from './project.schema'

import { z } from 'zod'

export const AmountSchema = z.number({
  invalid_type_error: 'Ingresa un monto válido',
}).positive('El monto debe ser mayor a 0').max(100_000_000, 'Monto fuera de rango')

export const LabelSchema = z.string()
  .min(2, 'Mínimo 2 caracteres')
  .max(50, 'Máximo 50 caracteres')
  .trim()
