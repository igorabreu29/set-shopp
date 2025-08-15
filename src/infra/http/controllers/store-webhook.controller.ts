import { InvalidNameError } from '@/core/errors/domain/invalid-name-error'
import { StoreProducts } from '@/domain/ecommerce/app/store/store'
import { ResourceAlreadyExistError } from '@/domain/ecommerce/app/use-cases/errors/resource-already-exist'
import { ResourceNotFoundError } from '@/domain/ecommerce/app/use-cases/errors/resource-not-found'
import { GetAndCreateProductUseCase } from '@/domain/ecommerce/app/use-cases/get-and-create-product'
import { EnvService } from '@/infra/env/env.service'
import {
	Controller,
	Inject,
	Headers,
	Req,
	HttpException,
	HttpStatus,
	Post,
	ConflictException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

@Controller('webhook')
export class StoreWebhookController {
	constructor(
		@Inject(EnvService) private envService: EnvService,
		@Inject(StoreProducts) private stripeStoreService: StoreProducts,
		@Inject(GetAndCreateProductUseCase) private getAndCreateProduct: GetAndCreateProductUseCase
	) {}

	@Post()
	async handle(@Headers('Stripe-Signature') signature: string, @Req() request: FastifyRequest) {
		const payload = request.body as Buffer
		const webhookSecret = this.envService.get('STRIPE_WEBHOOK_SECRET')

		try {
			const event = this.stripeStoreService.verifyWebhookSignature({
				payload,
				signature,
				secret: webhookSecret,
			})

			switch (event.type) {
				case 'product.created': {
					const result = await this.getAndCreateProduct.execute({ id: event.data.object.id })

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

					break
				}
				default:
					console.log('Unhandled event type:', event.type)
			}
		} catch (error) {
			throw new HttpException('Webhook verification failed', HttpStatus.BAD_REQUEST)
		}
	}
}
