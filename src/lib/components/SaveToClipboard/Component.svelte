<script lang="ts">
	import MdiCamera from "~icons/mdi/camera"

	import domtoimage from "dom-to-image"
	import { toast } from "svelte-sonner"

	const onSave = async () => {
		const node = document.getElementById("receipt")
		if (node) {
			const blob = await domtoimage.toBlob(node)
			navigator.clipboard.write([
				new ClipboardItem({
					"image/png": blob
				})
			])
			toast("Receipt copied to clipboard", {})
		}
	}
</script>

<div class="flex justify-center">
	<button
		id="save"
		class="animate-shimmer mx-auto mt-5 inline-flex h-10 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(120deg,#18181b,45%,#728bad,55%,#18181b)] bg-[length:200%_100%] px-4 font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
		onclick={onSave}
	>
		<MdiCamera class="mr-3" />
		Copy Bill
	</button>
</div>

<style scoped>
	@keyframes shimmer {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	#save {
		animation: shimmer 2s linear infinite;
	}
</style>
