# Stripe Payment Integration

This document outlines the Stripe payment integration for the **OrderXpress POS System**, including setup steps, environment configuration, and architectural flow. Note that this implementation uses **Stripe Checkout**, which handles PCI-compliant secure transactions using Stripe-hosted payment pages.

## 1. Prerequisites

To test and use credit card payments in OrderXpress, you must have a Stripe Developer account. Follow these steps:

- Go to [Stripe Dashboard](https://dashboard.stripe.com/) and create an account.
- Enable **Test Mode** on the top right corner.
- Navigate to **Developers > API Keys**.
- Copy your **Publishable key** (`pk_test_...`) and your **Secret key** (`sk_test_...`).

## 2. Environment Variables

Store your Stripe API keys securely in the `.env.local` file at the root of the project. This file is ignored by Git, ensuring keys are never leaked to the repository.

```env
# .env.local

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

_Important:_ After adding these variables, you **must reboot the Next.js development server** (`npm run dev`) for them to be loaded into the Node environment.

## 3. Libraries Used

The following Stripe SDK packages were installed during integration:

- `stripe` (Server-side Node.js Library)
- `@stripe/stripe-js` (Client-side Library for future extensibility)
- `@stripe/react-stripe-js` (React wrapper for future Stripe Elements support)

## 4. Architecture

The payment flow consists of a split Frontend/Backend architecture to ensure the Secret key is never exposed to the client browser.

### Step 1: Frontend Checkout Execution (`app/checkout/page.tsx`)

When the cashier selects **"Credit/Debit Card"** and clicks "Complete Payment", the frontend executes the following logic:

1. Calculates the `grandTotal`, `tax`, and handles line items mapping.
2. Sends the cart details via a `POST` request to our Next.js API Route.
3. Automatically saves the pending transaction record to MongoDB before redirecting, storing a fallback snapshot.

### Step 2: Backend Checkout Session Creation (`app/api/create-checkout-session/route.ts`)

The server receives the cart contents and securely interfaces with Stripe to generate a Checkout session:

1. Validates the `STRIPE_SECRET_KEY`.
2. Loops through the cart items and converts the product data into Stripe `price_data` blocks (prices are multiplied by 100 since Stripe utilizes zero-decimal currencies like cents or paise).
3. Optionally embeds the applicable tax and attaches the customer email.
4. Generates a one-time Stripe Session URL pointing to `session.success_url` and `session.cancel_url`.
5. Returns the generated URL to the frontend.

### Step 3: Hosted Stripe Portal

The cashier is automatically redirected (via `window.location.href`) to Stripe's secure hosted domain. Stripe securely collects the card number, CVV, and zip code. OrderXpress is completely removed from the burden of PCI-compliance.

### Step 4: Redirection & Success (`app/success/page.tsx`)

Upon successful completion, Stripe redirects the cashier back to `http://localhost:3000/success`.

1. The frontend recognizes the completed order.
2. Prints a valid POS receipt containing the exact items, tax, subtotal, and total.
3. Disables the active checkout session and clears the cart.

## 5. Extensibility (Future Integrations)

Currently, the POS uses **Stripe Checkout (Hosted)**.
If requirements change and payments must be collected _inline_ within the POS itself (without redirecting external tabs), the system can be upgraded to **Stripe Elements** using the `@stripe/react-stripe-js` library already installed in the package.json.

Additionally, to verify successful transactions server-side, a **Stripe Webhook** can be implemented into a new Next.js route (e.g. `app/api/webhooks/route.ts`) to listen for `checkout.session.completed` events and securely finalize the order directly into MongoDB.
