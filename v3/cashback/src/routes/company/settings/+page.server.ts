import { redirect } from '@sveltejs/kit';
import { bank, resetBank, updateCashbackPercent } from '$lib/server/bank';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const cid = locals.accountId!;
	const company = bank.getCompany(cid);

	return {
		cashbackPercent: company?.cashbackPercent ?? 10,
	};
};

export const actions = {
	save: async ({ request, locals }) => {
		const cid = locals.accountId!;
		const data = await request.formData();
		const pct = parseInt(data.get('cashbackPercent') as string);

		if (isNaN(pct) || pct < 1 || pct > 30) {
			return { success: false, error: 'Përqindja duhet të jetë mes 1 dhe 30' };
		}

		updateCashbackPercent(cid, pct);
		return { success: true, saved: true };
	},

	reset: async ({ cookies }) => {
		resetBank();
		cookies.delete('cashback_session', { path: '/' });
		redirect(303, '/');
	},
} satisfies Actions;
