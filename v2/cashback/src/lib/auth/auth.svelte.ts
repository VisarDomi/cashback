import { DEMO_ACCOUNTS, type DemoAccount, type Role } from './accounts.ts';

const STORAGE_KEY = 'cashback_v2_auth';

interface AuthState {
	accountId: string;
	role: Role;
}

function loadAuth(): AuthState | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch { /* ignore */ }
	return null;
}

let _auth = $state<AuthState | null>(loadAuth());

export function login(account: DemoAccount) {
	_auth = { accountId: account.id, role: account.role };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(_auth));
}

export function logout() {
	_auth = null;
	localStorage.removeItem(STORAGE_KEY);
}

export function getAuth(): AuthState | null {
	return _auth;
}

export function getRole(): Role | null {
	return _auth?.role ?? null;
}

export function getAccountId(): string | null {
	return _auth?.accountId ?? null;
}

export function isLoggedIn(): boolean {
	return _auth !== null;
}

export function getAccount(): DemoAccount | null {
	if (!_auth) return null;
	return DEMO_ACCOUNTS.find(a => a.id === _auth!.accountId) ?? null;
}
