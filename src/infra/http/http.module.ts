import { Module } from '@nestjs/common'
import { FetchAndCreateProductsController } from './controllers/fetch-and-create-products.controller'
import { FetchAndCreateProductsUseCase } from '@/domain/ecommerce/app/use-cases/fetch-and-create-products'
import { DatabaseModule } from '../database/database.module'
import { StoreModule } from '../store/store.module'
import { AddProductToOrderController } from './controllers/add-product-to-order.controller'
import { AddProductToOrderUseCase } from '@/domain/ecommerce/app/use-cases/add-product-to-order'
import { CheckoutOrderUseCase } from '@/domain/ecommerce/app/use-cases/checkout-order'
import { DecreaseOrderItemQuantityUseCase } from '@/domain/ecommerce/app/use-cases/decrease-order-item-quantity'
import { IncreaseOrderItemQuantityUseCase } from '@/domain/ecommerce/app/use-cases/increase-order-item-quantity'
import { FetchOrderItemsUseCase } from '@/domain/ecommerce/app/use-cases/fetch-order-items'
import { FetchProductsUseCase } from '@/domain/ecommerce/app/use-cases/fetch-products'
import { GetAndCreateProductUseCase } from '@/domain/ecommerce/app/use-cases/get-and-create-product'
import { GetProductUseCase } from '@/domain/ecommerce/app/use-cases/get-product'
import { GetUserSessionUseCase } from '@/domain/ecommerce/app/use-cases/get-user-session'
import { RemoveOrderItemUseCase } from '@/domain/ecommerce/app/use-cases/remove-order-item'
import { IncreaseOrderItemQuantityController } from './controllers/increase-order-item-quantity.controller'
import { DecreaseOrderItemQuantityController } from './controllers/decrease-order-item-quantity.controller'
import { GetAndCreateProductsController } from './controllers/get-and-create-product.controller'
import { FetchOrderItemsController } from './controllers/fetch-order-items.controller'
import { FetchProductsController } from './controllers/fetch-products.controller'
import { GetProductController } from './controllers/get-product.controller'
import { CheckoutOrderController } from './controllers/checkout-order.controller'
import { RemoveOrderItemController } from './controllers/remove-order-item.controller'
import { CreateStoreProductController } from './controllers/create-store-product.controller'
import { CreateStoreProductUseCase } from '@/domain/ecommerce/app/use-cases/create-store-product'
import { StoreWebhookController } from './controllers/store-webhook.controller'
import { EnvModule } from '../env/env.module'

@Module({
	imports: [DatabaseModule, StoreModule, EnvModule],
	controllers: [
		FetchAndCreateProductsController,
		AddProductToOrderController,
		IncreaseOrderItemQuantityController,
		DecreaseOrderItemQuantityController,
		GetAndCreateProductsController,
		FetchOrderItemsController,
		FetchProductsController,
		GetProductController,
		CheckoutOrderController,
		RemoveOrderItemController,
		CreateStoreProductController,
		StoreWebhookController,
	],
	providers: [
		FetchAndCreateProductsUseCase,
		AddProductToOrderUseCase,
		CheckoutOrderUseCase,
		DecreaseOrderItemQuantityUseCase,
		IncreaseOrderItemQuantityUseCase,
		FetchOrderItemsUseCase,
		FetchProductsUseCase,
		GetAndCreateProductUseCase,
		GetProductUseCase,
		GetUserSessionUseCase,
		RemoveOrderItemUseCase,
		CreateStoreProductUseCase,
	],
})
export class HttpModule {}
