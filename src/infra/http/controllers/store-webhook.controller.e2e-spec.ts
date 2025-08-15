import { AppModule } from '@/infra/app.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { StoreProducts } from '@/domain/ecommerce/app/store/store'
import { StoreModule } from '@/infra/store/store.module'

describe('Store Webhook (E2E)', () => {
	let app: INestApplication
	let stripeStoreService: StoreProducts

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, StoreModule],
		}).compile()

		app = moduleRef.createNestApplication()
		stripeStoreService = moduleRef.get(StoreProducts)

		await app.init()
	})

	it('POST /webhook', async () => {
		const product = await stripeStoreService.create({
			name: 'test',
			description: 'test',
			price: 1000,
		})

		const eventPayload: {
			id: string
			type: string
			data: {
				object: Record<string, string | number>
			}
		} = {
			id: 'event_test_webhook',
			type: 'product.created',
			data: {
				object: {
					id: product.id,
				},
			},
		}

		const signature = stripeStoreService.generateSignature({ payload: eventPayload })

		const response = await request(app.getHttpServer())
			.post('/webhook')
			.set('Stripe-Signature', signature)
			.send(eventPayload)

		expect(response.statusCode).toBe(201)
	})
})
