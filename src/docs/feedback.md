# Feedback

## Eri's Feedback (Feb 20, 2026)

**Overall:** Good pitch deck, plan makes sense but is very heavy-loaded.

**Core critique:** The current deck covers 10 years of vision across 4 phases. That's useless for actual execution. You can't pitch someone on the distant future when 4 critical steps need to go right first.

**What's needed: A separate pitch deck focused ONLY on Step 1.**

This deck should answer:
- When you sit down for coffee with someone, what exactly do you say?
- How do you explain it in 3 sentences so they get it?
- Which specific people do you meet? Names, not categories.

**Concrete action items from Eri:**
1. Build a demo app (can be done in ~7.5 hours)
2. Create a step-by-step execution strategy with very detailed info
3. Go to Conad at Tegu, ask for the manager
4. Do web research on who these managers are, cross-reference LinkedIn
5. Get actual phone numbers
6. Actually talk to the people
7. Prepare a 3-sentence pitch. Trial and error until it works.

**On the UK coalition comparison:** "Earn at Conad, use at Neptun" — this existed in the UK (Nectar) but broke down because companies eventually opened their own cashback programs. Eri's take: "It's a good problem to have" — meaning if you get big enough that partners want to leave, you've already won.

**Bottom line:** "If what I'm telling you here turns you off, leave it, you're wasting your time." The hard part is sales and execution, not the tech or the vision.

---

# Original Research Notes

