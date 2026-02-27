import { bank } from '$lib/server/bank';
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
	const totalCashbackPaid = receipts
		.filter(r => r.status === 'credited')
		.reduce((sum, r) => sum + r.cashbackAmount, 0);
	const pending = bank.getPendingCashbacks(cid);

	return {
		company,
		escrowBalance,
		escrowId,
		recentTx,
		receiptCount: receipts.length,
		totalCashbackPaid,
		pendingCount: pending.count,
		pendingTotal: pending.total,
	};
};
