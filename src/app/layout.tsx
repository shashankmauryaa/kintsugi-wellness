import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kintsugi Wellness | Khushi Mundra, Counselling Psychologist",
  description: "A warm, reflective, and trauma-informed counselling practice in Bangalore. Therapy at your pace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[var(--color-gold-50)] min-h-screen flex flex-col`}
      >
        <header className="fixed top-0 left-0 right-0 z-50 w-full py-6 px-8 flex items-center justify-between bg-[var(--color-gold-50)]/30 backdrop-blur-md border-b border-[var(--color-gold-200)]/30 transition-all">
          <div className="text-2xl font-heading font-medium text-[var(--color-gold-900)]">
            Kintsugi Wellness
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[var(--color-gold-800)]">
            <a href="/" className="hover:text-[var(--color-gold-600)] transition-colors">Home</a>
            <a href="/about" className="hover:text-[var(--color-gold-600)] transition-colors">About</a>
            <a href="/services" className="hover:text-[var(--color-gold-600)] transition-colors">Services</a>
            <a href="/faq" className="hover:text-[var(--color-gold-600)] transition-colors">FAQ</a>
            <a href="/contact" className="hover:text-[var(--color-gold-600)] transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/portal" className="bg-[var(--color-gold-600)] hover:bg-[var(--color-gold-700)] text-white px-6 py-2.5 rounded-full transition-all shadow-sm">
              Client Portal
            </a>
          </div>
        </header>

        <main className="flex-1 flex flex-col pt-[88px]">
          {children}
        </main>

        <footer className="w-full py-12 px-8 bg-[var(--color-gold-100)] mt-auto border-t border-[var(--color-gold-200)] text-center">
          <p className="text-[var(--color-gold-800)]">© {new Date().getFullYear()} Kintsugi Wellness. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
