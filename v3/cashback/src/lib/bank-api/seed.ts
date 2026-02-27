import type { BankAccount, Transaction, Receipt, Company, User } from './types.ts';

export const SEED_COMPANY: Company = {
	id: 'comp_1',
	name: 'Cafe Tirana',
	tin: 'L62203504M',
	cashbackPercent: 10,
	logoEmoji: '☕',
};

export const SEED_COMPANY_2: Company = {
	id: 'comp_2',
	name: 'Accounting Lala',
	tin: 'M51320022U',
	cashbackPercent: 5,
	logoEmoji: '📊',
};

export const SEED_USER: User = {
	id: 'user_1',
	name: 'Ardi Hoxha',
	email: 'ardi@email.com',
	iban: 'AL47 2121 1009 0000 0002 3569 8741',
};

export const SEED_ACCOUNTS: BankAccount[] = [
	{
		id: 'acc_wallet_1',
		ownerId: 'user_1',
		type: 'user_wallet',
		balance: 320,
		currency: 'ALL',
		createdAt: '2026-01-15T10:00:00Z',
	},
	{
		id: 'acc_escrow_1',
		ownerId: 'comp_1',
		type: 'company_escrow',
		balance: 50_000,
		currency: 'ALL',
		createdAt: '2026-01-10T09:00:00Z',
	},
	{
		id: 'acc_escrow_2',
		ownerId: 'comp_2',
		type: 'company_escrow',
		balance: 30_000,
		currency: 'ALL',
		createdAt: '2026-01-12T09:00:00Z',
	},
];

export const SEED_RECEIPTS: Receipt[] = [
	{
		id: 'rcpt_1',
		userId: 'user_1',
		companyId: 'comp_1',
		iic: 'A1B2C3D4E5F60001',
		tin: 'L62203504M',
		totalAmount: 1200,
		cashbackAmount: 120,
		cashbackPercent: 10,
		createdAt: '2026-02-20T09:15:00Z',
		receiptDate: '2026-02-20T09:10:00',
	},
	{
		id: 'rcpt_2',
		userId: 'user_1',
		companyId: 'comp_1',
		iic: 'F6E5D4C3B2A10002',
		tin: 'L62203504M',
		totalAmount: 850,
		cashbackAmount: 85,
		cashbackPercent: 10,
		createdAt: '2026-02-22T14:30:00Z',
		receiptDate: '2026-02-22T14:25:00',
	},
	{
		id: 'rcpt_3',
		userId: 'user_1',
		companyId: 'comp_1',
		iic: '9A5D3E8F2B1C7003',
		tin: 'L62203504M',
		totalAmount: 450,
		cashbackAmount: 45,
		cashbackPercent: 10,
		createdAt: '2026-02-24T11:00:00Z',
		receiptDate: '2026-02-24T10:55:00',
	},
];

export const SEED_TRANSACTIONS: Transaction[] = [
	// Company initial escrow deposit
	{
		id: 'tx_1',
		type: 'escrow_deposit',
		fromAccountId: null,
		toAccountId: 'acc_escrow_1',
		amount: 50_000,
		description: 'Depozitë fillestare eskrou',
		createdAt: '2026-01-10T09:00:00Z',
	},
	// Cashback credits from the 3 receipts
	{
		id: 'tx_2',
		type: 'cashback_credit',
		fromAccountId: 'acc_escrow_1',
		toAccountId: 'acc_wallet_1',
		amount: 120,
		description: 'Cashback 10% — Cafe Tirana',
		receiptId: 'rcpt_1',
		createdAt: '2026-02-20T09:15:00Z',
	},
	{
		id: 'tx_3',
		type: 'cashback_credit',
		fromAccountId: 'acc_escrow_1',
		toAccountId: 'acc_wallet_1',
		amount: 85,
		description: 'Cashback 10% — Cafe Tirana',
		receiptId: 'rcpt_2',
		createdAt: '2026-02-22T14:30:00Z',
	},
	{
		id: 'tx_4',
		type: 'cashback_credit',
		fromAccountId: 'acc_escrow_1',
		toAccountId: 'acc_wallet_1',
		amount: 45,
		description: 'Cashback 10% — Cafe Tirana',
		receiptId: 'rcpt_3',
		createdAt: '2026-02-24T11:00:00Z',
	},
	// A withdrawal — user took out some money earlier
	{
		id: 'tx_5',
		type: 'cashback_credit',
		fromAccountId: 'acc_escrow_1',
		toAccountId: 'acc_wallet_1',
		amount: 140,
		description: 'Cashback 10% — Cafe Tirana',
		createdAt: '2026-02-18T10:20:00Z',
	},
	{
		id: 'tx_6',
		type: 'withdrawal',
		fromAccountId: 'acc_wallet_1',
		toAccountId: null,
		amount: 70,
		description: 'Tërheqje → AL47 2121 ...8741',
		createdAt: '2026-02-23T16:00:00Z',
	},
];
// Balance: 120 + 85 + 45 + 140 - 70 = 320 LEK ✓
// Escrow: 50_000 + (120+85+45+140) = 50_390 initial deposit needed, but we just show
// a round 50_000 as current balance (implying the cashback already came out of it).
