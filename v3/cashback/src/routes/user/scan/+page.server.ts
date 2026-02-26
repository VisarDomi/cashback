import { bank } from '$lib/server/bank.ts';
import { parseFiskalizimiUrl, getSample } from '$lib/receipt/parser.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {};
};

function processReceipt(userId: string, iic: string, tin: string, prc: string, crtd: string) {
	if (bank.isReceiptProcessed(iic)) {
		return { success: false, error: 'Kjo faturë është skanuar më parë' };
	}

	const company = bank.getCompanyByTin(tin);
	if (!company) {
		return { success: false, error: 'Kompania nuk është regjistruar në platformë' };
	}

	const totalAmount = parseFloat(prc);
	if (isNaN(totalAmount) || totalAmount <= 0) {
		return { success: false, error: 'Shuma e faturës nuk është e vlefshme' };
	}

	const receipt = bank.processReceipt(userId, company.id, iic, tin, totalAmount, crtd);
	bank.creditCashback(receipt);

	return {
		success: true,
		receipt: {
			iic,
			tin,
			total: totalAmount,
			cashback: receipt.cashbackAmount,
			date: crtd,
		},
	};
}

export const actions = {
	process: async ({ request, locals }) => {
		const uid = locals.accountId!;
		const data = await request.formData();
		const raw = data.get('raw') as string;

		const parsed = parseFiskalizimiUrl(raw);
		if (!parsed) {
			return { success: false, error: 'URL ose NIVF i pavlefshëm' };
		}

		return processReceipt(uid, parsed.iic, parsed.tin, parsed.prc, parsed.crtd);
	},

	sample: async ({ locals }) => {
		const uid = locals.accountId!;
		const sample = getSample();
		return processReceipt(uid, sample.iic, sample.tin, sample.prc, sample.crtd);
	},

	duplicate: async ({ locals }) => {
		const uid = locals.accountId!;
		const existing = bank.getReceiptsByUser(uid);
		if (existing.length === 0) {
			const sample = getSample();
			return processReceipt(uid, sample.iic, sample.tin, sample.prc, sample.crtd);
		}
		const r = existing[0];
		return processReceipt(uid, r.iic, r.tin, String(r.totalAmount), r.receiptDate);
	},
} satisfies Actions;
