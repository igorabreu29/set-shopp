import type {
	Checkout,
	GenerateSignature,
	Session,
	StoreProduct,
	StoreProducts,
	VerifyWebhookSignature,
} from '@/domain/ecommerce/app/store/store'
import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { EnvService } from '../env/env.service'
import type { Optional } from '@/core/types/optional'

@Injectable()
export class StripeStoreService implements StoreProducts {
	private stripe: Stripe
	private env: EnvService

	constructor(
		@Inject(EnvService)
		private envService: EnvService
	) {
		const stripeKey = envService.get('STRIPE_PRIVATE_KEY')

		this.env = envService

		this.stripe = new Stripe(stripeKey, {
			apiVersion: '2024-12-18.acacia',
			host: 'localhost',
			port: 12111,
			protocol: 'http',
		})
	}

	async findById(id: string): Promise<StoreProduct | null> {
		const product = await this.stripe.products.retrieve(id, {
			expand: ['default_price'],
		})

		const price = product.default_price as Stripe.Price
		const priceInCents = price.unit_amount ?? 0

		return {
			id: product.id,
			name: product.name,
			description: product.description ?? '',
			price: priceInCents / 100,
			priceId: price.id,
			imageUrl: product.images[0],
		}
	}

	async findMany(): Promise<StoreProduct[]> {
		const response = await this.stripe.products.list({
			expand: ['data.default_price'],
		})

		const products = response.data.map(product => {
			const price = product.default_price as Stripe.Price
			const priceInCents = price.unit_amount ?? 0

			return {
				id: product.id,
				name: product.name,
				description: product.description ?? '',
				price: priceInCents / 100,
				priceId: price.id,
				imageUrl: product.images[0],
			}
		})

		return products
	}

	async findManyBySessionId(sessionId: string): Promise<Session> {
		const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['line_items', 'line_items.data.price.product'],
		})

		const sessionCustomer = session.customer_details?.name
		const products = session.line_items?.data.map(({ price }) => {
			const product = price?.product as Stripe.Product

			return {
				id: product.id,
				name: product.name,
				imageUrl: product.images[0],
			}
		})

		return {
			customerName: sessionCustomer ?? '',
			products: products ?? [],
		}
	}

	async create(product: Optional<StoreProduct, 'id' | 'priceId'>): Promise<{ id: string }> {
		const images = product.imageUrl ? [product.imageUrl] : undefined

		const response = await this.stripe.products.create({
			id: product.id ?? undefined,
			name: product.name,
			description: product.description,
			images,
			default_price_data: {
				currency: 'brl',
				unit_amount: product.price,
			},
		})

		return { id: response.id }
	}

	async save(product: Optional<StoreProduct, 'priceId'>): Promise<void> {
		const images = product.imageUrl ? [product.imageUrl] : undefined

		const productUpdated = {
			name: product.name,
			description: product.description,
			images,
		}

		await this.stripe.products.update(product.id, productUpdated)
	}

	async delete(id: string): Promise<void> {
		await this.stripe.products.del(id)
	}

	async checkout(products: Checkout[]): Promise<{ checkoutUrl: string }> {
		const successUrl = 'http://localhost:3333/success'
		const cancelUrl = 'http://localhost:3333/fail'

		const checkoutSession = await this.stripe.checkout.sessions.create({
			success_url: successUrl,
			cancel_url: cancelUrl,
			mode: 'payment',
			line_items: products,
		})

		return {
			checkoutUrl: checkoutSession.url ?? '',
		}
	}

	verifyWebhookSignature({ payload, signature, secret }: VerifyWebhookSignature): Stripe.Event {
		try {
			const event = this.stripe.webhooks.constructEvent(JSON.stringify(payload), signature, secret)
			return event
		} catch (err) {
			console.error('Error verifying webhook signature:', err!.message)
			throw new Error('Webhook signature verification failed.')
		}
	}

	generateSignature({ payload }: GenerateSignature): string {
		try {
			const signature = this.stripe.webhooks.generateTestHeaderString({
				payload: JSON.stringify(payload),
				secret: this.env.get('STRIPE_WEBHOOK_SECRET'),
			})
			return signature
		} catch (err) {
			console.error('Error verifying signature:', err!.message)
			throw new Error('Signature.')
		}
	}
}
