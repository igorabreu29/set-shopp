import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, type OrderProps } from '@/domain/ecommerce/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Inject, Injectable } from '@nestjs/common'

export function makeOrder(override: Partial<OrderProps> = {}, id?: UniqueEntityId) {
	const order = Order.create(
		{
			customerId: new UniqueEntityId(),
			totalPrice: 0,
			...override,
		},
		id
	)

	return order
}

@Injectable()
export class OrderFactory {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
		const order = makeOrder(data)
		const raw = PrismaOrderMapper.toPrisma(order)

		await this.prisma.order.create({
			data: raw,
		})

		return order
	}
}
