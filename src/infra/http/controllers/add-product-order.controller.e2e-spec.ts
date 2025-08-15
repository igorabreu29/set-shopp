import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'
import { DatabaseModule } from '@/infra/database/database.module'

import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'

describe('Add Product to Order (E2E)', () => {
	let app: INestApplication
	let productFactory: ProductFactory
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ProductFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		productFactory = moduleRef.get(ProductFactory)
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	it('POST /orders', async () => {
		const customer = await prisma.customer.create({
			data: {
				name: 'Customer',
				email: 'customer@cs.com',
			},
		})

		const product = await productFactory.makePrismaProduct()

		const response = await request(app.getHttpServer()).post('/orders').send({
			customerId: customer.id,
			productId: product.id.toValue(),
		})

		expect(response.statusCode).toBe(201)

		const orderOnDatabase = await prisma.order.findFirst({
			where: {
				customerId: customer.id,
			},
		})

		expect(orderOnDatabase).toBeTruthy()

		const orderItemOnDatabase = await prisma.orderItem.findFirst({
			where: {
				orderId: orderOnDatabase?.id,
				productId: product.id.toValue(),
			},
		})

		expect(orderItemOnDatabase).toBeTruthy()
		expect(orderItemOnDatabase?.quantity).toEqual(1)
	})
})
