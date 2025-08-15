import { FakeStoreProduct } from 'test/store/fake-store'
import { GetUserSessionUseCase } from './get-user-session'
import { beforeEach, describe, expect, it } from 'vitest'

let storeProduct: FakeStoreProduct
let sut: GetUserSessionUseCase

describe('Get User Session Use Case', () => {
	beforeEach(() => {
		storeProduct = new FakeStoreProduct()
		sut = new GetUserSessionUseCase(storeProduct)
	})

	it('should receive user session', async () => {
		const result = await sut.execute({
			sessionId: 'session',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.session).toMatchObject({
			customerName: 'customer_test',
		})
	})
})
