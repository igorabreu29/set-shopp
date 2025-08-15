import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { OrdersRepository } from '@/domain/ecommerce/app/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { OrderItemsRepository } from '@/domain/ecommerce/app/repositories/order-items-repository'
import { PrismaOrderItemsRepository } from './prisma/repositories/prisma-order-items-repository'
import { ProductsRepository } from '@/domain/ecommerce/app/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'

@Module({
	providers: [
		PrismaService,
		{
			provide: OrdersRepository,
			useClass: PrismaOrdersRepository,
		},
		{
			provide: OrderItemsRepository,
			useClass: PrismaOrderItemsRepository,
		},
		{
			provide: ProductsRepository,
			useClass: PrismaProductsRepository,
		},
	],
	exports: [PrismaService, OrdersRepository, OrderItemsRepository, ProductsRepository],
})
export class DatabaseModule {}
