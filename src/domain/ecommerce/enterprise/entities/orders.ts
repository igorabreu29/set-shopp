import { Entity } from "@/core/entities/entity.ts";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.ts";
import type { Optional } from "@/core/types/optional.ts";

export interface OrdersProps {
  customerId: UniqueEntityId
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

export class Orders extends Entity<OrdersProps> {
  get customerId() {
    return this.props.customerId
  }

  get totalPrice() {
    return this.props.totalPrice
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: Optional<OrdersProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
    const orders = new Orders({
      ...props, 
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    }, id)

    return orders
  }
}