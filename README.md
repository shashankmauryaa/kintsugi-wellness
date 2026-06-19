# Kintsugi Wellness

A premium, trauma-informed online counselling platform built for Khushi Mundra, Counselling Psychologist. The platform provides a warm, reflective digital space for clients to explore therapy, book sessions, manage their profiles, and securely handle onboarding documentation.

## 🌟 Key Features

### 1. Client Portal (`/portal`)
- **Dynamic Dashboard:** A beautifully designed interface where clients can view their upcoming and past sessions. Sessions automatically migrate from "Upcoming" to "Past" the moment their end time passes.
- **My Info (`/portal/my-info`):** A dedicated, nested layout where clients can view and edit their personal information, emergency contacts, and review the exact terms they agreed to during onboarding.
- **Session Notes:** Interactive modals allow clients to view details for upcoming sessions and safely add reflective notes to past sessions.

### 2. Seamless Onboarding & Booking
- **Consent Forms (`/consent-form`):** A comprehensive, multi-step onboarding flow collecting essential information and formal acknowledgements of practice policies (Confidentiality, Fees, Emergency Support).
- **Session Booking (`/book`):** A streamlined booking interface integrated directly with the practice's calendar.

### 3. Integrated Systems
- **Authentication:** Secure client login utilizing Firebase Auth.
- **Database:** Real-time data management powered by Google Firestore (tracking `clientProfiles`, `consentForms`, and `bookings`).
- **Payments:** Native Razorpay integration for seamless session payments.
- **Calendar:** Automated scheduling via Calendar API integrations.

## 🎨 Design System

The platform's aesthetic is heavily inspired by the Japanese art of **Kintsugi**—the philosophy of embracing flaws and imperfections. 
- **Palette:** Warm, comforting tones featuring deep bronzes, elegant golds (`var(--color-gold-600)`), soft surfaces, and rich espresso accents.
- **Typography:** A combination of modern, readable sans-serif fonts (Inter & Outfit) for an approachable yet highly professional feel.
- **Micro-interactions:** Smooth hover effects, subtle drop shadows, and scale animations that create a tactile, "app-like" experience.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Firebase Admin SDK](https://firebase.google.com/) (Firestore)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Payments:** Razorpay
- **Language:** TypeScript

## ⚙️ Getting Started

First, ensure your environment variables are correctly set up (Firebase Admin credentials, Razorpay keys, etc.).

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Ensure all required Environment Variables (especially the Firebase Private Key) are properly configured in your Vercel project settings.
