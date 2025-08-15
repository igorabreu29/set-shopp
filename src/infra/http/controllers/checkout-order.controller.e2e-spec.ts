import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'
import { DatabaseModule } from '@/infra/database/database.module'

import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'
import { OrderFactory } from 'test/factories/make-order'
import { OrderItemFactory } from 'test/factories/make-order-item'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { StoreModule } from '@/infra/store/store.module'

describe('Checkout Order (E2E)', () => {
	let app: INestApplication
	let productFactory: ProductFactory
	let orderFactory: OrderFactory
	let orderItemFactory: OrderItemFactory
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, StoreModule],
			providers: [ProductFactory, OrderFactory, OrderItemFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		productFactory = moduleRef.get(ProductFactory)
		orderFactory = moduleRef.get(OrderFactory)
		orderItemFactory = moduleRef.get(OrderItemFactory)
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	it('PATCH /orders/:id/checkout', async () => {
		await request(app.getHttpServer()).post('/fetch-and-create-products')

		const productOnDatabase = await prisma.product.findUniqueOrThrow({
			where: {
				id: 'prod_QXg1hqf4jFNsqG',
			},
		})

		const customer = await prisma.customer.create({
			data: {
				name: 'Customer',
				email: 'customer@cs.com',
			},
		})

		const order = await orderFactory.makePrismaOrder({
			customerId: new UniqueEntityId(customer.id),
			totalPrice: Number(productOnDatabase.price),
			hasFinished: false,
		})

		await orderItemFactory.makePrismaOrderItem({
			orderId: order.id,
			productId: new UniqueEntityId(productOnDatabase.id),
			price: Number(productOnDatabase.price),
			priceId: productOnDatabase.priceId,
			quantity: 1,
		})

		const response = await request(app.getHttpServer()).post(
			`/orders/${order.id.toValue()}/checkout`
		)

		expect(response.statusCode).toBe(201)

		const { checkoutUrl } = response.body

		expect(checkoutUrl).toBeDefined()
	})
})
