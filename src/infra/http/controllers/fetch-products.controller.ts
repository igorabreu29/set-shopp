import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common'
import { FetchProductsUseCase } from '../../../domain/ecommerce/app/use-cases/fetch-products'
import { ProductPresenter } from '../presenters/product-presenter'

@Controller('/products')
export class FetchProductsController {
	constructor(@Inject(FetchProductsUseCase) private fetchProducts: FetchProductsUseCase) {}

	@Get()
	async handle(@Query('page') page?: string) {
		const pageTransformed = page ? Number(page) : undefined
		const result = await this.fetchProducts.execute({ page: pageTransformed })

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { products } = result.value

		return {
			products: products.map(ProductPresenter.toHTTP),
		}
	}
}
