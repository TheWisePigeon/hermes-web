<script>
	import '../app.css';
	import Dialog from '../components/Dialog.svelte';
	import CreateApp from '../components/modals/CreateApp.svelte';
</script>

<main>
	<Dialog />
    <CreateApp />
	<slot />
</main>
