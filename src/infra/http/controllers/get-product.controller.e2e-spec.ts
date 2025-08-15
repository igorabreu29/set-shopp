import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'
import { DatabaseModule } from '@/infra/database/database.module'

import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'

describe('Get Product (E2E)', () => {
	let app: INestApplication
	let productFactory: ProductFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ProductFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		productFactory = moduleRef.get(ProductFactory)

		await app.init()
	})

	it('GET /products/:id', async () => {
		const productCreated = await productFactory.makePrismaProduct({ price: 20 })

		const response = await request(app.getHttpServer()).get(
			`/products/${productCreated.id.toValue()}`
		)

		expect(response.statusCode).toBe(200)

		const { product } = response.body

		expect(product).toMatchObject({
			id: productCreated.id.toValue(),
		})
	})
})
