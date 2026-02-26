export function formatCurrency(amount: number): string {
	return amount.toLocaleString('sq-AL') + ' LEK';
}

export function formatDate(iso: string): string {
	try {
		const d = new Date(iso);
		return d.toLocaleDateString('sq-AL', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}) + ' — ' + d.toLocaleTimeString('sq-AL', {
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return iso;
	}
}

export function formatDateShort(iso: string): string {
	try {
		const d = new Date(iso);
		return d.toLocaleDateString('sq-AL', {
			day: '2-digit',
			month: '2-digit',
		});
	} catch {
		return iso;
	}
}
