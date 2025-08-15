import { InvalidNameError } from '@/core/errors/domain/invalid-name-error'
import { FetchAndCreateProductsUseCase } from '@/domain/ecommerce/app/use-cases/fetch-and-create-products'
import { BadRequestException, ConflictException, Controller, Inject, Post } from '@nestjs/common'

@Controller('/fetch-and-create-products')
export class FetchAndCreateProductsController {
	constructor(
		@Inject(FetchAndCreateProductsUseCase)
		private fetchAndCreateProducts: FetchAndCreateProductsUseCase
	) {}

	@Post()
	async handle() {
		const result = await this.fetchAndCreateProducts.execute()

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidNameError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
