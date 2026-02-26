import { bank } from '$lib/server/bank.ts';
import { formatCurrency } from '$lib/format.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const uid = locals.accountId!;
	const user = bank.getUser(uid);
	const accounts = bank.getAccountsByOwner(uid);
	const wallet = accounts.find(a => a.type === 'user_wallet');

	return {
		balance: wallet?.balance ?? 0,
		iban: user?.iban ?? '',
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const uid = locals.accountId!;
		const data = await request.formData();
		const amountStr = data.get('amount') as string;
		const iban = data.get('iban') as string;

		const val = parseInt(amountStr);
		if (isNaN(val) || val <= 0) {
			return { success: false, error: 'Vendos një shumë të vlefshme' };
		}

		const accounts = bank.getAccountsByOwner(uid);
		const wallet = accounts.find(a => a.type === 'user_wallet');
		if (!wallet || wallet.balance < val) {
			return { success: false, error: 'Balancë e pamjaftueshme' };
		}

		try {
			bank.withdrawToBank(uid, val, iban);
			return { success: true, amount: val, iban };
		} catch (e: any) {
			return { success: false, error: e.message };
		}
	},
} satisfies Actions;
