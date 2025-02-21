import { z } from 'zod';

export const SigninSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
});
