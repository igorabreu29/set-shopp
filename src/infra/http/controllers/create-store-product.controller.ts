import { CreateStoreProductUseCase } from '@/domain/ecommerce/app/use-cases/create-store-product'
import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createStoreProductSchema = z.object({
	name: z.string(),
	description: z.string(),
	price: z.number(),
	imageUrl: z.string().optional(),
})

type CreateStoreProductSchema = z.infer<typeof createStoreProductSchema>

const bodyValidation = new ZodValidationPipe(createStoreProductSchema)

@Controller('/store-products')
export class CreateStoreProductController {
	constructor(
		@Inject(CreateStoreProductUseCase) private createStoreProduct: CreateStoreProductUseCase
	) {}

	@Post()
	async handle(@Body(bodyValidation) body: CreateStoreProductSchema) {
		const { name, description, price, imageUrl } = body

		const result = await this.createStoreProduct.execute({
			name,
			description,
			price,
			imageUrl,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
