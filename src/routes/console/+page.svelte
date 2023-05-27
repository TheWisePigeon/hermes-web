<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Copy from '../../components/Copy.svelte';
	import Trash from '../../components/Trash.svelte';

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('auth_token') ?? '';
			if (token === '') {
				goto('/');
			}
			const data = await fetch('http://127.0.0.1:5000/app', {
				headers: {
					Authorization: token
				}
			})
				.then(
					async (res) =>
						(await res.json()) as {
							id: string;
							name: string;
							active: boolean;
							codes_ttl: string;
							owner: string;
						}[]
				)
				.catch((err) => {
					throw new Error('FETCH_ERR');
				});
			apps = data;
		}
	});

	let apps: { id: string; name: string; active: boolean; codes_ttl: string; owner: string }[];
</script>

<div class="w-full h-full">
	<header class="flex gap-1 w-full justify-center items-center text-xs">
		<h1 class="text-center">You are using Hermes technical preview</h1>
		<a class="text-blue-500" href="/docs#technical">Learn more</a>
	</header>
	<div class="mt-10 border-b w-full flex gap-2 items-baseline p-2">
		<button class="bg-gray-900 p-2 rounded-2xl">New app { apps ? `${apps.length}/5`:''  } </button>
		<button class="bg-gray-900 p-2 rounded-2xl">Profile info</button>
	</div>

	<div class="flex flex-col">
		<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
				<div class="overflow-hidden">
					<table class="min-w-full text-left text-sm font-light">
						<thead class="border-b font-medium dark:border-neutral-500">
							<tr>
								<th scope="col" class="px-6 py-4">Name</th>
								<th scope="col" class="px-6 py-4">State</th>
								<th scope="col" class="px-6 py-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#if apps !== undefined}
								{#each apps as app}
									<tr class="border-b dark:border-neutral-500">
										<td class="whitespace-nowrap px-6 py-4">{app.name}</td>
										<td class="whitespace-nowrap px-6 py-4">{app.active}</td>
										<td class="whitespace-nowrap px-6 py-4 flex gap-2">
											<button on:click={()=>{ navigator.clipboard.writeText(app.id)  }}  title="Copy id">
												<Copy />
											</button>
											<button title="Permanently delete">
												<Trash />
											</button>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
