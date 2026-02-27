import { redirect } from '@sveltejs/kit';
import { bank } from '$lib/server/bank.ts';
import { parseFiskalizimiUrl } from '$lib/receipt/parser.ts';
import type { Actions } from './$types';

export const actions = {
	scan: async ({ request }) => {
		const data = await request.formData();
		const raw = data.get('raw') as string;

		const parsed = parseFiskalizimiUrl(raw);
		if (!parsed) {
			redirect(303, `/admin/scan/error?message=${encodeURIComponent('URL ose NIVF i pavlefshm')}`);
		}

		const existing = bank.getCompanyByTin(parsed.tin);
		if (existing) {
			redirect(303, `/admin/scan/exists?tin=${encodeURIComponent(parsed.tin)}`);
		}

		redirect(303, `/admin/scan/new?tin=${encodeURIComponent(parsed.tin)}`);
	},
} satisfies Actions;
