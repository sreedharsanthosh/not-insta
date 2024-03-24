<script lang="ts">
	import { page } from '$app/stores';
	import {
		HouseSolid,
		MagnifyingGlassSolid,
		PlusSolid,
		PersonCaneSolid
	} from 'svelte-awesome-icons';
	import { goto } from '$app/navigation';
	import { pb } from '@/pocketbase';
	import { RocketIcon } from 'lucide-svelte';

	let currentRoute = $page.url.pathname;

	$: $page.url.pathname, (currentRoute = $page.url.pathname);

	function signOut() {
		pb.authStore.clear();
		goto('/login');
	}
</script>

<div
	class="fixed bottom-5 left-1/2 flex h-16 w-11/12 -translate-x-1/2 items-center justify-center rounded-full bg-nav-gray"
>
	<title>not-insta</title>
	<div class="flex w-full items-center justify-around md:w-1/2">
		<HouseSolid
			color={currentRoute === '/' ? '#84cc16' : '#ffffff'}
			on:click={() => {
				currentRoute = '/';
				goto('/');
			}}
			size="30"
		/>
		<a
			href="/chat"
			on:click={() => {
				console.log('clicke');
				currentRoute = '/chat';
			}}
		>
			<RocketIcon color={currentRoute === '/chat' ? '#84cc16' : '#ffffff'} />
		</a>
		<MagnifyingGlassSolid
			color={currentRoute === '/search' ? '#84cc16' : '#ffffff'}
			on:click={() => {
				currentRoute = '/search';
				goto('/search');
			}}
			size="30"
		/>
		<PlusSolid
			color={currentRoute === '/new' ? '#84cc16' : '#ffffff'}
			on:click={() => {
				currentRoute = '/new';
				goto('/new');
			}}
			size="30"
		/>
		<PersonCaneSolid
			size="30"
			color={currentRoute === '/profile' ? '#84cc16' : '#ffffff'}
			on:click={() => {
				currentRoute = '/profile';
				goto('/profile');
			}}
		/>
	</div>
</div>

<slot />
