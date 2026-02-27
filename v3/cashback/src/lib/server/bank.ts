import fs from 'node:fs';
import path from 'node:path';
import type { BankAPI, BankAccount, Transaction, Receipt, Company, User } from '../bank-api/types.ts';
import { SEED_ACCOUNTS, SEED_TRANSACTIONS, SEED_RECEIPTS, SEED_COMPANY, SEED_USER } from '../bank-api/seed.ts';
const DATA_PATH = process.env.DATA_PATH || './data/bank.json';

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
		const raw = fs.readFileSync(DATA_PATH, 'utf-8');
		const state: BankState = JSON.parse(raw);
		// Migration: add status to old receipts missing it
		for (const r of state.receipts) {
			if (!r.status) r.status = 'credited';
		}
		return state;
	} catch {
		return seed();
	}
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
	const dir = path.dirname(DATA_PATH);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

function genId(state: BankState, prefix: string): string {
	state.nextId++;
	return `${prefix}_${state.nextId}`;
}

function now(): string {
	return new Date().toISOString();
}

export function resetBank() {
	try {
		fs.unlinkSync(DATA_PATH);
	} catch {
		// file may not exist
	}
}

export function addCompany(tin: string, name: string, cashbackPercent: number, logoEmoji: string): Company {
	const s = load();
	const id = genId(s, 'comp');
	const company: Company = { id, name, tin, cashbackPercent, logoEmoji };
	s.companies.push(company);
	// Create escrow account with 50,000 LEK demo balance
	const escrowId = genId(s, 'acc_escrow');
	s.accounts.push({
		id: escrowId,
		ownerId: id,
		type: 'company_escrow',
		balance: 0,
		currency: 'ALL',
		createdAt: now(),
	});
	save(s);
	return company;
}

export function getAllCompanies(): Company[] {
	const s = load();
	return s.companies;
}

export function removeCompany(tin: string): boolean {
	const s = load();
	const idx = s.companies.findIndex(c => c.tin === tin);
	if (idx === -1) return false;
	const company = s.companies[idx];
	s.companies.splice(idx, 1);
	// Remove escrow account
	s.accounts = s.accounts.filter(a => !(a.ownerId === company.id && a.type === 'company_escrow'));
	save(s);
	return true;
}

export function updateCashbackPercent(companyId: string, percent: number) {
	const s = load();
	const comp = s.companies.find(c => c.id === companyId);
	if (!comp) throw new Error('Company not found');
	comp.cashbackPercent = percent;
	save(s);
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
		// Auto-process any pending cashbacks now that escrow has funds
		bank.processPendingCashbacks(companyId);
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
			status: 'pending',
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
		if (escrow.balance < receipt.cashbackAmount) return null;
		escrow.balance -= receipt.cashbackAmount;
		wallet.balance += receipt.cashbackAmount;
		const r = s.receipts.find(r => r.id === receipt.id);
		if (r) r.status = 'credited';
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

	processPendingCashbacks(companyId) {
		const s = load();
		const escrow = s.accounts.find(a => a.ownerId === companyId && a.type === 'company_escrow');
		if (!escrow) return;
		const pending = s.receipts
			.filter(r => r.companyId === companyId && r.status === 'pending')
			.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); // FIFO
		for (const receipt of pending) {
			if (escrow.balance < receipt.cashbackAmount) break;
			const wallet = s.accounts.find(a => a.ownerId === receipt.userId && a.type === 'user_wallet');
			if (!wallet) continue;
			escrow.balance -= receipt.cashbackAmount;
			wallet.balance += receipt.cashbackAmount;
			receipt.status = 'credited';
			const company = s.companies.find(c => c.id === companyId);
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
		}
		save(s);
	},

	getPendingCashbacks(companyId) {
		const s = load();
		const pending = s.receipts.filter(r => r.companyId === companyId && r.status === 'pending');
		return {
			count: pending.length,
			total: pending.reduce((sum, r) => sum + r.cashbackAmount, 0),
		};
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
