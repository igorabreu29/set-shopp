import { left, right, type Either } from '@/core/either.ts'
import type { OrderItemsRepository } from '../repositories/order-items-repository.ts'
import type { OrdersRepository } from '../repositories/orders-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found.ts'
import type { StoreProducts } from '../store/store.ts'

interface CheckoutOrderUseCaseRequest {
	orderId: string
}

type CheckoutOrderUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		checkoutUrl: string
	}
>

export class CheckoutOrderUseCase {
	constructor(
		private ordersRepository: OrdersRepository,
		private orderItemsRepository: OrderItemsRepository,
		private storeProduct: StoreProducts
	) {}

	async execute({ orderId }: CheckoutOrderUseCaseRequest): Promise<CheckoutOrderUseCaseResponse> {
		const order = await this.ordersRepository.findById(orderId)
		if (!order) return left(new ResourceNotFoundError('Order does not exist'))

		const orderItems = await this.orderItemsRepository.findManyByOrderId({ orderId })

		const productsToCheckout = orderItems.map(orderItem => ({
			priceId: orderItem.priceId,
			quantity: orderItem.quantity,
		}))

		const { checkoutUrl } = await this.storeProduct.checkout(productsToCheckout)

		return right({
			checkoutUrl,
		})
	}
}
