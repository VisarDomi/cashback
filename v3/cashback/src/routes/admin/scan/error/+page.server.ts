import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	return {
		message: url.searchParams.get('message') || 'Gabim',
	};
};
