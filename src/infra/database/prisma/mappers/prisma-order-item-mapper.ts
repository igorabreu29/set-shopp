import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item';
import { Prisma, type OrderItem as PrismaOrderItem } from '@prisma/client'

export class PrismaOrderItemMapper {
  static toDomain(raw: PrismaOrderItem): OrderItem {
    return OrderItem.create({
      orderId: new UniqueEntityId(raw.orderId),
      productId: new UniqueEntityId(raw.productId),
      price: Number(raw.price),
      priceId: raw.priceId,
      quantity: raw.quantity
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(orderItem: OrderItem): PrismaOrderItem {
    return {
      id: orderItem.id.toValue(),
      orderId: orderItem.orderId.toValue(),
      productId: orderItem.productId.toValue(),
      price: new Prisma.Decimal(orderItem.price),
      priceId: orderItem.priceId,
      quantity: orderItem.quantity
    }
  }
}