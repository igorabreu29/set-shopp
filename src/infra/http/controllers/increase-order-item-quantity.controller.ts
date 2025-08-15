import {
	BadRequestException,
	ConflictException,
	Controller,
	HttpCode,
	Inject,
	Param,
	Patch,
} from '@nestjs/common'
import { IncreaseOrderItemQuantityUseCase } from '@/domain/ecommerce/app/use-cases/increase-order-item-quantity'
import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'
import { MaxLimitSizeError } from '@/domain/ecommerce/app/use-cases/errors/max-limit-size'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'

const increaseOrderItemQuantitySchema = z.object({
	orderId: z.string().uuid(),
	id: z.string(),
})

const paramsValidationPipe = new ZodValidationPipe(increaseOrderItemQuantitySchema)
type IncreaseOrderItemQuantitySchema = z.infer<typeof increaseOrderItemQuantitySchema>

@Controller('/orders/:orderId/items/:id/increase')
export class IncreaseOrderItemQuantityController {
	constructor(
		@Inject(IncreaseOrderItemQuantityUseCase)
		private increaseOrderItemQuantity: IncreaseOrderItemQuantityUseCase
	) {}

	@Patch()
	@HttpCode(204)
	async handle(@Param(paramsValidationPipe) params: IncreaseOrderItemQuantitySchema) {
		const { orderId, id } = params

		const result = await this.increaseOrderItemQuantity.execute({
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
