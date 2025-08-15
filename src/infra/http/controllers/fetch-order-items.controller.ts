import { FetchOrderItemsUseCase } from '@/domain/ecommerce/app/use-cases/fetch-order-items'
import { BadRequestException, Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { OrderItemPresenter } from '../presenters/order-item-presenter'

@Controller('/orders/:orderId/items')
export class FetchOrderItemsController {
	constructor(@Inject(FetchOrderItemsUseCase) private fetchOrderItems: FetchOrderItemsUseCase) {}

	@Get()
	async handle(@Param('orderId') orderId: string, @Query('page') page?: string) {
		const pageTransformed = page ? Number(page) : undefined
		const result = await this.fetchOrderItems.execute({ orderId, page: pageTransformed })

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { orderItems } = result.value

		return {
			orderItems: orderItems.map(OrderItemPresenter.toHTTP),
		}
	}
}
