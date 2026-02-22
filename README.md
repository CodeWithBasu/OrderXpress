# 🍔 OrderXpress POS

**OrderXpress** is a modern, high-performance Point of Sale (POS) and inventory management system built specifically for fast-paced restaurants, cafes, and retail stores. It features a beautiful, dynamic user interface with lightning-fast checkout flows.

![OrderXpress POS Preview](public/preview.png) _(Preview placeholder)_

## ✨ Key Features

- **⚡ Lightning Fast POS Interface:** Optimized Next.js 15 routing for instant category switching and cart management.
- **💳 Multi-Gateway Payment Support:** Fully integrated with Stripe Checkout for secure credit/debit card processing, alongside native wallet tracking (Google Pay, PhonePe, Paytm) and Cash.
- **📦 Real-Time Inventory & DB:** Powered by MongoDB Atlas. Products and transaction histories are instantly synced to the cloud.
- **🎨 Stunning UI/UX:** Built with Tailwind CSS v4 and Framer Motion for smooth, dynamic animations, hover effects, and a premium "glassmorphism" aesthetic.
- **📊 Admin Dashboard:** Comprehensive backend management portal to track recent orders, manage customer profiles, and update product inventory on the fly.
- **🌙 Dark Mode Support:** Seamless toggling between light and dark themes using `next-themes` and Shadcn UI components.
- **🧾 Automated Digital Receipts:** Auto-generates printable order receipts upon successful payment routing.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Radix UI, Shadcn UI, Framer Motion
- **Backend:** Next.js Serverless API Routes
- **Database:** MongoDB & Mongoose
- **Payments:** Stripe API (`stripe-node`)
- **Icons:** Lucide React

### 📦 Dependency Graph

Here is a visual breakdown of the `package.json` structure, illustrating our scripts, runtime dependencies, and devDependencies:

![Package.json Dependency Tree](public/OrderXpress.json.png)

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+) and npm installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/CodeWithBasu/OrderXpress.git
cd OrderXpress
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add your database and payment API keys.

```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/OrderXpressDB

# Stripe Payment Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

_(Note: To test card payments, ensure your Stripe keys are set to "Test Mode". To accept real money, swap them for "Live Mode" keys)._

### 4. Seed the Database

If you are starting fresh, you can optionally populate your database with our beautiful artisanal starter menu (Burgers, Pizzas, Desserts, Mocktails, etc.):

```bash
node seed.js
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the POS terminal. Access the management dashboard at `http://localhost:3000/admin`.

## 🔒 Security Note

This application connects to an external MongoDB Atlas cluster. If you encounter a `500 Internal Server Error` when loading products, ensure that your current IP address is whitelisted in your MongoDB Atlas **Network Access** settings.

---

Built with ❤️ by [CodeWithBasu](https://github.com/CodeWithBasu).
