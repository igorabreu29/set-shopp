import { AddProductToOrderUseCase } from '@/domain/ecommerce/app/use-cases/add-product-to-order'
import {
	BadRequestException,
	Body,
	Controller,
	Inject,
	NotFoundException,
	Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'

const addProductToOrderSchema = z.object({
	customerId: z.string().uuid(),
	productId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(addProductToOrderSchema)
type AddProductToOrderSchema = z.infer<typeof addProductToOrderSchema>

@Controller('/orders')
export class AddProductToOrderController {
	constructor(
		@Inject(AddProductToOrderUseCase)
		private addProductToOrder: AddProductToOrderUseCase
	) {}

	@Post()
	async handle(@Body(bodyValidationPipe) body: AddProductToOrderSchema) {
		const { customerId, productId } = body

		const result = await this.addProductToOrder.execute({
			customerId,
			productId,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
