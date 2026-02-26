import { redirect } from '@sveltejs/kit';
import { DEMO_ACCOUNTS } from '$lib/auth/accounts.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.accountId && locals.role) {
		redirect(303, locals.role === 'company' ? '/company' : '/user');
	}
};

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const accountId = data.get('accountId') as string;

		const account = DEMO_ACCOUNTS.find(a => a.id === accountId);
		if (!account) {
			return { success: false, error: 'Llogari e pavlefshme' };
		}

		cookies.set('cashback_session', JSON.stringify({ accountId: account.id, role: account.role }), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		redirect(303, account.role === 'company' ? '/company' : '/user');
	},
} satisfies Actions;
