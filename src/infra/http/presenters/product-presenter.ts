import type { Product } from '@/domain/ecommerce/enterprise/entities/product'

export class ProductPresenter {
	static toHTTP(product: Product) {
		return {
			id: product.id.toValue(),
			name: product.name.value,
			description: product.description,
			price: product.price,
			productUrl: product.productUrl,
		}
	}
}
