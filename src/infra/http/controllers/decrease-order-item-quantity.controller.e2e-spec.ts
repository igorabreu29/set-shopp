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

describe('Decrease Order Item Quantity (E2E)', () => {
	let app: INestApplication
	let productFactory: ProductFactory
	let orderFactory: OrderFactory
	let orderItemFactory: OrderItemFactory
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ProductFactory, OrderFactory, OrderItemFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		productFactory = moduleRef.get(ProductFactory)
		orderFactory = moduleRef.get(OrderFactory)
		orderItemFactory = moduleRef.get(OrderItemFactory)
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	it('PATCH /orders/:orderId/items/:id/decrease', async () => {
		const customer = await prisma.customer.create({
			data: {
				name: 'Customer',
				email: 'customer@cs.com',
			},
		})

		const product = await productFactory.makePrismaProduct({ price: 20 })

		const order = await orderFactory.makePrismaOrder({
			customerId: new UniqueEntityId(customer.id),
			totalPrice: 40,
		})

		const orderItem = await orderItemFactory.makePrismaOrderItem({
			orderId: order.id,
			productId: product.id,
			price: 20,
			quantity: 2,
		})

		const response = await request(app.getHttpServer()).patch(
			`/orders/${order.id.toValue()}/items/${orderItem.id.toValue()}/decrease`
		)

		expect(response.statusCode).toBe(204)

		const orderOnDatabase = await prisma.order.findUnique({
			where: {
				id: order.id.toValue(),
			},
		})

		expect(Number(orderOnDatabase?.totalPrice)).toEqual(20)

		const orderItemOnDatabase = await prisma.orderItem.findUnique({
			where: {
				id: orderItem.id.toValue(),
			},
		})

		expect(orderItemOnDatabase?.quantity).toEqual(1)
	})
})
