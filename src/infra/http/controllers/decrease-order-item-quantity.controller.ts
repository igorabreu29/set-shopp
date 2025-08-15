import {
	BadRequestException,
	ConflictException,
	Controller,
	HttpCode,
	Inject,
	Param,
	Patch,
} from '@nestjs/common'
import { DecreaseOrderItemQuantityUseCase } from '@/domain/ecommerce/app/use-cases/decrease-order-item-quantity'
import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'
import { MaxLimitSizeError } from '@/domain/ecommerce/app/use-cases/errors/max-limit-size'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const decreaseOrderItemQuantitySchema = z.object({
	orderId: z.string().uuid(),
	id: z.string(),
})

const paramsValidationPipe = new ZodValidationPipe(decreaseOrderItemQuantitySchema)
type DecreaseOrderItemQuantitySchema = z.infer<typeof decreaseOrderItemQuantitySchema>

@Controller('/orders/:orderId/items/:id/decrease')
export class DecreaseOrderItemQuantityController {
	constructor(
		@Inject(DecreaseOrderItemQuantityUseCase)
		private decreaseOrderItemQuantity: DecreaseOrderItemQuantityUseCase
	) {}

	@Patch()
	@HttpCode(204)
	async handle(@Param(paramsValidationPipe) params: DecreaseOrderItemQuantitySchema) {
		const { orderId, id } = params

		const result = await this.decreaseOrderItemQuantity.execute({
			orderId,
			id,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new BadRequestException(error.message)
				case MaxLimitSizeError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
