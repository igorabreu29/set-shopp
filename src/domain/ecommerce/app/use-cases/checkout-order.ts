import { left, right, type Either } from '@/core/either'
import { OrderItemsRepository } from '../repositories/order-items-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { StoreProducts } from '../store/store'
import { Inject, Injectable } from '@nestjs/common'

interface CheckoutOrderUseCaseRequest {
	orderId: string
}

type CheckoutOrderUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		checkoutUrl: string
	}
>

@Injectable()
export class CheckoutOrderUseCase {
	constructor(
		@Inject(OrdersRepository)
		private ordersRepository: OrdersRepository,
		@Inject(OrderItemsRepository)
		private orderItemsRepository: OrderItemsRepository,
		@Inject(StoreProducts)
		private storeProduct: StoreProducts
	) {}

	async execute({ orderId }: CheckoutOrderUseCaseRequest): Promise<CheckoutOrderUseCaseResponse> {
		const order = await this.ordersRepository.findById(orderId)
		if (!order) return left(new ResourceNotFoundError('Order does not exist'))

		const orderItems = await this.orderItemsRepository.findManyByOrderId({ orderId })

		const productsToCheckout = orderItems.map(orderItem => ({
			price: orderItem.priceId,
			quantity: orderItem.quantity,
		}))

		const { checkoutUrl } = await this.storeProduct.checkout(productsToCheckout)

		return right({
			checkoutUrl,
		})
	}
}
