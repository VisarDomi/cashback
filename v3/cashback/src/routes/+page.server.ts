import { redirect } from '@sveltejs/kit';
import { DEMO_ACCOUNTS } from '$lib/auth/accounts.ts';
import { resetBank } from '$lib/server/bank.ts';
import type { Actions, PageServerLoad } from './$types';

function dashboardFor(role: string): string {
	if (role === 'company') return '/company';
	if (role === 'admin') return '/admin';
	return '/user';
}

export const load: PageServerLoad = ({ locals }) => {
	if (locals.accountId && locals.role) {
		redirect(303, dashboardFor(locals.role));
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

		redirect(303, dashboardFor(account.role));
	},
	reset: async () => {
		resetBank();
		return { reset: true };
	},
} satisfies Actions;
