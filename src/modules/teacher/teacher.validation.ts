import { z } from 'zod';

export const teacherValidation = z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((v) => v.toLowerCase()),
    specialization: z.string().trim().min(2).max(100),
    experience: z.coerce.string().trim()
})