export interface ReceiptData {
	iic: string;
	tin: string;
	crtd: string;
	prc: string;
}

const SAMPLE: ReceiptData = {
	iic: '9A5D3E8F2B1C7040',
	tin: 'L62203504M',
	crtd: '2026-02-26T14:30:00',
	prc: '850.00',
};

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
			return { ...SAMPLE, iic: trimmed };
		}

		return null;
	} catch {
		return null;
	}
}

export function getSample(): ReceiptData {
	return { ...SAMPLE };
}