Alright, here's everything synthesized into what actually matters for you.
                                                                                                                        
  ShopBack's Journey - The Cliff Notes
                                                                                                                        
  Founded: August 2014, Singapore, by 4 ex-Zalora employees (university roommates). Built the prototype in a hotel room 
  in one week.
                                                                                                                        
  The trajectory that matters to you:

  ┌───────┬─────────────────────────────────────────────────────────────┬────────────────────┐
  │ Phase │                        What they did                        │      Capital       │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2014  │ Launched Singapore only. Pure cashback via affiliate links. │ $500K seed         │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2015  │ Malaysia + Philippines                                      │ $600K more         │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2016  │ Indonesia                                                   │ ~$14M raised       │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2017  │ 6 markets, 3.5M users                                       │ $25M Series A      │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2019  │ 19M users, $2B in merchant sales                            │ $45M               │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2022  │ Tried BNPL (buy now pay later). Huge mistake.               │ $200M Series F     │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2024  │ Killed BNPL, fired 24% of staff, CEO publicly apologized    │ -                  │
  ├───────┼─────────────────────────────────────────────────────────────┼────────────────────┤
  │ 2025  │ Back to basics, profitable, launched in US, 55M users       │ $332M total raised │
  └───────┴─────────────────────────────────────────────────────────────┴────────────────────┘

  The critical lesson: ShopBack's biggest failure was trying to become a fintech/payments company too early. The BNPL
  adventure nearly killed them. They survived by going back to pure cashback. Start with cashback. Only cashback. The
  payments stuff comes later (or never, from you).

  Now here's where it gets interesting for Albania

  I researched the Albanian market and honestly, the timing is almost suspiciously good:

  1. There is NO cashback aggregator in Albania. Zero. Nothing. The market is completely empty. Global players (Ibotta,
  Rakuten, ShopBack) don't operate there. Individual companies might have their own loyalty programs but nobody is
  aggregating them.

  2. The government is literally building the infrastructure for you. Prime Minister Rama announced in mid-2025 a plan
  to make Albania the world's first fully cashless society by 2030. They're:
  - Lowering cash payment limits (ALL 100,000 for businesses, ALL 500,000 for individuals)
  - Requiring all businesses to accept card payments by end of 2026
  - Joining SEPA (operational October 2025)
  - Building instant payment infrastructure with the Bank of Italy

  3. The fiskalizimi system is your secret weapon. Since 2021, every single receipt in Albania has a QR code with a NIVF
   (unique ID) that's verified by the tax authority in real-time. This means:
  - Receipt verification is already solved by the state
  - You don't need to build verification infrastructure
  - Every transaction in the country is traceable
  - The QR code contains: seller tax ID, items, amounts, VAT, date/time, payment method

  4. The problem you're solving is one the government wants solved. Albania's shadow economy is 30-50% of GDP. Many
  consumers don't bother asking for receipts. If your platform pays people cashback for scanning receipts, you're
  directly incentivizing tax compliance. This is the kind of thing that gets government support.

  The Realistic Path for a 3-Person Team

  Forget ShopBack's $500K start. Here's what actually applies to Albania (2.8M population, ~40% bank penetration):

  Phase 0: Validate (0 money, 1-2 months)

  - Talk to 5-10 companies. Do they want this? What cashback % would they offer? Would they pre-fund?
  - Talk to the tatime.gov.al people or use a third-party API (fature.al has a REST API for fiscal receipt data) to
  confirm you can programmatically verify receipts
  - If companies say no, stop here. Everything depends on merchant willingness.

  Phase 1: MVP (minimal capital, 3-6 months)

  - Mobile app (receipt scanning + balance display)
  - Backend (receipt verification via QR/NIVF, basic ledger)
  - 3-5 partner companies
  - NO wallet, NO withdrawals, NO money handling
  - Instead: cashback as vouchers/credits redeemable at the partner companies
  - This avoids all banking regulation entirely

  Why vouchers first? Because handling real money requires a license from the Bank of Albania.

  Phase 2: Add Money (requires licensing)

  This is where your "PayPal ripoff" concern kicks in. To hold user funds and allow withdrawals, you need either:

  Option A: Get your own Electronic Money Institution (EMI) license from the Bank of Albania
  - Minimum capital: EUR 20,000 - 375,000 depending on services
  - Regulatory compliance, KYC/AML, auditing
  - Timeline: 6-12 months for approval

  Option B (smarter): Partner with someone who already has one
  - EasyPay - first open banking licensee in Albania, already has EMI license
  - Paysera Albania - EMI licensed since 2021
  - You handle the cashback/merchant side, they handle the money side
  - This is probably your best path. You don't need to be a bank.

  Phase 3: The Apple Pay dream

  This is the China/ShopBack Pay vision. Only consider this after:
  - You have 50K+ active users
  - Multiple companies are pre-funding
  - You have regulatory partnership or your own license
  - Probably need external investment at this point

  The Capital Question

  For Albania's market, realistically:

  ┌────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
  │       Phase        │                                     What you need                                     │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ Phase 1 (vouchers) │ EUR 5-15K (servers, app store fees, legal setup)                                      │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ Phase 2 (money)    │ EUR 50-100K if partnering with existing EMI, EUR 200-400K if getting your own license │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ Phase 3 (payments) │ External investment, probably EUR 500K+                                               │
  └────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘

  ShopBack needed $332M because they expanded to 13 countries. You're doing one country with 2.8M people. The economics
  are completely different.

  My Hard Questions for You

  1. Have you talked to a single company yet? This is make-or-break. If you've only talked to each other, stop coding
  and start calling businesses tomorrow.
  2. Which companies specifically? Supermarkets (Conad, Spar, Big Market)? Telecoms (Vodafone, One)? Fuel stations? The
  type of company determines everything about your model.
  3. Why would a company that already has its own loyalty program give you a cut? Your answer to this question IS your
  business. "Access to our users" only works if you have users. Classic chicken-and-egg.
  4. The fiskalizimi angle - have you considered pitching this to the government directly? "We incentivize consumers to
  demand fiscal receipts, reducing the shadow economy" is a pitch that could get you a government partnership or grant.
  Albania is actively looking for solutions to this problem.
  5. Who are the other 2 people on your team? If one of them can sell to businesses, that's more valuable than another
  programmer right now.

  The One Thing I'd Do Differently From Your Original Design

  Kill the "company confirms each receipt" flow. Replace it with:

  Company signs deal → Pre-funds cashback pool →
  User scans receipt → Platform auto-verifies via
  fiskalizimi QR → User gets credited instantly

  Reconcile with companies monthly. No human in the loop per transaction. This is how every successful cashback platform
   works and it's the only way it scales.

  The fiskalizimi system makes this possible in a way that's actually easier than what Ibotta has to deal with in the US
   (where there's no universal receipt verification standard). Albania's fiscal infrastructure is genuinely an advantage
   here.
