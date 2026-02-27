import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const iic = url.searchParams.get('iic');
	const tin = url.searchParams.get('tin');
	const total = url.searchParams.get('total');
	const cashback = url.searchParams.get('cashback');
	const date = url.searchParams.get('date');

	if (!iic || !tin || !total || !cashback || !date) {
		redirect(303, '/user/scan');
	}

	return {
		receipt: {
			iic,
			tin,
			total: parseFloat(total),
			cashback: parseFloat(cashback),
			date,
		},
	};
};
