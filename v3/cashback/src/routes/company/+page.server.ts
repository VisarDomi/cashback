import { bank } from '$lib/server/bank.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const cid = locals.accountId!;
	const company = bank.getCompany(cid);
	const accounts = bank.getAccountsByOwner(cid);
	const escrow = accounts.find(a => a.type === 'company_escrow');
	const escrowBalance = escrow?.balance ?? 0;
	const escrowId = escrow?.id ?? '';
	const recentTx = escrowId ? bank.getTransactions(escrowId).slice(0, 5) : [];
	const receipts = bank.getReceiptsByCompany(cid);
	const totalCashbackPaid = receipts.reduce((sum, r) => sum + r.cashbackAmount, 0);

	return {
		company,
		escrowBalance,
		escrowId,
		recentTx,
		receiptCount: receipts.length,
		totalCashbackPaid,
	};
};
