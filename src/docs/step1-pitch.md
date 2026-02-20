# Step 1: Execution Plan

## The 3-Sentence Pitch

### Albanian (for the business owner)

"Kur klienti juaj paguan, ai skanon faturën me telefonin dhe merr 10% zbritje herën tjetër. Ju nuk keni nevojë për asgjë të re — thjesht një kartë në banak dhe një fjali nga stafi. 3 muaj falas — nëse nuk funksionon, hiqeni kartën."

### English

"When your customer pays, they scan the receipt with their phone and get 10% off next time. You don't need anything new — just a card on your counter and one sentence from your staff. 3 months free — if it doesn't work, remove the card."

### Why these 3 sentences work

- **Sentence 1:** Shows the value immediately (customer comes back)
- **Sentence 2:** Removes all objections (no cost, no hardware, no training)
- **Sentence 3:** Removes risk (free trial, easy exit)

---

## Pushback: Why the Demo App Spec is Wrong

### What was proposed

1. Login/register with email/password
2. Scan receipt / manually enter NIVF
3. Open tatime.gov.al verification link, send to company, mark as pending
4. Pending/complete list, receipt history, total cashback balance
5. Transfer from platform account to user BKT account via IBAN
6. Company sends money from their BKT to platform BKT
7. Platform moves money from business account to customer account

### What's actually being described

Steps 5-7 are a payment processor. You're building a bank — holding funds, moving money between accounts, IBAN transfers. This requires:

- **EMI license** from Bank of Albania (EUR 20K-375K capital, 6-12 months approval)
- **KYC/AML compliance** (identity verification for every user)
- **PCI DSS compliance** (if touching card data)
- **Monthly auditing and reporting** to the central bank

You cannot demo this. You cannot build this in Phase 1. You will spend 12 months on licensing before serving a single customer.

### "Send link to company, mark as pending" is also wrong

This puts a human in the loop for every single receipt. Cafe X gets 50 scanned receipts per day. Someone at Cafe X has to click "approve" on each one? This is exactly what the research said kills platforms — Fetch Rewards had people manually typing receipts until 2AM. The fiskalizimi QR code EXISTS so you don't need human verification.

### What Eri said (and he's right)

"You need full focus on how to execute step 1."

Step 1 is NOT building an app. Step 1 is sitting across from a business owner and hearing them say "yes, I'd try this." The app is a prop for that conversation.

---

## What the Demo Should Actually Be

A single-screen app you show on your phone during the meeting. Total build time: one afternoon.

### The demo flow (what you show the business owner)

1. Open app → camera activates
2. Scan any fiscal receipt QR code
3. Screen shows: fiskalizimi verified ✓, merchant name, amount, date
4. Screen shows: "10% off next visit — valid 7 days"
5. Done.

That's the entire demo. Five seconds. The business owner sees exactly what the customer would see.

### What you DON'T need for the demo

