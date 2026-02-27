import { getAllCompanies, removeCompany } from '$lib/server/bank.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		companies: getAllCompanies().map(c => ({
			name: c.name,
			tin: c.tin,
			cashbackPercent: c.cashbackPercent,
			logoEmoji: c.logoEmoji,
		})),
	};
};

export const actions = {
	remove: async ({ request }) => {
		const data = await request.formData();
		const tin = data.get('tin') as string;

		if (!tin) {
			return { success: false, error: 'NIPT mungon' };
		}

		const removed = removeCompany(tin);
		if (!removed) {
			return { success: false, error: `Kompania me NIPT ${tin} nuk u gjet` };
		}

		return { success: true, removed: true };
	},
} satisfies Actions;
