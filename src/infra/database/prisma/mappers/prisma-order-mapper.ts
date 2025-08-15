import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order } from '@/domain/ecommerce/enterprise/entities/order';
import { Prisma, type Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create({
      customerId: new UniqueEntityId(raw.customerId),
      totalPrice: Number(raw.totalPrice),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      hasFinished: raw.hasFinished
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(order: Order): PrismaOrder {
    return {
      id: order.id.toValue(),
      customerId: order.customerId.toValue(),
      totalPrice: new Prisma.Decimal(order.totalPrice),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      hasFinished: order.hasFinished,
    }
  }
}