import { redirect } from '@sveltejs/kit';
import { bank } from '$lib/server/bank';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const tin = url.searchParams.get('tin');
	if (!tin) redirect(303, '/admin/scan');

	const company = bank.getCompanyByTin(tin);
	if (!company) redirect(303, '/admin/scan');

	return {
		company: {
			name: company.name,
			tin: company.tin,
			cashbackPercent: company.cashbackPercent,
			logoEmoji: company.logoEmoji,
		},
	};
};
