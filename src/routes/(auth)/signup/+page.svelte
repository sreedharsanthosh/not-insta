<script lang="ts">
	import { pb, currentUser } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { fromZodError } from 'zod-validation-error';
	import { Jumper } from 'svelte-loading-spinners';

	let username: string;
	let password: string;
	let name: string;
	let signingUp: boolean;
	let usernameError = '';
	let passwordError = '';
	let formError = '';
	let fileError = '';
	let bio = '';
	let profile: Blob | string;

	const userSchema = z.object({
		username: z.string().min(8),
		password: z.string().min(8),
		bio: z.string()
	});

	function validate(username: String, password: String) {
		const user = {
			username: username,
			password: password,
			bio: bio
		};
		const result = userSchema.safeParse(user);
		if (!result.success) {
			const error = result.error.flatten();
			const formError = error.fieldErrors;
			if (formError.username) {
				usernameError = formError.username[0];
			} else if (formError.password) {
				passwordError = formError.password[0];
			}
			return fromZodError(result.error);
		} else {
			return true;
		}
	}

	const formData = new FormData();

	async function singUp() {
		usernameError = '';
		passwordError = '';
		const specials = /[*|\":<>[\]{}`\\() ';@&$]/;
		const regexResult = specials.test(username);
		//@ts-ignore
		const filesizetest = profile.size > 5242880;
		console.log(filesizetest);
		if (regexResult) {
			usernameError = 'username cannot contain special chars';
		}
		if (filesizetest) {
			fileError = 'image too big';
		}
		const data = {
			username,
			password,
			bio
		};
		const validationResult = validate(username, password);
		if (validationResult == true && regexResult == false && filesizetest == false) {
			try {
				formData.append('username', username);
				formData.append('password', password);
				formData.append('name', name);
				formData.append('bio', bio);
				formData.append('avatar', profile);
				formData.append('passwordConfirm', password);
				console.log(password);
				signingUp = true;
				const createUser = await pb.collection('users').create(formData);
				pb.collection('users')
					.authWithPassword(username, password)
					.then((res) => goto('/'));
				signingUp = false;
			} catch (err) {
				console.log(err);
				formError = 'Username already exists';
			}
		} else {
			console.log(validationResult, regexResult);
		}
	}
</script>

{#if signingUp}
	<div
		class="absolute z-10 flex h-screen w-screen items-center justify-center bg-custom-gray opacity-50"
	>
		<Jumper size="200" unit="px" color="#ffffff" />
	</div>
{/if}

<div class="flex h-screen flex-col items-center justify-center text-white">
	{#if $currentUser}
		<h1>Already Logged in</h1>
	{:else}
		<form
			method="post"
			on:submit|preventDefault
			class="flex h-4/5 w-3/4 flex-col items-center justify-around rounded-md bg-custom-gray px-4 md:w-1/2 xl:w-1/4"
		>
			<h1 class="text-3xl font-bold">Sign Up</h1>
			<label for="username" class="w-full self-start text-xl font-bold"
				>Username: <input
					class="my-2 w-full bg-dark-gray p-2"
					type="text"
					name="username"
					bind:value={username}
				/>
				<h6 class="text-xs text-red-500">{usernameError}</h6>
			</label>
			<label for="username" class="w-full self-start text-xl font-bold"
				>Name (your display name): <input
					class="my-2 w-full bg-dark-gray p-2"
					type="text"
					name="username"
					bind:value={name}
				/>
			</label>

			<label for="password" class="w-full self-start text-xl font-bold"
				>Password: <input
					class="my-2 w-full bg-dark-gray p-2"
					type="password"
					name="password"
					bind:value={password}
				/>
				<h6 class="text-xs text-red-500">{passwordError}</h6>
			</label>
			<label for="bio" class="w-full self-start text-xl font-bold"
				>Enter a bio: <input
					class="my-2 w-full bg-dark-gray p-2"
					type="text"
					name="bio"
					bind:value={bio}
				/>
			</label>
			<label for="file" class="w-full self-start text-xl font-bold"
				>Profile picture: <input
					class="my-2 w-full bg-dark-gray p-2"
					type="file"
					name="file"
					required
					accept="image/jpeg, image/png, image/svg+xml, img/gif, image/webp"
					on:change={(e) => {
						//@ts-ignore
						profile = e?.target?.files[0];
					}}
				/>
				<h6 class="text-xs text-red-500">{fileError}</h6>
			</label>

			<button class="my-1 rounded-md bg-green-300 px-6 py-2 font-bold text-black" on:click={singUp}
				>Sign up</button
			>
			<h3>Already have an account? <a class="text-blue-300" href="/login">Login</a></h3>
			<h6 class="text-xl text-red-500">{formError}</h6>
		</form>
	{/if}
</div>
