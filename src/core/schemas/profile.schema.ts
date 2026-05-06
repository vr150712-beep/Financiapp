import { z } from 'zod'
import { IncomeSourceSchema } from './income-source.schema'

export const ProfileSchema = z.object({
  id:      z.enum(['victor', 'partner']),
  name:    z.string().min(2),
  savings: z.number().nonnegative(),
  color:   z.string(),
  sources: z.array(IncomeSourceSchema),
})

export type Profile = z.infer<typeof ProfileSchema>
export type ProfileId = Profile['id']
