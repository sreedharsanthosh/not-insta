<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import { MagnifyingGlassSolid } from 'svelte-awesome-icons';
	import { pb } from '@/pocketbase';
	import { goto } from '$app/navigation';

	let searchQuery: string;
	let users: RecordModel[] = [];

	const search = async () => {
		const resultList = await pb.collection('users').getList(1, 20, {
			filter: pb.filter('username ~ {:search}', { search: searchQuery })
		});
		users = resultList.items;
	};
</script>

<div class="relative flex w-full items-center justify-center">
	<form
		action="post"
		on:submit|preventDefault={search}
		class="absolute top-5 flex w-full items-center justify-center"
	>
		<input
			type="text"
			bind:value={searchQuery}
			class="mx-2 w-3/4 rounded-md border-none bg-custom-gray p-4 text-2xl text-white"
		/>
		<button class="mx-2 grid h-14 w-14 place-items-center rounded-full bg-custom-gray text-white"
			><MagnifyingGlassSolid /></button
		>
	</form>
	<div
		class="absolute top-24 flex w-screen flex-col items-center justify-center p-5 text-white md:w-3/4"
	>
		{#each users as user}
			<button on:click={() => goto(`/user/${user.id}`)} class="w-full">
				<div class="flex w-full items-center justify-start rounded-md bg-custom-gray p-4">
					<img
						class="mx-4 h-12 w-12 rounded-full object-cover md:mx-10"
						src={pb.files.getUrl(user, user.avatar)}
						alt="profile"
					/>
					<h1 class="text-bold text-xl md:text-2xl lg:text-3xl">{user.name}</h1>
				</div>
			</button>
		{/each}
	</div>
</div>
