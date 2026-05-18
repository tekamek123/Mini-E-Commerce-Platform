# Mini E-Commerce Platform

A production-oriented mini e-commerce platform built as part of a frontend engineering technical challenge. Users can browse products, view product details, manage a shopping cart, and complete purchases via StarPay.

---

## Tech Stack

| Purpose | Technology |
|---|---|
| Frontend Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Server State & Caching | TanStack Query |
| HTTP Requests | Axios |
| Form Handling | Formik |
| Validation | Yup |
| Backend & Database | Supabase |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project
- A StarPay merchant account (test credentials)

### Installation

```bash
git clone https://github.com/your-username/mini-ecommerce-platform.git
cd mini-ecommerce-platform
npm install
```

### Environment Configuration

Create a `.env.local` file in the root of the project and populate it with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# StarPay (server-side only — never expose on the client)
STARPAY_API_KEY=your_starpay_api_key
STARPAY_BASE_URL=https://developer.starpayethiopia.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Important:** `STARPAY_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-side secrets and must never be prefixed with `NEXT_PUBLIC_`. They are only accessed inside Next.js API routes.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## Database Schema

The following tables are defined in Supabase:

**`profiles`** — Extended user data linked to Supabase Auth users (id, full_name, phone, address, created_at)

**`products`** — Product catalog (id, name, description, price, stock_quantity, image_url, category, created_at)

**`orders`** — Customer orders (id, user_id, total_amount, status, delivery_address, created_at)

**`order_items`** — Line items per order (id, order_id, product_id, quantity, unit_price)

Row Level Security (RLS) is enabled on all tables. Users can only read and write their own data. Products are publicly readable.

---

## Architecture Decisions

### Folder Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Server-side API routes (StarPay, etc.)
│   ├── (auth)/           # Auth pages (login, register)
│   ├── products/         # Product listing and detail pages
│   ├── cart/             # Cart page
│   └── checkout/         # Checkout and payment flow
├── components/           # Reusable UI components
│   ├── ui/               # Primitives (Button, Input, Card, etc.)
│   ├── product/          # Product-specific components
│   ├── cart/             # Cart-specific components
│   └── layout/           # Header, Footer, Layout wrappers
├── lib/                  # Utility functions and third-party config
│   ├── supabase/         # Supabase client (browser + server)
│   ├── axios/            # Axios instance and interceptors
│   └── utils/            # Shared helpers
├── hooks/                # Custom React hooks (TanStack Query wrappers)
├── stores/               # Zustand stores (auth, cart)
├── types/                # Shared TypeScript types and interfaces
└── validations/          # Yup schemas
```

### State Management Strategy

**Zustand** is used for client-side global state that needs to persist across navigations:

- `useAuthStore` — tracks the authenticated user session and profile.
- `useCartStore` — manages cart items (add, remove, update quantity) with localStorage persistence via Zustand's `persist` middleware.

**TanStack Query** handles all server state — product listings, product details, and order history. It provides caching, background refetching, and loading/error state management out of the box, keeping components clean.

### API Abstraction

All HTTP communication goes through a centralized Axios instance (`lib/axios/client.ts`) with:

- Base URL configuration from environment variables.
- Request interceptors that attach the Supabase auth token automatically.
- Response interceptors for consistent error normalization.

Domain-specific API functions (e.g., `fetchProducts`, `fetchProductById`) are co-located in `hooks/` as TanStack Query wrappers, keeping data-fetching logic separated from UI components.

### Authentication Flow

Supabase Auth handles authentication. On sign-in, the session is stored in a Supabase cookie and made available server-side via the Supabase SSR client. Route protection is implemented via Next.js Middleware, which checks for a valid session and redirects unauthenticated users away from protected pages (cart, checkout, orders).

### StarPay Integration (Server-Side)

StarPay payment initialization is handled exclusively in a Next.js API route (`/api/payment/initialize`). This ensures:

- The StarPay API key is never exposed to the client.
- The request originates from the server (required since localhost is not directly whitelisted by StarPay).

The client sends order details to `/api/payment/initialize`, which calls StarPay and returns a checkout URL or token. The client then redirects the user to complete payment. Callbacks and payment status verification are also handled server-side.

> **Test number:** Use `0900000000` for StarPay test transactions. Do not use real phone numbers during testing.

### Form Architecture

All forms use **Formik** for state management and **Yup** for schema validation. Yup schemas are co-located in `src/validations/` and imported into their respective form components. This keeps validation rules reusable and decoupled from the UI.

---

## Assumptions Made

- Users must be authenticated to add items to the cart and proceed to checkout. Guest checkout is out of scope.
- Product images are stored as URLs (hosted externally or in Supabase Storage).
- Only one shipping address per order is supported (entered at checkout).
- Cart persistence uses `localStorage` via Zustand's persist middleware. If a user logs in on another device, the cart does not sync — this is a known tradeoff of client-side persistence.
- StarPay webhook verification is handled by checking the transaction status via a server-side API call rather than relying solely on redirect parameters.

---

## Tradeoffs Considered

| Decision | Tradeoff |
|---|---|
| App Router over Pages Router | Better layout nesting and server components, but a steeper learning curve for some patterns |
| Zustand for cart (not Supabase) | Simpler and faster UX, but cart doesn't sync across devices |
| Axios over native fetch | Consistent interceptor support and easier error handling, at the cost of a small bundle addition |
| TanStack Query for server state | Excellent caching and DX, but adds abstraction that requires understanding of query keys |
| Formik over React Hook Form | Familiarity with the required stack; React Hook Form would offer better performance at scale |

---

## Deployment

The application is deployed on **Vercel**.

Live URL: [https://your-project.vercel.app](https://your-project.vercel.app)

All environment variables listed in the [Environment Configuration](#environment-configuration) section above must be added to the Vercel project settings under **Settings → Environment Variables** before deploying.

---

## Security Notes

- Private keys (`STARPAY_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are server-side only and never exposed to the browser.
- Supabase Row Level Security (RLS) is enforced on all tables.
- Authentication state is managed via secure HTTP-only cookies (Supabase SSR).
- All payment operations run through server-side Next.js API routes.
- Environment variables are validated at startup and the app will throw if required server-side vars are missing.