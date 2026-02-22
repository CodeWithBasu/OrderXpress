# OrderXpress Database Integration Guide

## Overview

OrderXpress has transitioned from client-side `localStorage` to a fully robust backend using **MongoDB Atlas**. This change enables cross-device data synchronization, infinite storage scaling, and improved application security.

Currently, the **Inventory/Products** module has been successfully migrated to MongoDB.

---

## 🚀 Setup Instructions

Since the backend services are already configured and the drivers installed, you just need to connect the application to your MongoDB instance.

### 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up (or log in).
2. Create a new **Free Tier Cluster**.
3. Under **Database Access**, create a new database user (keep track of the username and password).
4. Under **Network Access**, click `Add IP Address` and select `Allow Access from Anywhere` (0.0.0.0/0).

### 2. Get Your Connection String

1. Go back to your Cluster overview and click **Connect**.
2. Select **Connect your application**.
3. Copy the standard connection string provided. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
4. Make sure to replace `<username>` and `<password>` with the database user details you created.

### 3. Add Connection String to Environment Variables

1. At the root of your `OrderXpress` project directory, create a new file named `.env.local`
2. Add the following line to the file, pasting your actual connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/OrderXpressDB?retryWrites=true&w=majority
   ```
   _(Note: You can add `OrderXpressDB` before the `?` to explicitly name your database)._

### 4. Restart Your App

Stop your current development server and restart it:

```bash
npm run dev
```

---

## 🔧 Architecture & Migration Details

### The Setup

- **Mongoose**: We use Mongoose as our ODM (Object Data Modeling) library to define strict schemas.
- **Connection pooling**: Engineered inside `lib/mongodb.ts`, we cache the MongoDB connection across hot reloads to prevent exhausting connection limits during development.

### What Has Changed?

1. **Schemas (`models/Product.ts`)**
   We have strictly typed the `Product` models so that your inventory conforms to expectations in the database.

2. **API Routes (`app/api/products`)**
   - **`GET /api/products`** - Fetches all products. If the database is completely empty (like on a fresh start), this endpoint will **automatically seed** the database with your default food/drink products to get you started!
   - **`POST /api/products`** - Adds a new product to MongoDB.
   - **`PUT /api/products/[id]`** - Updates an existing product using its numeric `id`.
   - **`DELETE /api/products/[id]`** - Permanently deletes a product.

3. **Frontend Integration (`app/services/database.ts`)**
   `getInventory()`, `saveProduct()`, `updateStock()`, and `deleteProduct()` no longer point to `localStorage`. Instead, they make live asynchronous `fetch()` requests to your API backend!

---

## 🔮 Future Database Migrations

Currently, the `Products` are fully handled by MongoDB. The following systems are still operating inside `localStorage` and act as great candidates for migration:

1. **Transactions & Order History**
2. **Customer Profiles & Loyalty Points**
3. **Analytics Tracking**

To migrate these, you simply need to repeat the same pattern used for Products (Create a Schema -> Add an API Endpoint -> Update `database.ts` to call the endpoint).
