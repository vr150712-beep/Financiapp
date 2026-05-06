import { z } from 'zod'
import { CATEGORY_KEYS } from '../constants/categories'

export const CategoryEnum = z.enum(CATEGORY_KEYS)

export const ExpenseSchema = z.object({
  id:        z.string().uuid(),
  ownerId:   z.enum(['victor', 'partner']),
  label:     z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres').trim(),
  amount:    z.number({
    invalid_type_error: 'Ingresa un monto válido',
  }).positive('El monto debe ser mayor a 0').max(100_000_000, 'Monto fuera de rango'),
  category:  CategoryEnum,
  shared:    z.boolean(),
  myPart:    z.number().nonnegative(),
  otherPart: z.number().nonnegative(),
})

export type Expense = z.infer<typeof ExpenseSchema>
export type Category = z.infer<typeof CategoryEnum>
