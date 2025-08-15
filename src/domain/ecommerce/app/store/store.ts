import type { Optional } from '@/core/types/optional'
import type Stripe from 'stripe'

export interface StoreProduct {
	id: string
	sessionId?: string
	name: string
	description: string
	price: number
	priceId: string
	imageUrl?: string
}

export interface Session {
	customerName: string
	products: Partial<StoreProduct>[]
}

export interface Checkout {
	price: string
	quantity: number
}

export interface VerifyWebhookSignature {
	payload: Buffer
	signature: string
	secret: string
}

export interface GenerateSignature {
	payload: {
		id: string
		type: string
		data: {
			object: Record<string, string | number>
		}
	}
}

export abstract class StoreProducts {
	abstract findById(id: string): Promise<StoreProduct | null>
	abstract findMany(): Promise<StoreProduct[]>
	abstract findManyBySessionId(sessionId: string): Promise<Session>
	abstract create(product: Optional<StoreProduct, 'id' | 'priceId'>): Promise<{ id: string }>
	abstract save(product: Optional<StoreProduct, 'priceId'>): Promise<void>
	abstract delete(id: string): Promise<void>
	abstract checkout(products: Checkout[]): Promise<{
		checkoutUrl: string
	}>
	abstract verifyWebhookSignature({
		payload,
		signature,
		secret,
	}: VerifyWebhookSignature): Stripe.Event
	abstract generateSignature({ payload }: GenerateSignature): string
}
