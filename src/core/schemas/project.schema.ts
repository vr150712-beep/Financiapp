import { z } from 'zod'

export const ProjectSchema = z.object({
  id:     z.string().uuid(),
  label:  z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres').trim(),
  amount: z.number({
    invalid_type_error: 'Ingresa un monto válido',
  }).positive('El monto debe ser mayor a 0'),
  months: z.number({
    invalid_type_error: 'Ingresa un número de meses válido',
  }).int().min(1, 'Entre 1 y 120 meses').max(120, 'Entre 1 y 120 meses'),
  note:   z.string().max(200).optional(),
})

export type Project = z.infer<typeof ProjectSchema>
