import { z } from 'zod'

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	STRIPE_PRIVATE_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
	PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
