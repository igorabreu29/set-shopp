import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { StoreProducts } from '@/domain/ecommerce/app/store/store'
import { StripeStoreService } from './stripe-store.service'

@Module({
	imports: [EnvModule],
	providers: [
		{
			provide: StoreProducts,
			useClass: StripeStoreService,
		},
	],
	exports: [StoreProducts],
})
export class StoreModule {}
