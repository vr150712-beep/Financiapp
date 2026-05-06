import { z } from 'zod'

export const IncomeSourceSchema = z.object({
  id:     z.string().uuid(),
  name:   z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres').trim(),
  amount: z.number({
    invalid_type_error: 'Ingresa un monto válido',
  }).positive('El monto debe ser mayor a 0').max(100_000_000, 'Monto fuera de rango'),
})

export type IncomeSource = z.infer<typeof IncomeSourceSchema>
