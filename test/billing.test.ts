import { test } from "node:test"
import assert from "node:assert/strict"
import { calculateTotals } from "../src/lib/billing/calculate.ts"

const payer = (name: string, prices: number[]) => ({
	name,
	bills: prices.map((price, i) => ({ product: `Item ${i + 1}`, price }))
})

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0)
const peopleSum = (r: ReturnType<typeof calculateTotals>, key: "total" | "service" | "discount") =>
	sum(r.people.map((p) => p[key]))

test("bug 1: subtotal 0 splits evenly instead of NaN", () => {
	const r = calculateTotals([payer("A", [0]), payer("B", [0])], undefined, undefined)
	assert.equal(r.subtotal, 0)
	assert.deepEqual(
		r.people.map((p) => p.total),
		[0, 0]
	)
	assert.ok(r.people.every((p) => Number.isFinite(p.total)))
	assert.deepEqual(
		r.people.map((p) => p.subTotal),
		[0, 0]
	)
})

test("bug 2: per-person totals sum exactly to the grand total", () => {
	const cases = [
		{ payers: [payer("A", [66666]), payer("B", [66667]), payer("C", [66667])], service: 10000 },
		{ payers: [payer("A", [33333]), payer("B", [33333]), payer("C", [33334])], service: 0 },
		{ payers: [payer("A", [1]), payer("B", [1]), payer("C", [1])], service: 0 },
		{ payers: [payer("A", [100000]), payer("B", [1])], service: 15000 }
	]

	for (const { payers, service } of cases) {
		const r = calculateTotals(payers, 0, service)
		assert.equal(
			peopleSum(r, "total"),
			r.grandTotal,
			`total mismatch for ${JSON.stringify(payers)}`
		)
		assert.equal(peopleSum(r, "service"), r.service)
	}
})

test("bug 2: fee and discount slices are whole IDR and sum exactly", () => {
	const r = calculateTotals(
		[payer("A", [33333]), payer("B", [33333]), payer("C", [33334])],
		10000,
		10000
	)
	assert.equal(peopleSum(r, "service"), 10000)
	assert.equal(peopleSum(r, "discount"), -10000)
	assert.ok(r.people.every((p) => Number.isInteger(p.service) && Number.isInteger(p.discount)))
})

test("bug 3: discount is clamped to the subtotal, never negative total", () => {
	const r = calculateTotals([payer("A", [50000]), payer("B", [50000])], 200000, 0)
	assert.equal(r.subtotal, 100000)
	assert.equal(r.grandTotal, 0)
	assert.ok(r.people.every((p) => p.total >= 0))
})

test("bug 4: negative prices are treated as zero", () => {
	const r = calculateTotals([payer("A", [-5000]), payer("B", [20000])], 0, 0)
	assert.equal(r.subtotal, 20000)
	assert.equal(r.people[0].total, 0)
	assert.equal(peopleSum(r, "total"), r.grandTotal)
})

test("bug 5: blank inputs do not render as negative zero", () => {
	const r = calculateTotals([payer("A", [10000])], undefined, undefined)
	assert.equal(r.discount, 0)
	assert.ok(!Object.is(r.discount, -0))
	assert.equal(r.grandTotal, 10000)
})

test("discount slices are never positive on the receipt", () => {
	const r = calculateTotals([payer("A", [66666]), payer("B", [66667])], 10000, 0)
	assert.ok(r.people.every((p) => p.discount <= 0))
})

test("an all-zero bill renders no negative zero anywhere", () => {
	const r = calculateTotals([payer("A", [0]), payer("B", [0])], 5000, 5000)
	for (const value of [r.discount, r.grandTotal, ...r.people.map((p) => p.discount)]) {
		assert.ok(!Object.is(value, -0), `got -0 from ${JSON.stringify(value)}`)
	}
})
