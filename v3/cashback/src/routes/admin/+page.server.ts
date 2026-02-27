import { bank } from '$lib/server/bank.ts';
import { addCompany, removeCompany } from '$lib/server/bank.ts';
import { parseFiskalizimiUrl } from '$lib/receipt/parser.ts';
import type { Actions } from './$types';

export const actions = {
	scan: async ({ request }) => {
		const data = await request.formData();
		const raw = data.get('raw') as string;

		const parsed = parseFiskalizimiUrl(raw);
		if (!parsed) {
			return { success: false, error: 'URL ose NIVF i pavlefshm' };
		}

		const existing = bank.getCompanyByTin(parsed.tin);
		if (existing) {
			return {
				success: true,
				exists: true,
				company: {
					name: existing.name,
					tin: existing.tin,
					cashbackPercent: existing.cashbackPercent,
					logoEmoji: existing.logoEmoji,
				},
				tin: parsed.tin,
			};
		}

		return {
			success: true,
			exists: false,
			tin: parsed.tin,
		};
	},

	add: async ({ request }) => {
		const data = await request.formData();
		const tin = data.get('tin') as string;
		const name = (data.get('name') as string)?.trim() || tin;

		if (!tin) {
			return { success: false, error: 'NIPT mungon' };
		}

		// Double-check it doesn't already exist
		const existing = bank.getCompanyByTin(tin);
		if (existing) {
			return {
				success: false,
				error: `Kompania me NIPT ${tin} ekziston tashmë`,
			};
		}

		const company = addCompany(tin, name, 5, '🏪');

		return {
			success: true,
			added: true,
			company: {
				name: company.name,
				tin: company.tin,
				cashbackPercent: company.cashbackPercent,
				logoEmoji: company.logoEmoji,
			},
		};
	},
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

		return {
			success: true,
			removed: true,
			tin,
		};
	},
} satisfies Actions;
