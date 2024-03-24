<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { page } from '$app/stores';
	import Modal from '@/components/ui/Modal.svelte';
	import { pb, currentUser } from '@/pocketbase';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	let userData: RecordModel;
	let showModal: boolean;
	let modalProps: any = { title: 'loading', file: 'loading', description: 'loading', likes: [] };
	let posts: any[] = [];
	let following: boolean;

	onMount(async () => {
		const user = await pb.collection('users').getOne($page.params.user);
		userData = user;
		if (userData.followers.includes($currentUser?.id)) {
			following = true;
		}
		const userid = userData.id;
		posts = await pb.collection('posts').getFullList({
			filter: `user="${userid}"`
		});
	});
</script>

{#if userData != null}
	<div class="my-5 flex items-center justify-center md:my-14">
		<div class="flex w-full items-center justify-around py-12 md:w-3/4">
			<div class="text-white">
				<h1 class="my-4 text-3xl font-bold md:text-6xl">{userData?.name}</h1>
				{#if userData?.bio !== ''}
					<h2 class="text-lg md:text-2xl">{userData?.bio}</h2>
				{:else}
					<h1>No bio yet</h1>
				{/if}
				<h1 class="my-2 text-2xl font-bold">{userData.followers.length} Followers</h1>

				{#if following}
					<button
						on:click={async () => {
							following = false;
							userData.followers.length--;
							await pb.collection('users').update(userData.id, {
								'followers-': $currentUser?.id
							});
							await pb.collection('users').update($currentUser?.id, {
								'following-': userData.id
							});
						}}
						class="my-4 rounded-md border-none bg-green-500 px-4 py-2">Following</button
					>
				{:else}
					<button
						on:click={async () => {
							following = true;
							userData.followers.length++;
							await pb.collection('users').update(userData.id, {
								'followers+': $currentUser?.id
							});
							await pb.collection('users').update($currentUser?.id, {
								'following+': userData.id
							});
						}}
						class="my-4 rounded-md border-none bg-custom-gray px-4 py-2">Follow</button
					>
				{/if}
			</div>
			<div class="relative">
				{#if userData?.avatar !== ''}
					<img
						src={pb.files.getUrl(userData, userData.avatar)}
						class="h-28 w-28 rounded-full bg-white object-cover md:h-36 md:w-36"
						alt="profile"
					/>
				{:else}
					<h1>hi</h1>
				{/if}
			</div>
		</div>
	</div>
{/if}

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
