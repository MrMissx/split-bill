<script lang="ts">
	import { Toaster } from "@component/ui/sonner"
	import "../app.css"
	import Footer from "@layouts/Footer"
	import Header from "@layouts/Header"

	const { children } = $props()
</script>

<svelte:head>
	<title>SplitBill</title>
	<meta
		name="description"
		content="SplitBill is a simple web app to split bills fairly to your friends"
	/>
	<meta name="keywords" content="split, bill, splitbill, friends, share, money" />
	<meta name="author" content="mrmiss" />
	<meta name="theme-color" content="#fff" />

	<link rel="canonical" href="https://splitbill.mrmiss.dev" />
</svelte:head>
<Toaster />
<Header />
<div id="content">
	<main class="container mx-auto min-h-[calc(100vh-8rem)] max-w-[60rem]">
		{@render children()}
	</main>
</div>
<Footer />

<style>
	#content {
		background-image: radial-gradient(#ddd 1px, transparent 1px),
			radial-gradient(#ddd 1px, transparent 1px);
		background-position:
			0 0,
			25px 25px;
		background-attachment: fixed;
		background-size: 50px 50px;
	}
</style>
