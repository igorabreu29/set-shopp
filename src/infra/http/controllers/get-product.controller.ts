import {
	BadRequestException,
	Controller,
	Get,
	Inject,
	NotFoundException,
	Param,
	Query,
} from '@nestjs/common'
import { ProductPresenter } from '../presenters/product-presenter'
import { GetProductUseCase } from '@/domain/ecommerce/app/use-cases/get-product'
import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'

@Controller('/products/:id')
export class GetProductController {
	constructor(@Inject(GetProductUseCase) private getProduct: GetProductUseCase) {}

	@Get()
	async handle(@Param('id') id: string) {
		const result = await this.getProduct.execute({ id })

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		const { product } = result.value

		return {
			product: ProductPresenter.toHTTP(product),
		}
	}
}
