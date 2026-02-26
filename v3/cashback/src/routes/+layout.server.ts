import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		accountId: locals.accountId ?? null,
		role: locals.role ?? null,
	};
};
