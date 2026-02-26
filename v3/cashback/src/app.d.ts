import type { Role } from '$lib/auth/accounts.ts';

declare global {
	namespace App {
		interface Locals {
			accountId?: string;
			role?: Role;
		}
	}
}

export {};
