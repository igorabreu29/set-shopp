import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'
import { DatabaseModule } from '@/infra/database/database.module'

import request from 'supertest'

describe('Get And Create Product (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
		}).compile()

		app = moduleRef.createNestApplication()

		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	it('POST /products/:id/store', async () => {
		const productId = 'prod_QXg1hqf4jFNsqG'

		const response = await request(app.getHttpServer()).post(`/products/${productId}/store`)
		expect(response.statusCode).toEqual(201)

		const productsOnDatabase = await prisma.product.findMany()
		expect(productsOnDatabase).toHaveLength(1)
	})
})
