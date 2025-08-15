import type {
	FindByOrderAndProductIdProps,
	FindManyByOrderIdWithPaginated,
	OrderItemsRepository,
} from '@/domain/ecommerce/app/repositories/order-items-repository'
import { PrismaService } from '../prisma.service'
import type { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item'
import { PrismaOrderItemMapper } from '../mappers/prisma-order-item-mapper'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
	constructor(
		@Inject(PrismaService)
		private prisma: PrismaService
	) {}

	async findById(id: string): Promise<OrderItem | null> {
		const orderItem = await this.prisma.orderItem.findUnique({
			where: {
				id,
			},
		})
		if (!orderItem) return null

		return PrismaOrderItemMapper.toDomain(orderItem)
	}

	async findByOrderAndProductId({
		orderId,
		productId,
	}: FindByOrderAndProductIdProps): Promise<OrderItem | null> {
		const orderItem = await this.prisma.orderItem.findFirst({
			where: {
				orderId,
				productId,
			},
		})
		if (!orderItem) return null

		return PrismaOrderItemMapper.toDomain(orderItem)
	}

	async findManyByOrderId({ orderId, page }: FindManyByOrderIdWithPaginated): Promise<OrderItem[]> {
		const orderItems = await this.prisma.orderItem.findMany({
			where: {
				orderId,
			},
		})

		return orderItems.map(PrismaOrderItemMapper.toDomain)
	}

	async create(orderItem: OrderItem): Promise<void> {
		const raw = PrismaOrderItemMapper.toPrisma(orderItem)

		await this.prisma.orderItem.create({
			data: raw,
		})
	}

	async save(orderItem: OrderItem): Promise<void> {
		const raw = PrismaOrderItemMapper.toPrisma(orderItem)

		await this.prisma.orderItem.update({
			where: {
				id: raw.id,
			},
			data: raw,
		})
	}

	async delete(orderItem: OrderItem): Promise<void> {
		const raw = PrismaOrderItemMapper.toPrisma(orderItem)

		await this.prisma.orderItem.delete({
			where: {
				id: raw.id,
			},
		})
	}
}
