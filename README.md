# 🌿 NaturaVerse — Enterprise-Grade Admin & Client Portal (Next.js 15+)

NaturaVerse is a modern, high-performance web application designed to explore and manage hidden natural wonders. This repository showcases a production-ready, full-stack architecture built with **Next.js 15 (App Router)**, **Redux Toolkit Query (RTK Query)**, **Supabase (PostgreSQL Cloud)**, and **Cloudinary Media API**. It prioritizes military-grade security layers, real-time backend automation, advanced caching strategies, and a premium user experience (UX/UI).

🌐 **Live Demo:** [https://naturaverse.vercel.app](https://naturaverse.vercel.app)

---

## 🛠️ Technology Stack & Engineering Tools

* **Core Framework:** Next.js 15+ (App Router Architecture)
* **Language:** TypeScript (Strict Compilation Mode & Full Type Safety)
* **State Management & Data Fetching:** Redux Toolkit & RTK Query
* **Database & Persistence Layer:** Supabase Cloud (PostgreSQL)
* **Media Cloud Provider:** Cloudinary Node Cloud API
* **Form Handling & Validation:** React Hook Form + Zod Schema Validation
* **UI Library & Styling:** Material UI (MUI v6) & Emotion
* **Session Cryptography:** Bcryptjs & JsonWebToken (JWT)

---

## 📸 Application Previews (Screenshots)

### 🌿 Client & Explore Portal
<p align="center">
  <img src="https://github.com/user-attachments/assets/a9f89e21-415c-4ea7-ab01-28db72e5038b" width="48%" alt="Explore Page Screen 1" />
  <img src="https://github.com/user-attachments/assets/09c10352-b676-4962-833b-18adeff7ac84" width="48%" alt="Explore Page Screen 2" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ea61c37f-e001-4614-a81e-c23852dc5236" width="48%" alt="Explore Page Screen 3" />
  <img src="https://github.com/user-attachments/assets/cb0c3081-0b3f-4310-9e18-7fb552b7d564" width="48%" alt="Explore Page Screen 4" />
</p>

### 🔒 Authentication & Dashboard Management
<p align="center">
  <img src="https://github.com/user-attachments/assets/7322dc53-5800-46c3-b33f-e07c679c9a7a" width="31%" alt="Login Screen" />
  <img src="https://github.com/user-attachments/assets/f5aaf0b8-82f0-485e-ad25-d8dfa5d36afc" width="31%" alt="Dashboard Overview" />
  <img src="https://github.com/user-attachments/assets/15110f05-7c7f-48f0-b103-c3cd8e4951bf" width="31%" alt="Admin Control Panel" />
</p>

---

## 🚀 Key Architectural & Performance Highlights

### 1. Robust Authentication & Security Layer (Stealth Protection) 🛡️
* **Information Disclosure Prevention:** If an unauthenticated guest tries to brute-force or manually guess admin routes (e.g., `/dashboard` or `/images`), the app does **not** redirect them to a standard login page. Instead, it internally triggers a Next.js `NextResponse.rewrite` to display the built-in **404 Not Found** screen. This completely hides the existence of the admin panel from potential attackers.
* **Role-Based Access Control (RBAC):** Authenticated users with a standard `USER` role are intercepted at the layout level via strict `notFound()` triggers to prevent unauthorized dashboard execution.
* **Production Session Management:** Leverages JWT signed with secure algorithms, stored safely via `httpOnly`, `secure`, and `sameSite: strict` cookies, making the authentication tokens entirely immune to XSS and CSRF attacks.

### 2. Full CRUD Engine with Automated Media Eraser 🗑️
* **Next.js Serverless Endpoints:** Powered by dynamic routes (`src/app/api/slider/[id]/route.ts`) supporting fully type-safe, synchronous `DELETE` and `PUT` actions.
* **Orphaned Media Cleanup:** When an admin deletes a slider banner, the API securely generates a **Cloudinary Cryptographic SHA-1 Signature** to destroy the corresponding image asset from Cloudinary cloud storage simultaneously with the database row deletion. This prevents data inconsistency and optimizes serverless storage capacity.

### 3. Advanced Cache Tuning & Optimized Pagination 🔄
* **Single-Request Smart Caching:** The client-side hero banner carousel fetches data exactly once through RTK Query and caches it in memory, minimizing server hits and saving data bandwidth.
* **Memory Leak Prevention:** Uses React `useEffect` hooks to run the 5-second auto-play transition and accurately releases resources via `clearInterval` on unmount.
* **Infinite Scroll Optimization:** Implements dynamic data pagination using `react-infinite-scroll-component` combined with an automatic deduplication global cache `merge` mechanism.
* **Duplicate Request Blocker:** Overrides default RTK Query behavior by bypassing `forceRefetch` and utilizing conditional query flags (`isFetching`). This strictly eliminates duplicate background API polling when switching between layout states, yielding a stutter-free client interaction.

### 4. Real-time Interactions & High-Fidelity UX 💖
* **High-Fidelity Optimistic Updates:** Integrated RTK Query `onQueryStarted` to instantly mutate client-side cache states when toggling Likes. This achieves a **0ms perceived latency** for the user, while automatically rolling back state mutations if the underlying Supabase transactions fail.
* **Interactive Guest Conversion Flow:** Unlike restrictive platforms, the **Like** and **Comment** triggers are not disabled (`disabled`) for guest users. They are fully visible to encourage app engagement. If a guest interacts with them, the system displays an elegant warning alert and **intuitively redirects them to the Login page (`/auth/login`)**.
* **Isolated Thread Lifecycle Management:** Utilizes relational Cache Invalidation Tags (`providesTags` / `invalidatesTags`) mapped specifically to unique Image IDs. When a new comment is posted, it strictly re-fetches the isolated thread for that exact image rather than triggering global app-wide layout re-renders.
* **Optimized Backend Counts:** Aggregates live Like and Comment counters using exact entity heads (`count: "exact", head: true`) on the Supabase persistence layer. This delivers live metric calculations without fetching heavy database payload blocks.

### 5. Premium UI Refinement & Zero Hydration Mismatches ✨
* Built with **Material UI (MUI v6)** implementing glassmorphism card layouts, smooth micro-interactions, responsive grids, and customized brand gradients.
* Integrated Next.js lazy-loading (`next/dynamic` with `ssr: false`) for client-heavy features (Carousel, Infinite Scroll), eliminating server-client mismatch errors entirely.

---

## 📁 Core Directory Architecture

```text
src/
 ├── app/
 │    ├── (client)/
 │    │    ├── component/
 │    │    │    └── HeroSlider.tsx       # 🛝 High-performance Cached Client Carousel
 │    │    └── page.tsx                  # 🌿 Client Home Page (Dynamic Import Wrapper)
 │    │
 │    ├── (dashboard)/
 │    │    ├── images/
 │    │    │    └── components/
 │    │    │         └── ImgCardUI.tsx   # 💖 Interactive Social Card (Optimistic Updates)
 │    │    └── layout.tsx                # 🛡️ Component-Level RBAC Guard (Admin Only)
 │    │
 │    ├── api/
 │    │    └── slider/
 │    │         └── [id]/
 │    │              └── route.ts        # 🚀 Cloudinary + Supabase Double-Delete API
 │    │
 │    └── auth/
 │         ├── login/page.tsx            # 🔒 Glassmorphic Auth Form & Smart Router
 │         └── register/page.tsx         # 📝 Schema-validated Registration
 │
 ├── components/                         # Reusable Presentation Components (NavBar, SideBar)
 ├── context/                            # Client UI Contexts (SideBar Drawer states)
 ├── lib/
 │    ├── api/                           # Split-slice RTK Query Configuration & Tags
 │    └── supabase/                      # Back-end persistence layer instantiation
 └── proxy.ts                            # 👑 Advanced Stealth Security Middleware

1. Clone the repo & Install Dependencies
Bash
git clone [https://github.com/KyawZayYa-c/NaturaVerse.git](https://github.com/KyawZayYa-c/NaturaVerse.git)
cd naturaverse
pnpm install

2. Configure Environment Variables (.env.local)
Create a .env.local file in the root directory and add your credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_signing_secret

3. Run Development Server
Bash
npm run dev

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

Copyright (c) 2026 Kyaw Zay Ya