- No login/register (waste of time for a demo)
- No database (just show the fiskalizimi response)
- No pending/complete states (no human approval needed)
- No money movement (cashback is a discount, not a transfer)
- No IBAN anything (that's Phase 3, a year from now)

### What goes on the counter card (mockup to bring to meetings)

```
┌─────────────────────────────┐
│                             │
│   Skano faturën,            │
│   merr 10% zbritje          │
│   herën tjetër              │
│                             │
│        [QR CODE]            │
│   (links to app download)   │
│                             │
│   cashback.al               │
│                             │
└─────────────────────────────┘
```

Print 5 of these. Bring them to meetings. "This is what goes on your counter."

---

## How Cashback Actually Works (No Bank Needed)

### Phase 1: Discount model (no money moves)

The cashback is NOT real money. It's a discount code.

```
Customer scans receipt at Cafe X
  → App shows: "10% off next visit, valid 7 days"
  → App generates 6-character code

Customer returns to Cafe X within 7 days
  → Shows code to cashier
  → Cashier types code into bookmarked verification page
  → Page says: "Valid — 10% off, max 500 LEK"
  → Cashier applies discount manually

That's it. No money moved. No bank needed.
The cafe gave a discount to get a returning customer.
```

### Phase 2: Prepaid balance (still no bank needed)

Once you have 30+ merchants:
- Merchant deposits 10,000 LEK into platform via bank transfer
- Each redemption deducts 30 LEK fee from their balance
- Balance hits zero → offers pause until they top up
- Monthly invoice auto-generated

This is a prepaid SaaS model. You're selling software, not moving money.

### Phase 3: Real cashback (need EasyPay/Paysera partnership)

Only after 50K+ users and proven merchant demand:
- Partner with EasyPay (they have the EMI license)
- They handle wallets, withdrawals, compliance
- You handle the merchant/consumer platform

This is 12-18 months away. Don't build it. Don't think about it.

---

## Who to Talk To (Specific First Targets)

### Category exclusivity targets — Tirana

| Category | Target #1 | Why | Location to visit |
|----------|-----------|-----|-------------------|
| Supermarket | Conad | Biggest chain, most locations | Conad Tegu |
| Electronics | Neptun | Only major chain | Neptun TEG |
| Cafe/Restaurant | Mon Cheri or Mulliri Vjeter | High-traffic, repeat customers | Any central location |
| Pharmacy | Pharmacy 1 or Farma Net | Daily repeat visits | Near Blloku |
| Fuel | Kastrati | Largest fuel network | Any station |
| Telecom | Vodafone AL | Largest subscriber base | Vodafone store Tirana |

### How to find the decision maker

1. LinkedIn search: "[Company name] Albania" → filter by "Manager", "Director", "Marketing"
2. Instagram: Most Albanian businesses are very active on Instagram. DM works.
3. Walk in: Ask for the store manager. If they can't decide, ask who can. Get a name and number.
4. The magic question: "Kush vendos për marketingun?" (Who decides on marketing?)

---

## The Meeting Script

### Before the meeting
- Have the demo app on your phone (receipt scanning works)
- Have 2 printed counter card mockups
- Have a one-page summary (not the full pitch deck)

### The conversation (5 minutes max)

**Open (30 seconds):**
"Dua të krijoj një platformë që i kthen klientët tuaj. Nuk kam nevojë për asgjë prej jush sot — vetëm 5 minuta."

*(I want to build a platform that brings your customers back. I don't need anything from you today — just 5 minutes.)*

**Demo (60 seconds):**
Pull out phone. Scan a receipt from their business (buy a coffee first).
"Shikoni — klienti skanon faturën, dhe merr 10% zbritje herën tjetër. Automatikisht. Fiskalizimi e verifikon."

*(Look — the customer scans the receipt and gets 10% off next time. Automatically. Fiskalizimi verifies it.)*

**The pitch (30 seconds):**
The 3 sentences from above.

**The ask (30 seconds):**
"Dua të provoj këtë me 5 biznese në Tiranë. Ju do të ishit i vetmi [supermarket/kafe/farmaci] në platformë. 3 muaj falas. Çfarë mendoni?"

*(I want to test this with 5 businesses in Tirana. You'd be the only [supermarket/cafe/pharmacy] on the platform. 3 months free. What do you think?)*

**Listen (2-3 minutes):**
Shut up. Write down everything they say. The objections ARE the product research.

### Key objections and responses

| Objection | Response |
|-----------|----------|
| "We already have a loyalty program" | "Perfect — your customers would earn here AND at other businesses. More reason to use your card." |
| "How many users do you have?" | "We're launching with 5 exclusive partners. You'd be the first [category]. That's the point — exclusivity." |
| "What does it cost?" | "Nothing for 3 months. After that, you pay only when a customer actually comes back. 30 LEK per return visit." |
| "I need to ask my boss" | "Of course. Can I get their name so I can send a one-page summary?" |
| "I don't understand" | Show the demo again. Slower. "Klienti skanon, merr zbritje, kthehet." |

---

## Validation Criteria

After 10 conversations:

| Result | Action |
|--------|--------|
| 6+ say "yes, I'd try this" | Build the MVP |
| 3-5 say yes | Refine the pitch, try different angles, talk to 10 more |
| 0-2 say yes | Stop. The idea doesn't work in this form. |

**What counts as "yes":** They give you a name/number to follow up with, or they say "come back when it's ready" with specifics about what they'd want.

**What doesn't count:** Polite nodding. "Interesting." "Maybe." These are nos.
