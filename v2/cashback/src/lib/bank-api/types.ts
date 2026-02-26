/**
 * Cashback Platform — Bank API Specification
 *
 * This file defines the interface between the cashback platform and the bank.
 * In production, the bank implements these interfaces as REST endpoints.
 * For the demo, we use a localStorage-backed mock (mock-bank.ts).
 */

// ─── Account Types ───────────────────────────────────────────

export type AccountType = 'user_wallet' | 'company_escrow';

export interface BankAccount {
	id: string;
	ownerId: string;
	type: AccountType;
	balance: number; // in LEK (Albanian Lek), integer cents avoided — whole lek
	currency: 'ALL';
	createdAt: string; // ISO 8601
}

// ─── Transactions ────────────────────────────────────────────

export type TransactionType =
	| 'escrow_deposit'    // Company funds their escrow
	| 'cashback_credit'   // Platform credits user wallet from escrow
	| 'withdrawal';       // User withdraws to external IBAN

export interface Transaction {
	id: string;
	type: TransactionType;
	fromAccountId: string | null; // null for external deposits
	toAccountId: string | null;   // null for withdrawals
	amount: number;
	description: string;
	receiptId?: string;           // linked receipt for cashback_credit
	createdAt: string;
}

// ─── Receipts ────────────────────────────────────────────────

export interface Receipt {
	id: string;
	userId: string;
	companyId: string;
	iic: string;       // Invoice Identification Code (NIVF)
	tin: string;       // Trader Tax ID (NIPT)
	totalAmount: number;
	cashbackAmount: number;
	cashbackPercent: number;
	createdAt: string;  // receipt scan timestamp
	receiptDate: string; // original receipt date (crtd from QR)
}

// ─── Company ─────────────────────────────────────────────────

export interface Company {
	id: string;
	name: string;
	tin: string;
	cashbackPercent: number; // e.g. 10 for 10%
	logoEmoji: string;
}

// ─── User ────────────────────────────────────────────────────

export interface User {
	id: string;
	name: string;
	email: string;
	iban: string;
}

// ─── Bank API Methods ────────────────────────────────────────

export interface BankAPI {
	// Accounts
	getAccount(accountId: string): BankAccount | null;
	getAccountsByOwner(ownerId: string): BankAccount[];

	// Company escrow operations
	depositToEscrow(companyId: string, amount: number): Transaction;

	// Cashback flow
	isReceiptProcessed(iic: string): boolean;
	processReceipt(userId: string, companyId: string, iic: string, tin: string, totalAmount: number, receiptDate: string): Receipt;
	creditCashback(receipt: Receipt): Transaction;

	// User withdrawal
	withdrawToBank(userId: string, amount: number, iban: string): Transaction;

	// History
	getTransactions(accountId: string): Transaction[];
	getReceiptsByUser(userId: string): Receipt[];
	getReceiptsByCompany(companyId: string): Receipt[];

	// Entities
	getCompany(companyId: string): Company | null;
	getCompanyByTin(tin: string): Company | null;
	getUser(userId: string): User | null;
}
