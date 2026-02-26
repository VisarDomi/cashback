import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = event.cookies.get('cashback_session');
	if (cookie) {
		try {
			const parsed = JSON.parse(cookie);
			if (parsed.accountId && parsed.role) {
				event.locals.accountId = parsed.accountId;
				event.locals.role = parsed.role;
			}
		} catch {
			// invalid cookie — ignore
		}
	}
	return resolve(event);
};
