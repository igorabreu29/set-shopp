import type { Optional } from '@/core/types/optional.ts'

export interface StoreProduct {
	id: string
	name: string
	description: string
	price: number
	imageUrl?: string
}

export interface StoreProducts {
	getById(id: string): Promise<StoreProduct | null>
	fetch(): Promise<StoreProduct[]>
	create(product: Optional<StoreProduct, 'id'>): Promise<void>
}
