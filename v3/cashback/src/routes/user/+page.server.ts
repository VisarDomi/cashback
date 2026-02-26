import { bank } from '$lib/server/bank.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const uid = locals.accountId!;
	const accounts = bank.getAccountsByOwner(uid);
	const wallet = accounts.find(a => a.type === 'user_wallet');
	const balance = wallet?.balance ?? 0;
	const walletId = wallet?.id ?? '';
	const recentTx = walletId ? bank.getTransactions(walletId).slice(0, 5) : [];

	return { balance, walletId, recentTx };
};
