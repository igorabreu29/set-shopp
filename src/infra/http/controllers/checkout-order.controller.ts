import { CheckoutOrderUseCase } from '@/domain/ecommerce/app/use-cases/checkout-order'
import { BadRequestException, Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common'

@Controller('/orders/:id/checkout')
export class CheckoutOrderController {
	constructor(@Inject(CheckoutOrderUseCase) private checkoutOrder: CheckoutOrderUseCase) {}

	@Post()
	async handle(@Param('id') id: string) {
		const result = await this.checkoutOrder.execute({ orderId: id })

		if (result.isLeft()) {
			const error = result.value

			throw new BadRequestException(error.message)
		}

		const { checkoutUrl } = result.value

		return {
			checkoutUrl,
		}
	}
}
