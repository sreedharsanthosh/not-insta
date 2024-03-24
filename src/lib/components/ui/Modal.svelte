<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '@/pocketbase';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { PlusSolid, TrashCanSolid, HeartSolid, CircleArrowUpSolid } from 'svelte-awesome-icons';

	export let propValue: any = { likes: ['hi'] };
	export let showModal: any;
	let dialogue: HTMLDialogElement;
	let likes: number = 0;
	let comments: RecordModel[] = [];
	let newcomment: any;
	let loading = true;
	let liked: boolean;
	let post: {
		[x: string]: any;
		file?: any;
		title?: any;
		description?: any;
		id?: any;
		likes?: any;
		user?: any;
	};

	onMount(async () => {
		const result = await pb.collection('posts').getOne(propValue);
		post = result;
		likes = post.likes.length;
		loading = false;
		liked = post.likes.includes($currentUser?.id);
	});

	$: if (dialogue && showModal) dialogue.showModal();

	const getLikesAndComments = async () => {
		const items = await pb.collection('comments').getList(1, 30, {
			filter: `post="${propValue}"`,
			expand: 'user'
		});
		comments = items.items;
	};

	$: showModal, getLikesAndComments();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class=" w-full bg-dark-gray p-0 text-white lg:h-5/6 lg:w-3/4 xl:w-3/5"
	bind:this={dialogue}
	on:close={() => (showModal = false)}
	on:click|self={(e) => {
		dialogue.close();
	}}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#if loading}
		<div class="grid h-full w-full place-items-center">
			<Jumper size="100" color="#ffffff" unit="px" duration="1s" />
		</div>
	{:else}
		<div on:click|stopPropagation class="flex h-full flex-col items-center md:flex-row">
			<!-- svelte-ignore a11y-autofocus -->
			<button autofocus on:click={() => dialogue.close()} class="absolute right-2 top-2 rotate-45"
				><PlusSolid /></button
			>
			<div class="flex h-full w-full flex-col items-center justify-between sm:flex-row">
				<img
					on:dblclick={async () => {
						if (liked) {
							liked = false;
							likes--;
							await pb.collection('posts').update(post.id, { 'likes-': $currentUser?.id });
						} else {
							likes++;
							liked = true;
							await pb.collection('posts').update(post.id, { 'likes+': $currentUser?.id });
						}
					}}
					src={pb.files.getUrl(post, post?.file)}
					alt="post"
					class="image h-full w-1/2 object-contain"
				/>

				<div class="flex h-96 w-full flex-col justify-around px-4 md:w-1/2 lg:h-full">
					<h1 class="my-2 text-2xl">{post?.title}</h1>
					<h2>{post?.description}</h2>
					<hr />
					<div class="relative h-3/4">
						{#key comments}
							<h3 class="font-bold">All comments</h3>
							<ul class="no-scrollbar comments relative my-2 h-5/6 overflow-y-scroll">
								{#if comments.length !== 0}
									{#each comments as comment}
										<div class=" flex flex-col items-start">
											<h6 class="font-bold">{comment.expand?.user.name}:</h6>
											<li class="mx-5">{comment.comment}</li>
										</div>
									{/each}
								{/if}
							</ul>
							<form
								class="absolute bottom-2 flex w-full items-center justify-around"
								on:submit|preventDefault={async () => {
									const data = {
										comment: newcomment,
										user: $currentUser?.id,
										post: post?.id
									};
									await pb
										.collection('comments')
										.create(data)
										.then((res) => console.log(res));
									// dialogue.close();
									getLikesAndComments();
									newcomment = '';
								}}
							>
								<input
									bind:value={newcomment}
									class="mx-2 w-5/6 rounded-md border-none bg-custom-gray p-3"
									type="comment"
								/>
								<button class="grid h-auto place-items-center rounded-full bg-custom-gray p-3"
									><CircleArrowUpSolid /> <button> </button></button
								>
							</form>
						{/key}
					</div>
					<hr />
					<div class="my-2 flex">
						{#if liked}
							<button
								on:click={async () => {
									likes--;
									liked = false;
									await pb.collection('posts').update(post.id, { 'likes-': $currentUser?.id });
									console.log('Unliked');
								}}
							>
								<HeartSolid color="#ff0000" class="mx-2" />
							</button>
						{:else}
							<button
								on:click={async () => {
									likes++;
									liked = true;
									await pb.collection('posts').update(post.id, { 'likes+': $currentUser?.id });
									console.log('liked');
								}}
							>
								<HeartSolid color="#ffffff" class="mx-2" />
							</button>
						{/if}
						<h1 class="mx-2">{likes} likes</h1>
					</div>
					{#if post?.user === $currentUser?.id}
						<button
							class="my-2 w-14 rounded-md border-none bg-red-500 px-4 py-2"
							on:click={() => {
								goto(`/deletePost/${post?.id}`);
							}}><TrashCanSolid /></button
						>
					{/if}
				</div>
			</div>
			<!-- svelte-ignore a11y-autofocus -->
		</div>
	{/if}
</dialog>
