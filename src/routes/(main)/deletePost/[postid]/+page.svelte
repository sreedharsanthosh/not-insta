<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pb } from '@/pocketbase';
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold text-white">Are you sure you want to delete?</h1>
	<div class="my-4 flex items-center justify-center">
		<button
			class="rounded-md bg-custom-gray px-4 py-2 text-white"
			on:click={() => {
				goto('/profile');
			}}>No</button
		>
		<button
			class="mx-4 rounded-md bg-red-500 px-4 py-2 text-white"
			on:click={async () => {
				await pb.collection('posts').delete($page.params.postid);
				goto('/profile');
			}}>Yes</button
		>
	</div>
</div>
