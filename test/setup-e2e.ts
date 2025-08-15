import { config } from 'dotenv'

import { envSchema } from '@/infra/env'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll } from 'vitest'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

function generateDatabaseUrl(schemaId: string) {
	if (!env.DATABASE_URL) throw new Error('Please provide a DATABASE_URL environment variable')

	const url = new URL(env.DATABASE_URL)
	url.searchParams.set('schema', schemaId)

	return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
	const databaseUrl = generateDatabaseUrl(schemaId)

	process.env.DATABASE_URL = databaseUrl

	execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
	await prisma.$disconnect()
})
