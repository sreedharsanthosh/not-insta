<script lang="ts">
	import { pb, currentUser } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import PostContainer from '@/components/ui/PostContainer.svelte';
	import { Moon } from 'svelte-loading-spinners';

	let posts: any[] = [];
	let loading = true;
	let hasFollowing: boolean;
	let liked;

	onMount(async () => {
		if (!$currentUser) {
			goto('/login');
		}

		getPosts();
	});

	const getPosts = async () => {
		const following = $currentUser?.following;
		if (following.length !== 0) {
			const res = await pb.collection('posts').getList(1, 50, {
				filter: following.map((id: any) => `user="${id}"`).join('||'),
				expand: 'user',
				sort: '-created'
			});
			hasFollowing = true;
			posts = res.items;
			loading = false;
		} else {
			loading = false;
			hasFollowing = false;
		}
	};
</script>

<div class="flex flex-col items-center justify-center text-white">
	{#if loading}
		<div class="flex h-screen w-screen items-center justify-center">
			<Moon color="#ffffff" size="100" />
		</div>
	{:else if hasFollowing}
		{#each posts as post}
			<PostContainer
				img={pb.getFileUrl(post, post.file)}
				likes={post.likes.length}
				liked={post.likes?.includes($currentUser?.id)}
				title={post.title}
				description={post.description}
				post={post.id}
			/>
		{/each}
	{:else}
		<h1>Follow someone first</h1>
	{/if}
</div>
