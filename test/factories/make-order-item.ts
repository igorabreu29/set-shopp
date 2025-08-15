import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderItem, type OrderItemProps } from '@/domain/ecommerce/enterprise/entities/order-item'
import { PrismaOrderItemMapper } from '@/infra/database/prisma/mappers/prisma-order-item-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Inject, Injectable } from '@nestjs/common'

export function makeOrderItem(override: Partial<OrderItem> = {}, id?: UniqueEntityId) {
	const orderItem = OrderItem.create(
		{
			orderId: new UniqueEntityId(),
			productId: new UniqueEntityId(),
			priceId: 'price_test',
			price: 0,
			quantity: 0,
			...override,
		},
		id
	)

	return orderItem
}

@Injectable()
export class OrderItemFactory {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async makePrismaOrderItem(data: Partial<OrderItemProps> = {}): Promise<OrderItem> {
		const orderItem = makeOrderItem(data)
		const raw = PrismaOrderItemMapper.toPrisma(orderItem)

		await this.prisma.orderItem.create({
			data: raw,
		})

		return orderItem
	}
}
