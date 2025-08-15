import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'
import { DatabaseModule } from '@/infra/database/database.module'

import request from 'supertest'
import { StoreModule } from '@/infra/store/store.module'
import { StoreProducts } from '@/domain/ecommerce/app/store/store'

describe('Fetch And Create Products (E2E)', () => {
	let app: INestApplication
	let stripeStoreService: StoreProducts
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, StoreModule],
		}).compile()

		app = moduleRef.createNestApplication()
		stripeStoreService = moduleRef.get(StoreProducts)
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	it('POST /fetch-and-create-products', async () => {
		const response = await request(app.getHttpServer()).post('/fetch-and-create-products')

		expect(response.statusCode).toEqual(201)

		const productsOnDatabase = await prisma.product.findMany()
		expect(productsOnDatabase).toHaveLength(1)
	})
})
