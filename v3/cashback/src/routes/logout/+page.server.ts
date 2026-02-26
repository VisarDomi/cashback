import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('cashback_session', { path: '/' });
		redirect(303, '/');
	},
} satisfies Actions;
