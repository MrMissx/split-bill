import { writable, type Writable } from "svelte/store"

type Maybe<T> = T | null | undefined

export interface ItemSchema {
	product: string
	price: Maybe<number>
}

export interface BillingSchema {
	name: string
	bills: ItemSchema[]
}

const billingState: Writable<BillingSchema[]> = writable([])

export const biling = {
	subscribe: billingState.subscribe,
	set: billingState.set,
	update: billingState.update,
	addPayer: () => {
		billingState.update((payers) => [
			...payers,
			{ name: "", bills: [{ product: "Item 1", price: 0 }] }
		])
	},
	removePayer: (index: number) => {
		billingState.update((payers) => {
			const newPayers = [...payers]
			newPayers.splice(index, 1)
			return newPayers
		})
	},

	addItem: (index: number) => {
		billingState.update((payers) => {
			const len = payers[index].bills.length
			const newPayers = [...payers]
			newPayers[index].bills.push({ product: `Item ${len + 1}`, price: 0 })
			return newPayers
		})
	},

	removeItem: (payerIndex: number, billIndex: number) => {
		billingState.update((payers) => {
			const newPayers = [...payers]
			newPayers[payerIndex].bills.splice(billIndex, 1)
			return newPayers
		})
	}
}
