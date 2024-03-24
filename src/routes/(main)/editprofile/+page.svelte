<script lang="ts">
	//@ts-nocheck
	import { pb, currentUser } from '@/pocketbase';
	import { goto } from '$app/navigation';
	import { TrashCanSolid } from 'svelte-awesome-icons';
	import { Jumper } from 'svelte-loading-spinners';

	let name: string = $currentUser?.name;
	let bio: string = $currentUser?.bio;
	let file: string | Blob;
	let usernameError: string = '';
	let previewImage: null;
	let editing: boolean = false;

	const formData = new FormData();

	const specials = /[*|\":<>[\]{}`\\() ';@&$]/;

	const update = async () => {
		formData.append('name', name);
		formData.append('bio', bio);
		usernameError = '';
		if (file != null) {
			formData.append('avatar', file);
		}
		const id = $currentUser?.id;
		try {
			editing = true;
			const updatedUser = await pb.collection('users').update(id, formData);
			goto('/profile');
		} catch (err) {
			console.log(err);
		}
	};
</script>

{#if editing}
	<div
		class="absolute z-10 flex h-screen w-screen items-center justify-center bg-custom-gray opacity-50"
	>
		<Jumper size="200" unit="px" color="#ffffff" />
	</div>
{/if}

<div class="flex h-screen w-screen items-center justify-center">
	<form
		on:submit|preventDefault={update}
		class="flex h-3/5 w-3/4 flex-col items-center justify-around rounded-md bg-custom-gray px-4 text-white md:w-1/2 lg:w-2/6"
	>
		<h1 class="text-4xl font-bold">Update</h1>
		<label for="username" class="w-full self-start text-xl font-bold"
			>Name (Your display name): <input
				class="my-2 w-full bg-dark-gray p-2"
				type="text"
				name="username"
				bind:value={name}
				minlength="8"
			/>
		</label>
		<label for="username" class="w-full self-start text-xl font-bold"
			>Username: <input
				class="my-2 w-full bg-dark-gray p-2"
				type="text"
				name="username"
				bind:value={bio}
			/>
		</label>
		<div class="flex w-full items-center justify-around">
			<label for="file" class="mx-2 w-3/4 rounded-md bg-dark-gray px-4 py-2">
				Change profile picture
				<input
					name="file"
					type="file"
					class="block w-full cursor-pointer rounded-lg bg-custom-gray text-sm text-white focus:outline-none"
					on:change={(e) => {
						file = e?.target?.files[0];
						previewImage = URL.createObjectURL(file);
					}}
				/>
			</label>
			<img
				src={previewImage ? previewImage : pb.files.getUrl($currentUser, $currentUser?.avatar)}
				alt="Profile"
				class="h-12 w-12 rounded-full"
			/>
		</div>
		<button class="rounded-md border-none bg-green-400 px-6 py-2 text-black" type="submit"
			>Update</button
		>
		<h6>{usernameError}</h6>
	</form>
</div>
