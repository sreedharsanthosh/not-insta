<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser, pb } from '@/pocketbase';
	import type { RecordModel } from 'pocketbase';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { ArrowUpSolid } from 'svelte-awesome-icons';

	let message: string;
	let user: RecordModel;
	let messages: any[] = [];
	let unsubscribe: () => void;
	let element: HTMLUListElement;

	onMount(async () => {
		const res = await pb.collection('users').getOne($page.params.user);
		user = res;
		getMessages();

		unsubscribe = await pb.collection('messages').subscribe('*', async ({ action, record }) => {
			if (action == 'create') {
				messages = [...messages, record];
			}
		});
	});

	async function sendMessage() {
		const data = {
			message: message,
			sender: $currentUser?.id,
			reciever: user.id
		};
		message = '';
		const res = await pb.collection('messages').create(data);
		pb.collection('users').update($currentUser?.id, {
			'chats+': user.id
		});
		pb.collection('users').update(user.id, {
			'chats+': $currentUser?.id
		});
	}

	onDestroy(() => {
		unsubscribe?.();
	});

	const getMessages = async () => {
		const res = await pb
			.collection('messages')
			.getList(1, 50, {
				filter: `reciever="${user.id}" && sender="${$currentUser?.id}" || reciever="${$currentUser?.id}" && sender="${user.id}"`,
				sort: 'created'
			})
			.then((res) => {
				messages = res.items;
			})
			.catch((err) => console.log(err));
	};
	const scrollToBottom = async (node: HTMLUListElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};
	afterUpdate(() => {
		if (messages) scrollToBottom(element);
	});
</script>

<div class="box relative flex h-screen w-screen flex-col items-center text-white">
	{#if user}
		<div class="absolute top-0 flex h-24 w-full items-center bg-custom-gray p-4">
			<img
				src={pb.getFileUrl(user, user?.avatar)}
				alt=" profile"
				class="mx-4 h-10 w-10 rounded-full"
			/>
			<h1 class="text-2xl font-bold text-white">{user.name}</h1>
		</div>
		<ul
			bind:this={element}
			class="no-scrollbar flex max-h-screen w-full flex-col overflow-y-scroll px-5 py-24 md:px-10"
		>
			{#each messages as message}
				<li class={message.reciever == $currentUser?.id ? 'recieved' : 'send'}>
					<h1>{message.message}</h1>
				</li>
			{/each}
		</ul>
		<form
			on:submit|preventDefault={sendMessage}
			class="absolute bottom-0 flex h-24 w-full items-center justify-around p-4"
		>
			<input
				bind:value={message}
				type="text"
				class="w-5/6 rounded-md bg-custom-gray px-4 py-4 text-white"
			/>
			<button class="grid h-14 w-14 place-items-center rounded-full bg-custom-gray"
				><ArrowUpSolid color="#ffffff" /></button
			>
		</form>
	{/if}
</div>
