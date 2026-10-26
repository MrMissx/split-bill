import type { BillingSchema } from "$lib/store"

export interface PersonTotal {
	name: string
	items: { product: string; price: number }[]
	subTotal: number
	discount: number
	service: number
	total: number
}

export interface BillingTotals {
	discount: number
	subtotal: number
	service: number
	grandTotal: number
	people: PersonTotal[]
}

const sumItems = (bills: BillingSchema["bills"]): number =>
	bills.reduce((acc, bill) => acc + Math.max(bill.price ?? 0, 0), 0)

// ponytail: largest remainder allocator. Keeps whole-IDR amounts summing exactly to
// `total`. Ceiling: O(n log n) per call, fine for a bill. Upgrade path: none needed.
const allocate = (total: number, weights: number[]): number[] => {
	const sum = weights.reduce((acc, weight) => acc + weight, 0)
	if (sum <= 0) return weights.map(() => 0)

	const floors = weights.map((weight) => Math.floor((total * weight) / sum))
	const remainder = Math.round(total - floors.reduce((acc, value) => acc + value, 0))
	const order = weights
		.map((weight, index) => ({ index, frac: (total * weight) / sum - floors[index] }))
		.sort((a, b) => b.frac - a.frac)
		.slice(0, Math.max(remainder, 0))

	for (const { index } of order) floors[index] += 1
	return floors
}

export const calculateTotals = (
	payers: BillingSchema[],
	discountInput: number | undefined,
	serviceInput: number | undefined
): BillingTotals => {
	const subtotal = payers.reduce((acc, payer) => acc + sumItems(payer.bills), 0)
	// Clamp: a discount can never push the grand total below zero, and blank input is not -0.
	const discount = Math.min(Math.abs(discountInput || 0), subtotal)
	const service = Math.abs(serviceInput || 0)
	const grandTotal = subtotal - discount + service

	// Subtotal 0 means every payer weighs the same instead of dividing by zero.
	const personSubtotals = payers.map((payer) => sumItems(payer.bills))
	const weights = subtotal > 0 ? personSubtotals : payers.map(() => 1)

	const discountShares = allocate(discount, weights)
	const serviceShares = allocate(service, weights)
	const totalShares = allocate(grandTotal, weights)

	return {
		discount,
		subtotal,
		service,
		grandTotal,
		people: payers.map((payer, index) => ({
			name: payer.name,
			items: payer.bills.map((bill) => ({
				product: bill.product,
				price: Math.max(bill.price ?? 0, 0)
			})),
			subTotal: personSubtotals[index],
			// `|| 0` normalises -0, which Intl.NumberFormat renders as "-Rp 0".
			discount: -discountShares[index] || 0,
			service: serviceShares[index],
			total: totalShares[index]
		}))
	}
}
