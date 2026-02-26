# Cashback Platform Albania - Brainstorm Condensed

## The Two Visions

### Vision A: WeChat Pay for Albania (Ideal, Long-term)
A phone-based payment platform that lets every Albanian pay for everything from their phone. Not dependent on Apple Pay or any foreign company. Built on Albania's existing infrastructure (e-Albania, fiskalizimi). This is the endgame, not the starting point.

### Vision B: Loyalty/Cashback Aggregator (Realistic, Start Here)
A platform that centralizes loyalty programs from Albanian companies (Neptun, Conad, BKT, etc.) into one app. Users earn rewards across all partners. This is the entry point that builds the user base, merchant relationships, and infrastructure needed for Vision A.

---

## Why Albania, Why Now

### The government is building the infrastructure for us
- PM Rama announced goal: world's first cashless society by 2030
- Cash payment limits being lowered (ALL 100,000 B2B, ALL 500,000 individuals)
- All businesses must accept card payments by end of 2026
- SEPA integration operational October 2025
- Instant payment infrastructure being built with Bank of Italy

### Fiskalizimi is our secret weapon
- Since 2021, every receipt in Albania has a QR code verified by the state in real-time
- Each receipt contains: NIVF (unique ID), merchant tax ID, items, amounts, VAT, date/time
- Receipt verification is already solved - we don't need to build it
- Third-party APIs exist (fature.al has a REST API)
- This is better infrastructure than what US cashback apps have

### The market is empty
- No cashback aggregator exists in Albania. Zero competition.
- Global players (Ibotta, Rakuten, ShopBack) don't operate here
- Individual companies have basic loyalty programs but nobody aggregates them
- Albania's fintech ecosystem is focused on basic payments, not loyalty/rewards

### Albania's advantages for leapfrogging
- Less legacy infrastructure to replace (unlike US/Europe with entrenched card networks)
- Small population (2.8M) = faster adoption curves
- e-Albania provides centralized digital identity
- ~85% internet penetration, ~80% smartphone usage
- Shadow economy is 30-50% of GDP - government actively wants solutions

### Albania's challenges
- Only ~40% of adults have bank accounts
- Only ~34% trust banks
- Electronic payments: 21/person/year vs 500+ European average
- Cash culture is deeply rooted
- Small fintech talent pool
- Cybersecurity concerns (2024 government cyberattacks)

---

## Historical Precedents - What Worked

### Payback (Germany) - THE model for us
- **Founded:** 1998, 3 employees, ZERO venture capital
- **How:** Pre-recruited 9 partners across different sectors before launch
- **Key rules:** Category exclusivity (one supermarket, one electronics store, etc.), no data sharing between partners, prestige recruitment (only top companies)
- **Result:** 1M customers in month one. Now 35M active users, 700+ partners
- **Exit:** Sold to American Express for EUR 500M
- **Lesson:** Category exclusivity + no cross-partner data sharing + prestige recruitment = the formula

### Stocard (Germany) - The launch hack
- **Founded:** 2012 by three university students
- **How:** No permission needed from retailers. Users scanned existing physical loyalty card barcodes into the app
- **Bypassed chicken-and-egg entirely** - app was useful from day one
- **Result:** 70M users, only $31M total funding, acquired by Klarna for ~EUR 120M
- **Lesson:** No-permission aggregation is the most capital-efficient cold-start strategy

### ShopBack (Southeast Asia) - The growth trajectory
- **Founded:** 2014, Singapore, $500K seed. Prototype built in a hotel room in one week
- **Journey:** Pure cashback → 13 markets → Tried BNPL (almost died) → Back to basics → Profitable 2025
- **Total raised:** $332M across 10 rounds. 55M users globally
- **Biggest failure:** The BNPL expansion nearly killed them. Fired 24% of staff. CEO publicly apologized.
- **Lesson:** Start with cashback, don't try to become a fintech too early

### Ibotta (US) - The B2B pivot
- **Founded:** 2011, IPO'd 2024 at $2.7B valuation
- **How they got brands:** Pay-per-sale model (zero risk for brands)
- **Key pivot:** 2017 - from consumer app to B2B infrastructure (Ibotta Performance Network)
- **Lesson:** The consumer app alone isn't defensible. The data and merchant infrastructure is.

