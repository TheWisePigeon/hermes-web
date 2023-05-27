<script lang="ts">
	import Spinner from '../components/Spinner.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	onMount(() => {
		if (browser) {
			const saved_auth_state = localStorage.getItem('auth_stage') ?? '';
			if (saved_auth_state === 'Login') {
				auth_stage = saved_auth_state;
				email = localStorage.getItem('cached_mail')!;
				code_sent = true;
				return;
			}
			auth_stage = 'Get Code';
		}
	});
    console.log(import.meta.env.VITE_APP_ID)
	let email: string;
	let code = '';
	let loading = false;
	let code_sent: boolean;
	let auth_stage: 'Get Code' | 'Login';
	let auth_codes_sent_in_a_row: number;
	let error_message = '';

	async function authenticate() {
		error_message = '';
		loading = true;
		try {
			if (email === '') {
				error_message = 'Email is required';
				loading = false;
				return;
			}
			if (auth_stage === 'Get Code') {
				const response = await fetch('http://127.0.0.1:5000/v1/request', {
					headers: {
						'x-hermes-auth': import.meta.env.VITE_HERMES_AUTH,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						target: email,
						app_id: import.meta.env.VITE_APP_ID,
						subject: 'Your Hermes authentication code'
					}),
					method: 'POST'
				});
				if (response.status === 200) {
					loading = false;
					code_sent = true;
					localStorage.setItem('auth_stage', 'Login');
					localStorage.setItem('cached_mail', email);
					auth_stage = 'Login';
					return;
				}
				if (response.status === 500) {
					loading = false;
					error_message = 'Something went wrong. Please retry or contact the developer';
				}
			}
			if (auth_stage === 'Login') {
				if (code === '' || email === '') {
					error_message = 'Email and Code are required';
					loading = false;
					return;
				}
				const response = await fetch('http://127.0.0.1:5000/v1/verify', {
					headers: {
						'x-hermes-auth': '888a4d17-005b-4df2-ab75-3681e03226b3',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						app_id: 'f161bf0f-52a5-47ba-bfec-73a5693e1eb2',
						user: email,
						code: code
					}),
					method: 'POST'
				});
				if (response.status === 200) {
					const { token } = await fetch('http://127.0.0.1:5000/auth', {
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						body: JSON.stringify({ email })
					}).then(async (res) => (await res.json()) as { token: string });
					localStorage.setItem('auth_token', token);
					goto('/console');
				}
				if (response.status === 400) {
					loading = false;
					error_message = 'Invalid code';
					return;
				}
				if (response.status === 500) {
					loading = false;
					error_message = 'Something went wrong. Please retry or contact the developer';
					return;
				}
			}
		} catch (err) {
			loading = false;
			error_message = 'Something went wrong. Please retry or contact the developer';
			console.error(`Error while authenticating user ${err}`);
		}
	}
	async function get_new_code() {
		loading = true;
		code_sent = false;
		const response = await fetch('http://127.0.0.1:5000/v1/request', {
			headers: {
				'x-hermes-auth': '888a4d17-005b-4df2-ab75-3681e03226b3',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				target: email,
				app_id: 'f161bf0f-52a5-47ba-bfec-73a5693e1eb2',
				subject: 'Your Hermes authentication code'
			}),
			method: 'POST'
		});
		if (response.status === 200) {
			code_sent = true;
			loading = false;
			return;
		}
		error_message = 'Something went wrong. Please retry or contact the developer';
	}
</script>

<header class="absolute flex justify-between w-full top-0 p-2 items-baseline">
	<a href="/" class="text-2xl font-bold">HERMES</a>
	<div class="flex gap-3">
		<a href="/docs" class="underline">Docs</a>
		<a href="https://github.com/TheWisePigeon/hermes" target="_blank" class="underline">GitHub</a>
	</div>
</header>

<div class="h-screen w-full flex flex-col items-center justify-center">
	<div class="flex flex-col gap-5">
		<h1 class=" text-4xl font-bold m-auto text-center">Seamless Passwordless Authentication</h1>
		<h1 class="text-center">
			Passwordless authentication made easy. Simplify verification, enhance security, and enjoy
			seamless user experience with our user friendly API.
		</h1>
		<form
			on:submit|preventDefault={authenticate}
			class="mt-10 flex flex-col justify-center w-[80%] m-auto gap-3"
		>
			<input
				class="rounded-md p-2 focus:outline-none text-gray-900 text-center"
				type="email"
				placeholder="Your email address"
				bind:value={email}
			/>
			{#if code_sent}
				<input
					class="rounded-md p-2 focus:outline-none text-gray-900 text-center"
					type="text"
					placeholder="Your auth code"
					bind:value={code}
				/>
			{/if}
			<span class="text-red-600 text-xs text-center">{error_message}</span>
			<button
				disabled={loading}
				class="flex justify-center p-2 rounded-md text-white bg-gray-900 font-bold"
			>
				{#if !loading}
					<h1>{auth_stage}</h1>
				{:else}
					<Spinner />
				{/if}
			</button>
			{#if code_sent}
				<button disabled={loading} type="button" on:click={get_new_code} class="text-blue-500 underline">
					<h1>Get a new code</h1>
				</button>
			{/if}
		</form>
	</div>
</div>
