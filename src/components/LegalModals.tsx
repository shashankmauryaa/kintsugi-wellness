/* eslint-disable react/no-unescaped-entities, react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function LegalModals() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="text-xs text-[#8a7258] flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left mb-6 md:mb-0">
        <span>© {new Date().getFullYear()} Kintsugi Wellness.</span>
        <span className="hidden md:inline">•</span>
        <button onClick={() => setShowTerms(true)} className="hover:text-[#bca289] transition-colors">Terms & Conditions</button>
        <span className="hidden md:inline">•</span>
        <button onClick={() => setShowPrivacy(true)} className="hover:text-[#bca289] transition-colors">Privacy Policy</button>
      </div>

      {showTerms && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6 shrink-0">Terms and Conditions</h2>
            
            <div className="overflow-y-auto custom-scrollbar pr-4 space-y-6 text-sm text-[var(--color-gold-800)] flex-1">
              <section>
                <p>Welcome to Kintsugi Wellness. By accessing our website and using our services, you agree to these Terms & Conditions.</p>
              </section>
              
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">1. Scope of Services</h3>
                <p>The counselling services provided are intended to support mental wellbeing. These services do not substitute for medical treatment or psychiatric care.</p>
              </section>
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">2. Confidentiality</h3>
                <p>All sessions are strictly confidential. Information will not be shared without your explicit written consent, except in situations involving imminent risk of harm to yourself or others, or when required by law.</p>
              </section>
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">3. Appointments and Cancellations</h3>
                <p>Sessions must be booked in advance. Please provide at least 24 hours' notice for cancellations. Late cancellations or no-shows may be subject to the full session fee.</p>
              </section>
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">4. Payment</h3>
                <p>Fees are payable prior to or immediately following each session. We reserve the right to adjust fees with reasonable advance notice.</p>
              </section>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showPrivacy && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6 shrink-0">Privacy Policy</h2>
            
            <div className="overflow-y-auto custom-scrollbar pr-4 space-y-6 text-sm text-[var(--color-gold-800)] flex-1">
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">Information Collection</h3>
                <p>We collect necessary personal and contact information solely for the purpose of providing effective counselling services and maintaining client records.</p>
              </section>
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">Data Security</h3>
                <p>Your records and personal data are stored securely and in compliance with data protection regulations. We implement robust physical and electronic safeguards to protect your privacy.</p>
              </section>
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">Digital Communication</h3>
                <p>While we use secure platforms for telehealth services, standard emails and text messages may not be completely secure. We recommend limiting sensitive information in these channels.</p>
              </section>
              <section>
                <h3 className="font-bold text-[var(--color-gold-900)] mb-2">Access to Records</h3>
                <p>You have the right to request access to your records or ask for corrections if you believe any information is inaccurate. Such requests must be submitted in writing.</p>
              </section>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