### Nectar (UK) - The warning
- **Founded:** 2002 as coalition of Sainsbury's, BP, Barclaycard
- **What killed it:** Partners left. BP left 2019, British Gas 2015. As loyalty tech got cheaper, companies preferred DIY.
- **Value collapse:** GBP 368M (2007) → GBP 60M (2018). 84% destruction.
- **Lesson:** Lock in long-term exclusive contracts. Without them, partners leave when they can afford their own tech.

### China's Mobile Payments - The endgame reference
- Alipay started as escrow for Taobao (solved trust in e-commerce), not as a payment platform
- WeChat Pay succeeded because it was embedded in an app 600M people already used
- QR codes eliminated need for expensive POS hardware
- "Red Envelope" viral moment during Chinese New Year drove mass adoption
- Key: they solved a real pain point first, then added payments

---

## Business Models Explored

### Model 1: Pure Cashback with Money (Strong but needs license)
- User scans receipt → gets real money in app balance → withdraws to bank
- Strongest consumer proposition
- Requires EMI license from Bank of Albania (EUR 20K-375K capital) OR partnership with licensed entity
- Licensed entities in Albania: EasyPay (first open banking license), Paysera (EMI since 2021)
- **Verdict:** Too complex for launch. Come back to this with traction.

### Model 2: Cross-Merchant Credits (No license needed but weak sell)
- User earns "platform credits" spendable at any partner merchant
- No real money = no licensing
- Weak consumer proposition if partner network is small
- **Verdict:** Possible but not compelling enough.

### Model 3: Outsourced Loyalty Infrastructure (Payback model - RECOMMENDED)
- Platform provides loyalty/rewards infrastructure to companies
- Companies set their own offers (discounts, points, rewards for returning customers)
- Users consolidate all loyalty programs in one app
- No money flows through platform (only B2B service fees from merchants)
- No financial license needed
- Revenue: merchant subscription or per-redemption fee
- **Verdict:** Best fit for team size, capital, and regulatory constraints.

### Model 4: No-Permission Card Aggregator (Stocard model - LAUNCH HACK)
- Digitize existing loyalty cards without merchant permission
- Build user base first, then approach merchants for official partnerships
- Combined with Model 3 for the full play
- **Verdict:** Best cold-start strategy. Launch with this, evolve into Model 3.

---

## The Recommended Path

### Phase 0: Validate (0 capital, 1-2 months)
- Talk to 5-10 companies (Neptun, Conad, BKT, cafes, gas stations)
- Ask: Would you join a shared loyalty platform? What would you offer?
- Confirm fiskalizimi QR code verification works programmatically (test fature.al API)
- Research what loyalty cards/programs already exist in Albania
- **If companies say no → stop. If fiskalizimi API doesn't work → find alternative.**

### Phase 1: Stocard Hack (EUR 5-15K, months 2-6)
- Build app that digitizes existing Albanian loyalty cards (no permission needed)
- Users scan their Conad card, Neptun card, BKT card into the app
- Add receipt scanning via fiskalizimi QR codes (track purchases automatically)
- No merchant partnerships needed yet
- Target: 3,000-5,000 users in Tirana
- **Goal: prove users want a consolidated loyalty app**

### Phase 2: Payback Model (EUR 5-15K more, months 6-12)
- Approach companies with user data: "X thousand of your customers already use our app"
- Pitch: category exclusivity, shared costs, cross-sector earning
- Onboard 5-10 partners with exclusive contracts (minimum 2-3 years)
- Companies set their own loyalty offers through platform dashboard
- Launch with free pilot (3 months), then transition to paid model
- Revenue: per-redemption fee (30-50 LEK per redemption) from prepaid merchant balance
- Target: 10,000-20,000 users, 15-30 merchants

### Phase 3: Add Real Money (EUR 50-100K if partnering, months 12-24)
- Partner with EasyPay or Paysera for financial infrastructure
- Add ability to withdraw loyalty earnings as real money
- This is when the platform becomes genuinely compelling for consumers
- Requires proven traction to negotiate the partnership

### Phase 4: The Bigger Vision (Year 2+, needs investment)
- Add payment capability (scan QR to pay, not just to earn)
- Built on fiskalizimi infrastructure
- This is where the WeChat/Alipay vision starts to materialize
- Requires either own EMI license or deep partnership with licensed entity
- This is the pitch for the PM - with real users and real data behind it

---

## How It Works - Detailed Flows

### Merchant Onboarding (Phase 2)
1. Partner walks into business, gives the pitch
2. Business owner signs up through web dashboard (or partner does it for them)
3. Business configures their offer: "10% off next visit within 7 days, max 500 LEK"
4. Platform provides: counter card for register, window sticker, one-line cashier script
5. Business gets merchant verification page (bookmarked URL, no app needed)

