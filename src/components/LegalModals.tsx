"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function LegalModals() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <div className="text-xs text-[#8a7258] flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left mb-6 md:mb-0">
        <span>© {new Date().getFullYear()} Kintsugi Wellness.</span>
        <span className="hidden md:inline">•</span>
        <button onClick={() => setShowTerms(true)} className="hover:text-[#bca289] transition-colors">Terms & Conditions</button>
        <span className="hidden md:inline">•</span>
        <button onClick={() => setShowPrivacy(true)} className="hover:text-[#bca289] transition-colors">Privacy Policy</button>
      </div>

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 shrink-0">Terms & Conditions</h2>
            <div className="overflow-y-auto custom-scrollbar pr-4 text-sm text-[var(--color-gold-800)] space-y-4">
              <p>Welcome to Kintsugi Wellness. By accessing our website and using our services, you agree to these Terms & Conditions.</p>
              
              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">1. Services Provided</h3>
              <p>Kintsugi Wellness provides online counselling and therapeutic services. These services are not a substitute for medical diagnosis, treatment, or crisis intervention. If you are experiencing a medical or psychological emergency, please contact local emergency services immediately.</p>
              
              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">2. Session Policies</h3>
              <p>All sessions are scheduled in advance and conducted online. Payment for sessions must be made as agreed upon prior to the session.</p>
              
              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">3. Cancellations & Rescheduling</h3>
              <p>We request at least 24 hours notice for any cancellations or rescheduling. Cancellations made with less than 24 hours notice may be subject to the full session fee.</p>

              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">4. Intellectual Property</h3>
              <p>All content on this website, including text, graphics, logos, and images, is the property of Kintsugi Wellness and is protected by intellectual property laws.</p>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 shrink-0">Privacy Policy</h2>
            <div className="overflow-y-auto custom-scrollbar pr-4 text-sm text-[var(--color-gold-800)] space-y-4">
              <p>Your privacy and confidentiality are of the utmost importance to us at Kintsugi Wellness.</p>

              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">1. Information Collection</h3>
              <p>We collect personal information that you voluntarily provide to us, including your name, contact information, and any details shared through our consent and intake forms.</p>

              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">2. Use of Information</h3>
              <p>Your information is used solely for the purpose of providing counselling services, scheduling, and communicating with you regarding your care.</p>

              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">3. Confidentiality</h3>
              <p>All interactions and records are kept strictly confidential. Information will only be disclosed without your consent if required by law, or if there is an imminent risk of harm to yourself or others, in accordance with standard ethical guidelines for mental health professionals.</p>

              <h3 className="font-bold text-[var(--color-gold-900)] mt-6">4. Data Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or disclosure.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
