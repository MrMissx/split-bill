<script lang="ts">
	import { biling } from "$lib/store"
	import SaveToClipboard from "@component/SaveToClipboard"
	import { Button } from "@component/ui/button"
	import { Input } from "@component/ui/input"
	import { onMount } from "svelte"
	import MdiCamera from "~icons/mdi/camera"

	interface Props {
		discount: number | undefined
		services: number | undefined
	}

	const { discount, services }: Props = $props()
	let title = $state()
	let time = $state(new Date())

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date()
		}, 60000)

		return () => {
			clearInterval(interval)
		}
	})

	let trueDiscount = $derived(-Math.abs(discount ?? 0))

	let IdrFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: 0
	})

	let subtotal = $derived.by(() =>
		$biling.reduce((acc, payer) => {
			return (
				acc +
				payer.bills.reduce((acc, bill) => {
					return acc + (bill.price ?? 0)
				}, 0)
			)
		}, 0)
	)
	let grandTotal = $derived.by(() => {
		return subtotal + (services ?? 0) + trueDiscount
	})

	let personTotal = $derived.by(() => {
		return $biling.map((payer) => {
			const personSubTotal = payer.bills.reduce((acc, bill) => acc + (bill.price ?? 0), 0)
			const percentageShare = personSubTotal / subtotal
			return {
				name: payer.name,
				subTotal: personSubTotal,
				discount: trueDiscount * percentageShare,
				service: (services ?? 0) * percentageShare,
				total: grandTotal * percentageShare
			}
		})
	})
</script>

<Input class="mb-5" bind:value={title} placeholder="Input bill title" />
<figure id="receipt" class="overflow-hidden rounded-lg border bg-white p-5 shadow-xl">
	<h1 class="text-center text-3xl font-bold">{title ?? "Receipt"}</h1>
	<p class="w-full text-center text-muted-foreground text-sm">
		{String(time.getHours()).padStart(2, "0")}:{String(time.getMinutes()).padStart(2, "0")}
		{time.toDateString()}
	</p>
	<div
		data-orientation="horizontal"
		role="none"
		class="my-2 h-[3px] w-full shrink-0 bg-border"
	></div>
	<div id="detail">
		<table class="w-full table-auto border-spacing-y-3">
			<tbody>
				<tr class="pb-5 text-xl font-bold">
					<td class="text-left">Total</td>
					<td class="text-right">{IdrFormat.format(grandTotal)}</td>
				</tr>
				<tr>
					<td class="text-left">Subtotal</td>
					<td class="text-right">{IdrFormat.format(subtotal)}</td>
				</tr>
				<tr>
					<td class="text-left">Service Fee</td>
					<td class="text-right">{IdrFormat.format(services ?? 0)}</td>
				</tr>
				<tr>
					<td class="text-left">Discounts 🎉</td>
					<td class="text-right text-green-600">{IdrFormat.format(trueDiscount)}</td>
				</tr>
			</tbody>
		</table>

		<div class="my-3 md:my-5 flex items-center">
			<hr class="flex-grow border-t-4" />
			<span class="px-3 text-sm text-zinc-400">Details</span>
			<hr class="flex-grow border-t-4" />
		</div>

		<div class="w-full px-2 md:px-5">
			{#each personTotal as people, id}
				<table class="w-full table-auto border-spacing-y-3">
					<tbody class="text-sm">
						<tr class="pb-5 text-lg font-bold ">
							<td class="text-left text-ellipsis overflow-hidden max-w-min">{people.name}</td>
							<td class="text-right">
								{IdrFormat.format(people.total || 0)}
							</td>
						</tr>
						<!-- This somehow doesn't reflect the update if was accesed by people object -->
						<!-- {#each people.bills as bill} -->
						{#each $biling[id].bills as bill}
							<tr>
								<td class="text-left">{bill.product}</td>
								<td class="text-right">{IdrFormat.format(bill.price ?? 0)}</td>
							</tr>
						{/each}
						<tr>
							<td colspan="2">
								<div
									data-orientation="horizontal"
									role="none"
									class="my-2 h-[1px] w-full shrink-0 bg-border"
								></div>
							</td>
						</tr>
						<tr class="text-muted-foregroun text-sm">
							<td class="text-left">Subtotal</td>
							<td class="text-right">{IdrFormat.format(people.subTotal ?? 0)}</td>
						</tr>
						<tr class="text-muted-foreground text-sm">
							<td class="text-left">Service</td>
							<td class="text-right">{IdrFormat.format(people.service || 0)}</td>
						</tr>
						<tr class="text-muted-foreground text-sm">
							<td class="text-left">Discount</td>
							<td class="text-right text-green-600">{IdrFormat.format(people.discount || 0)}</td>
						</tr>
					</tbody>
				</table>
				{#if id !== $biling.length - 1}
					<div
						data-orientation="horizontal"
						role="none"
						class="my-2 h-[3px] w-full shrink-0 bg-border"
					></div>
				{/if}
			{/each}
		</div>
	</div>
	<div
		data-orientation="horizontal"
		role="none"
		class="my-5 h-[4px] w-full shrink-0 bg-border"
	></div>
	<figcaption class="text-center text-xs text-muted-foreground">
		Created on SplitBill 💖 (<cite class="underline">https://splitbill.mrmiss.dev</cite>)
	</figcaption>
</figure>
<SaveToClipboard />
