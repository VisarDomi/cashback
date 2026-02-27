import { redirect } from '@sveltejs/kit';
import { bank } from '$lib/server/bank';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	const cid = locals.accountId!;
	const accounts = bank.getAccountsByOwner(cid);
	const escrow = accounts.find(a => a.type === 'company_escrow');

	const deposited = url.searchParams.get('deposited');

	return {
		escrowBalance: escrow?.balance ?? 0,
		deposited: deposited ? parseInt(deposited) : null,
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const cid = locals.accountId!;
		const data = await request.formData();
		const amountStr = data.get('amount') as string;

		const val = parseInt(amountStr);
		if (isNaN(val) || val <= 0) {
			return { success: false, error: 'Vendos një shumë të vlefshme' };
		}

		try {
			bank.depositToEscrow(cid, val);
		} catch (e: any) {
			return { success: false, error: e.message };
		}

		redirect(303, `/company/fund?deposited=${val}`);
	},
} satisfies Actions;
