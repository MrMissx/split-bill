<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements"
	import type { InputEvents } from "./index.js"
	import { cn } from "$lib/utils.js"

	type $$Props = HTMLInputAttributes & {
		startAdornment?: string | null
		endAdornment?: string | null
	}
	type $$Events = InputEvents

	let className: $$Props["class"] = undefined
	export let value: $$Props["value"] = undefined
	export { className as class }
	export let startAdornment: $$Props["startAdornment"] = null
	export let endAdornment: $$Props["endAdornment"] = null

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props["readonly"] = undefined
</script>

<div
	class={cn(
		"flex h-10 w-full items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
>
	{#if startAdornment}
		<span class="pl-3 text-sm text-muted-foreground">
			{startAdornment}
		</span>
	{/if}
	<input
		class="flex-1 bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:mousemove
		on:paste
		on:input
		on:wheel|passive
		{...$$restProps}
	/>
	{#if endAdornment}
		<span class="pr-3 text-sm text-muted-foreground">
			{endAdornment}
		</span>
	{/if}
</div>
