import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'
import { RemoveOrderItemUseCase } from '@/domain/ecommerce/app/use-cases/remove-order-item'
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Inject,
	NotFoundException,
	Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const removeOrderItemSchema = z.object({
	orderId: z.string().uuid(),
	id: z.string(),
})

const paramsValidationPipe = new ZodValidationPipe(removeOrderItemSchema)
type RemoveOrderItemSchema = z.infer<typeof removeOrderItemSchema>

@Controller('/orders/:orderId/items/:id')
export class RemoveOrderItemController {
	constructor(@Inject(RemoveOrderItemUseCase) private removeOrderItem: RemoveOrderItemUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(@Param(paramsValidationPipe) params: RemoveOrderItemSchema) {
		const { orderId, id } = params

		const result = await this.removeOrderItem.execute({
			orderId,
			id,
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
