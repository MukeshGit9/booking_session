import { z } from 'zod';

export const userValidation = z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((v) => v.toLowerCase()),
    phone: z.coerce.string()
        .transform((val) => val.replace(/\D/g, ''))
        .pipe(z.string().length(10, "phone number must be exactly 10 digits"))
        .transform((val) => Number(val))
})