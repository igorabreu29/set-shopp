import type { OrdersRepository } from '@/domain/ecommerce/app/repositories/orders-repository'
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import type { Order } from '@/domain/ecommerce/enterprise/entities/order'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
	constructor(
		@Inject(PrismaService)
		private prisma: PrismaService
	) {}

	async findById(id: string): Promise<Order | null> {
		const order = await this.prisma.order.findUnique({
			where: {
				id,
			},
		})
		if (!order) return null

		return PrismaOrderMapper.toDomain(order)
	}

	async findByCustomerId(customerId: string): Promise<Order | null> {
		const order = await this.prisma.order.findFirst({
			where: {
				customerId,
				hasFinished: false,
			},
		})
		if (!order) return null

		return PrismaOrderMapper.toDomain(order)
	}

	async create(order: Order): Promise<Order> {
		const raw = PrismaOrderMapper.toPrisma(order)
		const orderCreated = await this.prisma.order.create({
			data: raw,
		})

		return PrismaOrderMapper.toDomain(orderCreated)
	}

	async save(order: Order): Promise<void> {
		const raw = PrismaOrderMapper.toPrisma(order)
		const orderCreated = await this.prisma.order.update({
			where: {
				id: raw.id,
			},

			data: raw,
		})
	}
}
