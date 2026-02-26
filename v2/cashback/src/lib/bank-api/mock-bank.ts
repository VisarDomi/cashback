import type { BankAPI, BankAccount, Transaction, Receipt, Company, User } from './types.ts';
import { SEED_ACCOUNTS, SEED_TRANSACTIONS, SEED_RECEIPTS, SEED_COMPANY, SEED_USER } from './seed.ts';

const STORAGE_KEY = 'cashback_v2_bank';

interface BankState {
	accounts: BankAccount[];
	transactions: Transaction[];
	receipts: Receipt[];
	companies: Company[];
	users: User[];
	nextId: number;
}

function load(): BankState {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch { /* ignore */ }
	return seed();
}

function seed(): BankState {
	const state: BankState = {
		accounts: structuredClone(SEED_ACCOUNTS),
		transactions: structuredClone(SEED_TRANSACTIONS),
		receipts: structuredClone(SEED_RECEIPTS),
		companies: [structuredClone(SEED_COMPANY)],
		users: [structuredClone(SEED_USER)],
		nextId: 100,
	};
	save(state);
	return state;
}

function save(state: BankState) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function genId(state: BankState, prefix: string): string {
	state.nextId++;
	return `${prefix}_${state.nextId}`;
}

function now(): string {
	return new Date().toISOString();
}

export function resetBank() {
	localStorage.removeItem(STORAGE_KEY);
}

export const bank: BankAPI = {
	getAccount(accountId) {
		const s = load();
		return s.accounts.find(a => a.id === accountId) ?? null;
	},

	getAccountsByOwner(ownerId) {
		const s = load();
		return s.accounts.filter(a => a.ownerId === ownerId);
	},

	depositToEscrow(companyId, amount) {
		const s = load();
		const acc = s.accounts.find(a => a.ownerId === companyId && a.type === 'company_escrow');
		if (!acc) throw new Error('Escrow account not found');
		acc.balance += amount;
		const tx: Transaction = {
			id: genId(s, 'tx'),
			type: 'escrow_deposit',
			fromAccountId: null,
			toAccountId: acc.id,
			amount,
			description: `Depozitë eskrou — ${amount} LEK`,
			createdAt: now(),
		};
		s.transactions.push(tx);
		save(s);
		return tx;
	},

	isReceiptProcessed(iic) {
		const s = load();
		return s.receipts.some(r => r.iic === iic);
	},

	processReceipt(userId, companyId, iic, tin, totalAmount, receiptDate) {
		const s = load();
		const company = s.companies.find(c => c.id === companyId);
		if (!company) throw new Error('Company not found');
		const pct = company.cashbackPercent;
		const cashbackAmount = Math.round(totalAmount * pct / 100);
		const receipt: Receipt = {
			id: genId(s, 'rcpt'),
			userId,
			companyId,
			iic,
			tin,
			totalAmount,
			cashbackAmount,
			cashbackPercent: pct,
			createdAt: now(),
			receiptDate,
		};
		s.receipts.push(receipt);
		save(s);
		return receipt;
	},

	creditCashback(receipt) {
		const s = load();
		const escrow = s.accounts.find(a => a.ownerId === receipt.companyId && a.type === 'company_escrow');
		const wallet = s.accounts.find(a => a.ownerId === receipt.userId && a.type === 'user_wallet');
		if (!escrow || !wallet) throw new Error('Accounts not found');
		if (escrow.balance < receipt.cashbackAmount) throw new Error('Insufficient escrow balance');
		escrow.balance -= receipt.cashbackAmount;
		wallet.balance += receipt.cashbackAmount;
		const company = s.companies.find(c => c.id === receipt.companyId);
		const tx: Transaction = {
			id: genId(s, 'tx'),
			type: 'cashback_credit',
			fromAccountId: escrow.id,
			toAccountId: wallet.id,
			amount: receipt.cashbackAmount,
			description: `Cashback ${receipt.cashbackPercent}% — ${company?.name ?? 'N/A'}`,
			receiptId: receipt.id,
			createdAt: now(),
		};
		s.transactions.push(tx);
		save(s);
		return tx;
	},

	withdrawToBank(userId, amount, iban) {
		const s = load();
		const wallet = s.accounts.find(a => a.ownerId === userId && a.type === 'user_wallet');
		if (!wallet) throw new Error('Wallet not found');
		if (wallet.balance < amount) throw new Error('Insufficient balance');
		wallet.balance -= amount;
		const shortIban = iban.replace(/\s/g, '').slice(-4);
		const tx: Transaction = {
			id: genId(s, 'tx'),
			type: 'withdrawal',
			fromAccountId: wallet.id,
			toAccountId: null,
			amount,
			description: `Tërheqje → ...${shortIban}`,
			createdAt: now(),
		};
		s.transactions.push(tx);
		save(s);
		return tx;
	},

	getTransactions(accountId) {
		const s = load();
		return s.transactions
			.filter(t => t.fromAccountId === accountId || t.toAccountId === accountId)
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},

	getReceiptsByUser(userId) {
		const s = load();
		return s.receipts
			.filter(r => r.userId === userId)
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},

	getReceiptsByCompany(companyId) {
		const s = load();
		return s.receipts
			.filter(r => r.companyId === companyId)
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},

	getCompany(companyId) {
		const s = load();
		return s.companies.find(c => c.id === companyId) ?? null;
	},

	getCompanyByTin(tin) {
		const s = load();
		return s.companies.find(c => c.tin === tin) ?? null;
	},

	getUser(userId) {
		const s = load();
		return s.users.find(u => u.id === userId) ?? null;
	},
};
