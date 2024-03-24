<script lang="ts">
	import { HeartSolid } from 'svelte-awesome-icons';
	import Modal from '@/components/ui/Modal.svelte';
	import { currentUser, pb } from '@/pocketbase';

	export let img: any;
	export let likes: number;
	export let liked: boolean;
	export let title: string;
	export let description: string;
	export let post: string;
	let modalProps: string;

	let showModal = false;

	console.log(liked, title);
</script>

<div
	class="m-5 flex w-5/6 flex-col items-center justify-center rounded-lg border-2 border-custom-gray p-4 md:w-1/2"
>
	<img
		src={img}
		alt="post"
		on:dblclick={async () => {
			if (liked) {
				liked = false;
				likes--;
				await pb.collection('posts').update(post, { 'likes-': $currentUser?.id });
			} else {
				likes++;
				liked = true;
				await pb.collection('posts').update(post, { 'likes+': $currentUser?.id });
			}
		}}
	/>
	<span class="my-4 flex w-full">
		{#if liked}
			<button
				on:click={async () => {
					likes--;
					liked = false;
					await pb.collection('posts').update(post, { 'likes-': $currentUser?.id });
					console.log('Unliked');
				}}
			>
				<HeartSolid color="#ff0000" class="mx-4" />
			</button>
		{:else}
			<button
				on:click={async () => {
					likes++;
					liked = true;
					await pb.collection('posts').update(post, { 'likes+': $currentUser?.id });
					console.log('liked');
				}}
			>
				<HeartSolid color="#ffffff" class="mx-4" />
			</button>
		{/if}
		{likes} likes</span
	>
	<div class="w-full p-4">
		<h1 class="text-2xl font-bold">{title}</h1>
		<h1 class="my-2">{description}</h1>
	</div>
	<button
		class="bg-transparent p-1"
		on:click={() => {
			showModal = true;
			modalProps = post;
		}}>Show comments</button
	>
</div>

{#if showModal == true}
	<Modal propValue={modalProps} bind:showModal></Modal>
{/if}