### Customer Flow
1. Customer sees counter card at register, scans QR to download app
2. First time: install app → camera opens → scan receipt QR → see reward → done (no signup)
3. Returning: open app → scan receipt → see reward → come back within 7 days → show code → get discount
4. Registration (phone number) only required when redeeming

### Merchant Fee Collection (Phase 2, paid period)
1. Merchant deposits prepaid balance via bank transfer to platform's business account
2. Per-redemption fee (30-50 LEK) auto-deducted from balance
3. Monthly fiscalized invoice generated automatically for merchant's records
4. Offers pause automatically when balance hits zero
5. Email alert at 20% balance remaining

### Discount Redemption at Register
1. Customer shows 6-character code or QR code on phone
2. Cashier types code into bookmarked merchant verification page (or scans QR)
3. Page shows: "Valid - 10% off, max 500 LEK"
4. Cashier applies discount manually
5. Code marked as redeemed, can't be reused

---

## Revenue Model

### Primary: Per-Redemption Fee (Recommended)
- 30-50 LEK per redemption
- Merchant pays only when they get a returning customer
- Easy to explain: "You pay 30 LEK, the customer spends 200 LEK"

### Alternative: Monthly Subscription
- Free tier: up to 50 redemptions/month
- Basic: 3,000 LEK/month (~EUR 27) - up to 200 redemptions
- Pro: 8,000 LEK/month (~EUR 73) - unlimited + analytics

### Future: Data Insights (Phase 3+)
- Anonymized cross-sector shopping behavior
- Customer segmentation and targeting
- Marketing campaign performance data

---

## Capital Requirements

| Phase | Capital Needed | What It Covers |
|-------|---------------|----------------|
| Phase 0 (Validate) | EUR 0 | Conversations, testing APIs |
| Phase 1 (Stocard hack) | EUR 5-15K | Servers, app store fees, legal setup |
| Phase 2 (Payback model) | EUR 5-15K more | Merchant materials, marketing, expanded infra |
| Phase 3 (Real money) | EUR 50-100K | EasyPay/Paysera partnership, compliance |
| Phase 4 (Payments) | EUR 500K+ | EMI license or deep integration, external investment |

---

## Key Risks

| Risk | Mitigation |
|------|------------|
| Companies refuse to join | Validate in Phase 0. If no, pivot or stop. |
| Anchor partner leaves (Nectar problem) | Long-term exclusive contracts (3+ years) from day one |
| Fiskalizimi API access blocked | Use fature.al third-party API or direct QR code parsing |
| EasyPay/Paysera refuse partnership | Apply for own license or stay in voucher/loyalty-only mode |
| Receipt fraud (scanning others' receipts) | First-claim-only per NIVF. For loyalty (not money), risk is low. |
| Someone with more connections copies the idea | Build fast, get traction before talking to politicians |
| Market too small (2.8M population) | Focus on Tirana first (~800K). Prove unit economics before expanding. |
| Government changes direction | Diversify - don't depend on government support for core business |

---

## Key Entities in the Albanian Ecosystem

| Entity | What They Are | Relevance |
|--------|--------------|-----------|
| EasyPay | First open banking licensee, EMI since 2010 | Potential partner for money movement |
| Paysera Albania | EMI licensed since 2021 | Alternative partner |
| PayLink | National card payment operator | Infrastructure layer |
| Bank of Albania | Regulator | Licenses EMI/PI under Law 55/2020 |
| tatime.gov.al | Tax authority, runs fiskalizimi | Receipt verification infrastructure |
| fature.al | Third-party fiscalization API | Technical integration point |
| e-Albania | Digital identity platform | Potential KYC integration |

---

## Immediate Next Steps

1. **Research existing Albanian loyalty programs** - What cards do Neptun, Conad, BKT, and others currently offer? Physical cards? Apps? Points systems?
2. **Test fiskalizimi QR codes** - Get a receipt, scan the QR, see what data comes back. Test fature.al API.
3. **Talk to 5 business owners** - Not a sales pitch. Just: "Would you be interested in this? What would make you say yes?"
4. **Talk to EasyPay** - Understand their roadmap. Are they a partner, competitor, or acquirer?
5. **Define the MVP feature set** - Based on validation results
6. **Register the business** - Needed for fiskalizimi integration and merchant contracts
