import { redirect } from '@sveltejs/kit';
import { DEMO_ACCOUNTS } from '$lib/auth/accounts';
import { resetBank, getAllCompanies } from '$lib/server/bank';
import type { Role } from '$lib/auth/accounts';
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
	const companies = getAllCompanies();
	const latest = companies[companies.length - 1];
	return {
		latestCompany: latest ? { id: latest.id, name: latest.name, tin: latest.tin, logoEmoji: latest.logoEmoji } : null,
	};
};

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const accountId = data.get('accountId') as string;

		// Check static demo accounts first
		const account = DEMO_ACCOUNTS.find(a => a.id === accountId);
		if (account) {
			cookies.set('cashback_session', JSON.stringify({ accountId: account.id, role: account.role }), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7,
			});
			redirect(303, dashboardFor(account.role));
		}

		// Check dynamic companies from bank state
		const companies = getAllCompanies();
		const company = companies.find(c => c.id === accountId);
		if (company) {
			cookies.set('cashback_session', JSON.stringify({ accountId: company.id, role: 'company' as Role }), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7,
			});
			redirect(303, '/company');
		}

		return { success: false, error: 'Llogari e pavlefshme' };
	},
	reset: async ({ cookies }) => {
		resetBank();
		cookies.delete('cashback_session', { path: '/' });
		return { reset: true };
	},
} satisfies Actions;
