import { bank } from '$lib/server/bank';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const cid = locals.accountId!;
	const accounts = bank.getAccountsByOwner(cid);
	const escrow = accounts.find(a => a.type === 'company_escrow');

	return {
		escrowBalance: escrow?.balance ?? 0,
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
			return { success: true, amount: val };
		} catch (e: any) {
			return { success: false, error: e.message };
		}
	},
} satisfies Actions;
