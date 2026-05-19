# 🛍️ Medebr Shop

A premium, state-of-the-art mini e-commerce platform built on modern web paradigms. Medebr Shop delivers an immersive, high-performance storefront coupled with secure authentication, dynamic state management, a global notification engine, and a strictly compliant accessibility standard.

🔗 **Live Production URL:** [https://medebr-e-commerce-platform.vercel.app/](https://medebr-e-commerce-platform.vercel.app/)

---

## 🌟 Core Features

- **Split-Screen Authentication Hub**: Seamless login, registration, password recovery, and secure password-reset pages dressed in a premium, full-bleed split grid utilizing high-quality storefront assets.
- **Client-Side State Cart**: An instantaneous shopping cart powered by Zustand, complete with local-storage persistence, item increment/decrement, and live subtotal calculations.
- **StarPay Payment Integration**: Seamlessly initializes checkout and handles sandbox callback redirects, securely registering transaction logs and state responses upon return.
- **Dynamic Catalog Cache**: Storefront data fetching handled via TanStack Query (React Query) utilizing client-side caching and automated error reporting.
- **Burgundy Design System**: Curated color palettes featuring Medebr Burgundy (`#7e0f2b` and `#ea5b82` dark tokens) paired with customized micro-animations and smooth transit filters.
- **Universal Accessibility (a11y)**: Fully compliant WCAG 2.1 interactive links, semantic headings, `aria-live` real-time voice updates, and high-contrast `focus-visible` outline rings for keyboard-only users.
- **Global Error Handling**: Centralized Axios response interceptors and TanStack Query Cache callbacks that pipe API and database anomalies into customized, rich-color Sonner toast alerts.

---

## 🏗️ Architecture & File Structure

This project implements the standard **Next.js App Router** structure, organized into distinct logical modules for maximum scalability:

```text
├── public/                 # Static assets (images, brand logos, etc.)
├── scripts/                # Utility scripts (seed generators)
├── src/
│   ├── app/                # Next.js App Router Page directories
│   │   ├── api/            # API Endpoints (StarPay checkout callbacks)
│   │   ├── auth/           # Secure auth callback routes
│   │   ├── cart/           # Shopping cart route
│   │   ├── checkout/       # Delivery and checkout checkout routes
│   │   ├── forgot-password/# Password recovery request route
│   │   ├── login/          # Store login portal
│   │   ├── products/       # Detailed product catalog route
│   │   ├── register/       # User sign up route
│   │   └── reset-password/ # New password submission page
│   ├── components/         # Modular React Components
│   │   ├── features/       # Feature-specific components (auth, products)
│   │   ├── layout/         # Layout modules (navigation, badges)
│   │   ├── providers/      # Context providers (auth, react-query)
│   │   └── ui/             # Core UI components (button, skeletons, error-states)
│   ├── lib/                # Configured third-party SDK clients (axios, supabase)
│   ├── services/           # Network request abstraction logic (api calls)
│   ├── store/              # Shared Zustand stores (cartStore, authStore)
│   └── types/              # Static TypeScript type mappings
└── tailwind.config.ts.bak  # Legacy Tailwind configuration backups
```

---

## ⚡ Engineering & Architectural Decisions

### 1. TanStack Query for Cache Slices

To ensure lightning-fast performance, we chose TanStack React Query to decouple raw API calls from frontend component lifecycle locks. Fetch responses are cached with a custom `staleTime` to prevent redundant network round-trips when switching views.

### 2. Zustand for Global Client Slices

For local storefront state (like shopping carts), Zustand provides a highly performant, boilerplate-free state store. Using the `persist` middleware, cart items are automatically written to client `localStorage`, preserving shopping states even across browser sessions.

### 3. Supabase + Next.js SSR Auth

Authentication is handled by Supabase Auth using the standard `@supabase/ssr` architecture.

- **The Cookie Mechanism**: User sessions are exchanged on our secure API callback route (`/auth/callback`) and written directly to response headers, which enables cookie authentication.
- **Middleware Guarding**: Outgoing requests are checked inside Next.js `middleware.ts`. Protected folders (like `/cart`, `/checkout`, and `/reset-password`) are strictly guarded against non-session visitors on the server side before they even load.

### 4. Custom StarPay Payment Sandbox

Checkout forms trigger an API call to initialize payment transactions. Upon completion, callback endpoints handle the incoming success/failure states, showing beautiful feedback screens that log order updates inside the database.

---

## 🛠️ Local Setup & Installation

Follow these steps to run Medebr Shop locally in your development environment:

### Prerequisites

Make sure you have Node.js (version 18 or above) installed.

### 1. Clone the repository

```bash
git clone https://github.com/tekamek123/Mini-E-Commerce-Platform.git
cd Mini-E-Commerce-Platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env.local` in the root folder and configure the following keys with your Supabase details:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://fakestoreapi.com
```

### 4. Start Local Server

Run the local next development environment:

```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:3000`** to experience Medebr Shop!

---

## 🧪 Quality and Verification

Keep the workspace pristine using our linting and formatting targets:

- **Run Linter**: Ensure zero syntax violations:
  ```bash
  npm run lint
  ```
- **Code Prettier Formatting**: Keep styling rules perfectly consistent:
  ```bash
  npx prettier --write .
  ```
