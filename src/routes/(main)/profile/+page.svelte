<script lang="ts">
	import { pb, currentUser } from '@/pocketbase';
	import { PencilSolid } from 'svelte-awesome-icons';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Modal from '@/components/ui/Modal.svelte';
	let showModal = false;
	let modalProps = {
		id: 'loading',
		title: 'loading',
		file: 'loading',
		description: 'loading',
		likes: []
	};

	//@ts-ignore
	const fileurl = pb.files.getUrl($currentUser, $currentUser?.avatar);
	let posts: any[] = [];

	const fetchPosts = async () => {
		const userid = $currentUser?.id;
		posts = await pb.collection('posts').getFullList({
			filter: `user="${userid}"`
		});
	};

	onMount(async () => {
		fetchPosts();
	});
</script>

<div class="my-5 flex items-center justify-center md:my-14">
	<div class="flex w-full items-center justify-around py-12 md:w-3/4">
		<div class="text-white">
			<h1 class="my-4 text-3xl font-bold md:text-6xl">{$currentUser?.name}</h1>
			{#if $currentUser?.bio !== ''}
				<h2 class="text-lg md:text-2xl">{$currentUser?.bio}</h2>
			{:else}
				<h1>No bio yet</h1>
			{/if}
			<div class="flex w-full flex-col md:flex-row">
				<button
					><h1 class="m-2 text-2xl md:m-4">{$currentUser?.followers.length} followers</h1></button
				>
				<button
					><h1 class="m-2 text-2xl md:m-4">{$currentUser?.following.length} following</h1></button
				>
			</div>
		</div>
		<div class="relative">
			{#if $currentUser?.avatar !== ''}
				<img
					src={fileurl}
					class="h-28 w-28 rounded-full bg-white object-cover md:h-36 md:w-36"
					alt="profile"
				/>
			{:else}
				<h1>hi</h1>
			{/if}
			<div class="absolute bottom-16 right-2 grid h-9 w-9 place-items-center rounded-full bg-white">
				<PencilSolid
					color="#000000"
					size="20"
					on:click={() => {
						goto('/editprofile');
					}}
					class="cursor-pointer"
				/>
			</div>
			<button
				on:click={() => {
					pb.authStore.clear();
					goto('/login');
				}}
				class="my-4 rounded-md bg-red-500 px-4 py-2">Sign Out</button
			>
		</div>
	</div>
</div>

<div
	class="flex w-full flex-col flex-wrap items-center justify-center text-white md:my-12 md:px-24"
>
	<h1 class="text-3xl font-bold">Posts</h1>
	<div class="my-10 flex w-full flex-wrap items-center justify-center">
		{#each posts as post}
			<div
				class=" mx-4 my-4 flex h-auto w-3/4 flex-col items-center rounded-md bg-custom-gray p-4 md:my-8 md:w-2/5 lg:w-1/4"
			>
				<button
					on:click={() => {
						showModal = true;
						modalProps = post;
					}}
				>
					<img src={pb.files.getUrl(post, post.file)} alt="post" class="my-2" />
					<h1>{post?.title}</h1>
				</button>
			</div>
		{/each}
	</div>
</div>

{#if showModal == true}
	<Modal propValue={modalProps.id} bind:showModal></Modal>
{/if}
