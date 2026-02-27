import { bank } from '$lib/server/bank';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const uid = locals.accountId!;
	const accounts = bank.getAccountsByOwner(uid);
	const wallet = accounts.find(a => a.type === 'user_wallet');
	const walletId = wallet?.id ?? '';
	const transactions = walletId ? bank.getTransactions(walletId) : [];
	const receipts = bank.getReceiptsByUser(uid);

	return { walletId, transactions, receipts };
};
