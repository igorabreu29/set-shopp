import { InvalidNameError } from '@/core/errors/domain/invalid-name-error'
import { ResourceAlreadyExistError } from '@/domain/ecommerce/app/use-cases/errors/resource-already-exist'
import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'
import { FetchAndCreateProductsUseCase } from '@/domain/ecommerce/app/use-cases/fetch-and-create-products'
import { GetAndCreateProductUseCase } from '@/domain/ecommerce/app/use-cases/get-and-create-product'
import {
	BadRequestException,
	ConflictException,
	Controller,
	Inject,
	NotFoundException,
	Param,
	Post,
} from '@nestjs/common'

@Controller('/products/:id/store')
export class GetAndCreateProductsController {
	constructor(
		@Inject(GetAndCreateProductUseCase)
		private getAndCreateProduct: GetAndCreateProductUseCase
	) {}

	@Post()
	async handle(@Param('id') id: string) {
		const result = await this.getAndCreateProduct.execute({
			id,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceAlreadyExistError:
					throw new ConflictException(error.message)
				case ResourceNotFoundError:
					throw new NotFoundException(error.message)
				case InvalidNameError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
