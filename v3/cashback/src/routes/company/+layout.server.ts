import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.accountId || locals.role !== 'company') {
		redirect(303, '/');
	}
};
