<script lang="ts">
	import { pb } from '@/pocketbase';

	export let showModal: boolean; // boolean
	export let followingList: string | any[];
	console.log(followingList);
	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="max-h-96 w-3/4 bg-custom-gray p-4"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#each followingList as following}
		<a href={`/chat/${following.id}`}>
			<div class="my-1 flex w-full items-center rounded-md bg-dark-gray p-3">
				<img
					src={pb.getFileUrl(following, following.avatar)}
					alt="profile"
					class="mx-4 h-10 w-10 rounded-full object-cover"
				/>
				<h1 class="text-2xl font-bold text-white">{following.name}</h1>
			</div>
		</a>
	{/each}
	<!-- svelte-ignore a11y-autofocus -->
</dialog>
