import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { StoreModule } from '@/infra/store/store.module'
import { StoreProducts } from '@/domain/ecommerce/app/store/store'

describe('Create Store Product (E2E)', () => {
	let app: INestApplication
	let stripeStoreService: StoreProducts

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, StoreModule],
		}).compile()

		app = moduleRef.createNestApplication()
		stripeStoreService = moduleRef.get(StoreProducts)

		await app.init()
	})

	it('POST /store-products', async () => {
		const response = await request(app.getHttpServer()).post('/store-products').send({
			name: 'test',
			description: 'test',
			price: 10,
		})

		expect(response.statusCode).toBe(201)
	})
})
