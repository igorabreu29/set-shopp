import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '../../enterprise/entities/order'
import { OrderItemsRepository } from '../repositories/order-items-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { left, right, type Either } from '@/core/either'
import { OrderItem } from '../../enterprise/entities/order-item'
import { Inject, Injectable } from '@nestjs/common'

interface AddProductToOrderUseCaseRequest {
	customerId: string
	productId: string
}

type AddProductToOrderUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class AddProductToOrderUseCase {
	constructor(
		@Inject(ProductsRepository)
		private productsRepository: ProductsRepository,
		@Inject(OrdersRepository)
		private ordersRepository: OrdersRepository,
		@Inject(OrderItemsRepository)
		private orderItemsRepository: OrderItemsRepository
	) {}

	async execute({
		customerId,
		productId,
	}: AddProductToOrderUseCaseRequest): Promise<AddProductToOrderUseCaseResponse> {
		const product = await this.productsRepository.findById(productId)
		if (!product) return left(new ResourceNotFoundError('Product not found.'))

		let order = await this.ordersRepository.findByCustomerId(customerId)
		if (!order) {
			const orderCreated = Order.create({
				customerId: new UniqueEntityId(customerId),
				totalPrice: 0,
			})

			order = await this.ordersRepository.create(orderCreated)
		}

		const orderItemAlreadyExist = await this.orderItemsRepository.findByOrderAndProductId({
			orderId: order.id.toValue(),
			productId: product.id.toValue(),
		})
		if (orderItemAlreadyExist) {
			order.totalPrice -= orderItemAlreadyExist.price

			orderItemAlreadyExist.quantity += 1
			order.totalPrice += orderItemAlreadyExist.price * orderItemAlreadyExist.quantity

			await this.orderItemsRepository.save(orderItemAlreadyExist)
			await this.ordersRepository.save(order)
			return right(null)
		}

		const orderItem = OrderItem.create({
			orderId: order.id,
			productId: product.id,
			price: product.price,
			quantity: 1,
			priceId: product.priceId,
		})

		await this.orderItemsRepository.create(orderItem)

		return right(null)
	}
}
