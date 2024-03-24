import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('https://social-app.pockethost.io');

pb.autoCancellation(false);

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
	currentUser.set(pb.authStore.model);
});

export type userType = typeof currentUser;
