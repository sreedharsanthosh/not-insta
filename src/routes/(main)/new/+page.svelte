<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb, currentUser } from '@/pocketbase';
	import { Jumper } from 'svelte-loading-spinners';

	let title: string | Blob;
	let description: string | Blob;
	let file: string | Blob;
	let uploading: boolean = false;

	const formData = new FormData();

	const upload = async () => {
		formData.append('title', title);
		formData.append('description', description);
		formData.append('file', file);
		formData.append('user', $currentUser?.id);
		console.log(file);
		try {
			uploading = true;
			const createdPost = await pb.collection('posts').create(formData);
			goto('/profile');
		} catch (err) {
			console.log(err);
		}
	};
</script>

{#if uploading}
	<div
		class="absolute z-10 flex h-screen w-screen items-center justify-center bg-custom-gray opacity-50"
	>
		<Jumper size="200" unit="px" color="#ffffff" />
	</div>
{/if}

<div class="flex h-screen w-screen items-center justify-center text-white">
	<form
		method="post"
		on:submit|preventDefault
		class="flex h-3/5 w-3/4 flex-col items-center justify-around rounded-md bg-custom-gray px-4 md:w-1/2 xl:w-1/4"
	>
		<h1 class="text-3xl font-bold">Upload</h1>
		<label for="Title" class="w-full self-start text-xl font-bold"
			>Title: <input
				class="my-2 w-full bg-dark-gray p-2"
				type="text"
				name="Title"
				required
				bind:value={title}
			/>
		</label>

		<label for="description" class="w-full self-start text-xl font-bold"
			>Description: <input
				class="my-2 w-full bg-dark-gray p-2"
				type="text"
				name="description"
				required
				bind:value={description}
			/>
		</label>
		<div class="flex w-full items-center justify-around">
			<label for="file" class="mx-2 w-3/4 rounded-md bg-dark-gray px-4 py-2">
				Choose picture
				<input
					name="file"
					type="file"
					required
					class="block w-full cursor-pointer rounded-lg bg-custom-gray text-sm text-white focus:outline-none"
					on:change={(e) => {
						//@ts-ignore
						file = e?.target?.files[0];
					}}
				/>
			</label>
		</div>
		<button class="my-1 rounded-md bg-green-300 px-6 py-2 font-bold text-black" on:click={upload}
			>Upload</button
		>
	</form>
</div>
