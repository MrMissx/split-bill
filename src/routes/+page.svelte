<script lang="ts">
	import { Input } from "$lib/components/ui/input"
	import { Button } from "@component/ui/button"
	import MdiPerson from "~icons/mdi/person"
	import MdiBasket from "~icons/mdi/basket"
	import MdiTrashCanOutline from "~icons/mdi/trash-can-outline"
	import MdiAdd from "~icons/mdi/add"
	import MdiDiscount from "~icons/mdi/discount"
	import MdiDeliveryDining from "~icons/mdi/delivery-dining"
	import MdiPersonOff from "~icons/mdi/person-off"

	import Receipt from "@component/Receipt"
	import { biling } from "$lib/store"

	let discount: number | undefined = $state(0)
	let services: number | undefined = $state(0)
</script>

<div
	class="container mx-auto flex flex-col space-y-20 py-10 sm:px-6 md:flex-row md:space-y-0 lg:px-8"
>
	<section class="w-full space-y-5">
		{#each $biling as payer, i}
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<div class="flex items-center gap-[0.640rem]">
					<MdiPerson class="h-8 w-8" />
					<div class="flex w-full gap-1.5">
						<Input type="name" id="name" placeholder="John Doe" bind:value={$biling[i].name} />
						<Button
							variant="destructive"
							class="w-[3.2rem]"
							size="icon"
							onclick={() => biling.removePayer(i)}
						>
							<MdiPersonOff class="h-5 w-8" />
						</Button>
					</div>
				</div>

				<div class="flex items-start gap-3">
					<MdiBasket class="h-7 w-7" />
					<div class="w-full space-y-3">
						{#each payer.bills as _, billIndex}
							<div class="flex items-center gap-1.5">
								<div class="flex-grow space-y-1">
									<Input
										type="text"
										id="item"
										placeholder={`Item ${billIndex + 1}`}
										bind:value={$biling[i].bills[billIndex].product}
									/>
									<Input
										type="number"
										id="price"
										placeholder="Rp. 69000"
										bind:value={$biling[i].bills[billIndex].price}
									/>
								</div>
								<Button
									variant="destructive"
									size="icon"
									disabled={payer.bills.length === 1}
									onclick={() => {
										biling.removeItem(i, billIndex)
									}}
								>
									<MdiTrashCanOutline class="h-4 w-4" />
								</Button>
							</div>
						{/each}
						<Button
							size="sm"
							class="w-full"
							onclick={() => {
								biling.addItem(i)
							}}
						>
							<MdiAdd class="h-4 w-4" />
						</Button>
						<div
							data-orientation="horizontal"
							role="none"
							class="h-[1.5px] w-full shrink-0 bg-border"
						></div>
					</div>
				</div>
			</div>
		{/each}
		<Button onclick={biling.addPayer}>Add Person</Button>

		<div data-orientation="horizontal" role="none" class="h-[2px] w-full shrink-0 bg-border"></div>

		<div class="flex w-full max-w-sm flex-col gap-1.5 space-y-2">
			<div class="flex items-center gap-3">
				<MdiDiscount class="h-8 w-8" />
				<Input type="number" id="discount" placeholder="Rp. -25000" bind:value={discount} />
			</div>
			<div class="flex items-center gap-3">
				<MdiDeliveryDining class="h-8 w-8" />
				<Input type="number" id="services" placeholder="Services Fee" bind:value={services} />
			</div>
		</div>
	</section>
	<section class="w-full md:px-5">
		<Receipt {discount} {services} />
	</section>
</div>
