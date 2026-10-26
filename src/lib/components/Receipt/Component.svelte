<script lang="ts">
	import { biling } from "$lib/store"
	import { calculateTotals } from "$lib/billing/calculate"
	import SaveToClipboard from "@component/SaveToClipboard"
	import { Input } from "@component/ui/input"
	import { onMount } from "svelte"

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

	const IdrFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: 0
	})

	const totals = $derived(calculateTotals($biling, discount, services))
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
					<td class="text-right">{IdrFormat.format(totals.grandTotal)}</td>
				</tr>
				<tr>
					<td class="text-left">Subtotal</td>
					<td class="text-right">{IdrFormat.format(totals.subtotal)}</td>
				</tr>
				<tr>
					<td class="text-left">Service Fee</td>
					<td class="text-right">{IdrFormat.format(totals.service)}</td>
				</tr>
				<tr>
					<td class="text-left">Discounts 🎉</td>
					<td class="text-right text-green-600">{IdrFormat.format(-totals.discount || 0)}</td>
				</tr>
			</tbody>
		</table>

		<div class="my-3 flex items-center md:my-5">
			<hr class="flex-grow border-t-4" />
			<span class="px-3 text-sm text-zinc-400">Details</span>
			<hr class="flex-grow border-t-4" />
		</div>

		<div class="w-full px-2 md:px-5">
			{#each totals.people as people, id}
				<table class="w-full table-auto border-spacing-y-3">
					<tbody class="text-sm">
						<tr class="pb-5 text-lg font-bold">
							<td class="text-left text-ellipsis overflow-hidden max-w-min">{people.name}</td>
							<td class="text-right">
								{IdrFormat.format(people.total)}
							</td>
						</tr>
						{#each people.items as bill}
							<tr>
								<td class="text-left">{bill.product}</td>
								<td class="text-right">{IdrFormat.format(bill.price)}</td>
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
							<td class="text-right">{IdrFormat.format(people.subTotal)}</td>
						</tr>
						<tr class="text-muted-foreground text-sm">
							<td class="text-left">Service</td>
							<td class="text-right">{IdrFormat.format(people.service)}</td>
						</tr>
						<tr class="text-muted-foreground text-sm">
							<td class="text-left">Discount</td>
							<td class="text-right text-green-600">{IdrFormat.format(people.discount)}</td>
						</tr>
					</tbody>
				</table>
				{#if id !== totals.people.length - 1}
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
