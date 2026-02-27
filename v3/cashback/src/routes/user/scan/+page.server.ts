import { redirect } from '@sveltejs/kit';
import { bank } from '$lib/server/bank';
import { parseFiskalizimiUrl, getSample } from '$lib/receipt/parser';
import type { Actions } from './$types';

function processAndRedirect(userId: string, iic: string, tin: string, prc: string, crtd: string): never {
	if (bank.isReceiptProcessed(iic)) {
		redirect(303, `/user/scan/error?message=${encodeURIComponent('Kjo faturë është skanuar më parë')}`);
	}

	const company = bank.getCompanyByTin(tin);
	if (!company) {
		redirect(303, `/user/scan/error?message=${encodeURIComponent('Kompania nuk është regjistruar në platformë')}`);
	}

	const totalAmount = parseFloat(prc);
	if (isNaN(totalAmount) || totalAmount <= 0) {
		redirect(303, `/user/scan/error?message=${encodeURIComponent('Shuma e faturës nuk është e vlefshme')}`);
	}

	const receipt = bank.processReceipt(userId, company.id, iic, tin, totalAmount, crtd);
	const tx = bank.creditCashback(receipt);

	const params = new URLSearchParams({
		iic,
		tin,
		total: String(totalAmount),
		cashback: String(receipt.cashbackAmount),
		date: crtd,
		status: tx ? 'credited' : 'pending',
	});
	redirect(303, `/user/scan/result?${params}`);
}

export const actions = {
	process: async ({ request, locals }) => {
		const uid = locals.accountId!;
		const data = await request.formData();
		const raw = data.get('raw') as string;

		const parsed = parseFiskalizimiUrl(raw);
		if (!parsed) {
			redirect(303, `/user/scan/error?message=${encodeURIComponent('URL ose NIVF i pavlefshëm')}`);
		}

		processAndRedirect(uid, parsed.iic, parsed.tin, parsed.prc, parsed.crtd);
	},

	sample: async ({ locals }) => {
		const uid = locals.accountId!;
		const sample = getSample();
		processAndRedirect(uid, sample.iic, sample.tin, sample.prc, sample.crtd);
	},

	duplicate: async ({ locals }) => {
		const uid = locals.accountId!;
		const existing = bank.getReceiptsByUser(uid);
		if (existing.length === 0) {
			const sample = getSample();
			processAndRedirect(uid, sample.iic, sample.tin, sample.prc, sample.crtd);
		}
		const r = existing[0];
		processAndRedirect(uid, r.iic, r.tin, String(r.totalAmount), r.receiptDate);
	},
} satisfies Actions;
