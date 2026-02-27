import { redirect } from '@sveltejs/kit';
import { bank, addCompany } from '$lib/server/bank';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const tin = url.searchParams.get('tin');
	if (!tin) redirect(303, '/admin/scan');

	return { tin };
};

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const tin = data.get('tin') as string;
		const name = (data.get('name') as string)?.trim() || tin;

		if (!tin) {
			redirect(303, `/admin/scan/error?message=${encodeURIComponent('NIPT mungon')}`);
		}

		const existing = bank.getCompanyByTin(tin);
		if (existing) {
			redirect(303, `/admin/scan/error?message=${encodeURIComponent(`Kompania me NIPT ${tin} ekziston tashmë`)}`);
		}

		addCompany(tin, name, 5, '🏪');

		redirect(303, `/admin/scan/added?tin=${encodeURIComponent(tin)}`);
	},
} satisfies Actions;
