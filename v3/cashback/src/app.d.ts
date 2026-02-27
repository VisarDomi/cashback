import type { Role } from '$lib/auth/accounts';

declare global {
	namespace App {
		interface Locals {
			accountId?: string;
			role?: Role;
		}
	}
}

export {};
