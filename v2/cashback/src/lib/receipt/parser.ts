export interface ReceiptData {
	iic: string;
	tin: string;
	crtd: string;
	prc: string;
}

const SAMPLE_PRICES = [350, 480, 650, 850, 1200, 1500, 1800, 2400, 3200, 4500];

function randomHex(len: number): string {
	const chars = '0123456789ABCDEF';
	let s = '';
	for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * 16)];
	return s;
}

function randomSample(): ReceiptData {
	const now = new Date();
	// Random time in the last 2 hours
	const offset = Math.floor(Math.random() * 7200_000);
	const d = new Date(now.getTime() - offset);
	return {
		iic: randomHex(16),
		tin: 'L62203504M',
		crtd: d.toISOString().slice(0, 19),
		prc: String(SAMPLE_PRICES[Math.floor(Math.random() * SAMPLE_PRICES.length)]),
	};
}

export function parseFiskalizimiUrl(raw: string): ReceiptData | null {
	try {
		const trimmed = raw.trim();

		if (trimmed.includes('efiskalizimi') || trimmed.includes('invoice-check')) {
			const hashPart = trimmed.split('#')[1];
			if (!hashPart) return null;
			const queryStr = hashPart.replace(/^\/verify\?/, '');
			const params = new URLSearchParams(queryStr);
			const iic = params.get('iic');
			const tin = params.get('tin');
			const crtd = params.get('crtd');
			const prc = params.get('prc');
			if (iic && tin && crtd && prc) {
				return { iic, tin, crtd, prc };
			}
		}

		if (/^[A-Za-z0-9-]{8,}$/.test(trimmed)) {
			return { ...randomSample(), iic: trimmed };
		}

		return null;
	} catch {
		return null;
	}
}

export function getSample(): ReceiptData {
	return randomSample();
}
