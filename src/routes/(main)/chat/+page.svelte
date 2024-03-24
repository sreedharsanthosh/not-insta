<script lang="ts">
	import { pb, currentUser } from '@/pocketbase';
	import { onMount } from 'svelte';
	import FollowingModal from '@/components/ui/FollowingModal.svelte';

	let messageList: string | any[] = [];
	let followingList: string | any[] = [];

	onMount(async () => {
		const res = await pb
			.collection('users')
			.getOne($currentUser?.id, { expand: 'chats,following' });
		console.log(res);
		if (res.expand?.chats) {
			messageList = res.expand?.chats.reverse();
			followingList = res.expand?.following;
		} else if (res.expand?.following) {
			followingList = res.expand?.following;
			console.log(followingList);
		}
		getLatestMessages();
	});

	const getLatestMessages = async () => {
		const res = await pb.collection('messages').getList(1, 50, {
			filter: `reciever="${$currentUser?.id}"`,
			sort: '-created'
		});
		console.log(res);
		const arr = [1, 2, 3, 4, 5, 4, 4, 2];
	};

	let showModal = false;
</script>

<div>
	{#if messageList.length !== 0}
		<div class="flex flex-col items-center justify-center">
			{#each messageList as chat}
				<a class="flex w-full items-center justify-center" href={`/chat/${chat.id}`}>
					<div class="my-2 flex w-5/6 items-center rounded-md bg-custom-gray p-6 md:w-1/2">
						<img
							src={pb.getFileUrl(chat, chat.avatar)}
							alt="profile"
							class="mx-4 h-10 w-10 rounded-full object-cover"
						/>
						<h1 class="text-2xl font-bold text-white">{chat.name}</h1>
					</div>
				</a>
			{/each}
			<button
				class="my-4 font-bold text-blue-400"
				on:click={() => {
					showModal = true;
					console.log('Show');
				}}
				>Start a chat
			</button>
			<FollowingModal bind:showModal {followingList} />
		</div>
	{:else}
		<div class="flex h-screen w-screen items-center justify-center">
			<button
				class=" my-4 flex font-bold text-blue-400"
				on:click={() => {
					showModal = true;
					console.log('Show');
				}}
				>Start a chat first
			</button>
			<FollowingModal bind:showModal {followingList} />
		</div>
	{/if}
</div>
