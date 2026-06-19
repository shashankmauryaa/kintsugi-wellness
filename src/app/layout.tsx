import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Mail, Phone, MessageSquare, ArrowUp } from "lucide-react";
import LegalModals from "@/components/LegalModals";
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
    <html lang="en" className="scroll-smooth">
      <body
        id="top"
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
            <a href="/what-to-expect" className="hover:text-[var(--color-gold-600)] transition-colors">What to Expect</a>
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

        <footer className="w-full bg-[#2d2015] text-[var(--color-gold-50)] mt-auto pt-20 pb-8 px-8 border-t border-[#4a3622]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 justify-between mb-16">
            
            {/* Column 1: Brand */}
            <div className="md:w-1/3">
              <h2 className="text-3xl font-heading text-[var(--color-gold-100)] mb-2">Kintsugi Wellness</h2>
              <p className="text-sm italic text-[#bca289] mb-6">therapy at your own pace</p>
              <p className="text-sm text-[#bca289] mb-8 leading-relaxed max-w-xs">
                A warm, reflective, and trauma-informed counselling practice in Bangalore. Online therapy & counselling for adolescents, college students, and adults.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/_khushiimundra__/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg> Instagram
                </a>
                <a href="https://www.linkedin.com/in/khushi-mundra-3108bb1bb/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg> LinkedIn
                </a>
              </div>
            </div>

            {/* Column 2: Pages */}
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#8a7258] uppercase mb-6">Pages</h3>
              <nav className="flex flex-col gap-4">
                <a href="/" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">Home</a>
                <a href="/about" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">About Counsellor</a>
                <a href="/services" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">Services</a>
                <a href="/what-to-expect" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">What to Expect</a>
                <a href="/faq" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">FAQs</a>
              </nav>
            </div>

            {/* Column 3: Get Started */}
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#8a7258] uppercase mb-6">Get Started</h3>
              <nav className="flex flex-col gap-4">
                <a href="/book" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">Book a Session</a>
                <a href="/portal" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">Client Portal</a>
                <a href="/consent-form" className="text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">Consent Forms</a>
              </nav>
            </div>

            {/* Column 4: Reach Us */}
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#8a7258] uppercase mb-6">Reach Us</h3>
              <div className="flex flex-col gap-4">
                <a href="mailto:mundrakhushi18@gmail.com" className="flex items-center gap-3 text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">
                  <Mail size={16} /> mundrakhushi18@gmail.com
                </a>
                <a href="tel:+917557040195" className="flex items-center gap-3 text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">
                  <Phone size={16} /> +91 7557040195
                </a>
                <a href="/contact" className="flex items-center gap-3 text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors">
                  <MessageSquare size={16} /> Drop a message
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#4a3622] relative">
            <LegalModals />
            
            {/* Scroll to Top */}
            <a href="#top" className="w-12 h-12 bg-[#b6826e] hover:bg-[#c99580] text-white rounded-full flex items-center justify-center transition-all shadow-lg mx-auto md:mx-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
              <ArrowUp size={20} />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
