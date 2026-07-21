/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "Counselling Basics",
    questions: [
      { q: "What is counselling?", a: "Counselling is a collaborative process where we explore your thoughts, feelings, and experiences in a safe, non-judgmental environment." },
      { q: "How do I know if I need therapy?", a: "If you're feeling overwhelmed, stuck, or just want to understand yourself better, therapy can be a helpful space. You don't need a diagnosis to seek support." }
    ]
  },
  {
    category: "Confidentiality",
    questions: [
      { q: "Is what I share confidential?", a: "Yes. Everything discussed is strictly confidential, with a few legal exceptions such as immediate risk of harm to yourself or others." }
    ]
  },
  {
    category: "Sessions & Booking",
    questions: [
      { q: "How long is a session?", a: "Each individual session lasts for 50 minutes." },
      { q: "Do you offer online counselling?", a: "Yes, we offer secure video sessions for clients who prefer the comfort and convenience of their own space." },
      { q: "What is your cancellation policy?", a: "We require a minimum 24-hour notice for cancellations. Late cancellations or no-shows may be subject to the full session fee." }
    ]
  }
];

export default function FaqLink({ 
  className = "text-left text-sm text-[#bca289] hover:text-[var(--color-gold-100)] transition-colors",
  children = "FAQs"
}: { 
  className?: string;
  children?: React.ReactNode;
}) {
  const [showFaq, setShowFaq] = useState(false);
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <>
      <button 
        onClick={() => setShowFaq(true)} 
        className={className}
      >
        {children}
      </button>

      {showFaq && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-left">
          <div className="bg-[var(--color-gold-50)] rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setShowFaq(false)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8 shrink-0 pr-8">
              <h2 className="text-3xl font-heading text-[var(--color-gold-900)] mb-2">Frequently Asked Questions</h2>
              <p className="text-sm text-[var(--color-gold-700)]">Answers to common questions about starting therapy.</p>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 space-y-8 flex-1">
              {faqs.map((group, groupIdx) => (
                <div key={groupIdx}>
                  <h3 className="text-xl font-heading text-[var(--color-gold-800)] mb-4">{group.category}</h3>
                  <div className="space-y-3">
                    {group.questions.map((faq, qIdx) => {
                      const id = `${groupIdx}-${qIdx}`;
                      const isOpen = openIndex === id;
                      return (
                        <div key={id} className="border border-[var(--color-gold-200)] rounded-2xl bg-white overflow-hidden shadow-sm">
                          <button 
                            onClick={() => toggle(id)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                          >
                            <span className="font-medium text-[var(--color-gold-900)]">{faq.q}</span>
                            <ChevronDown 
                              className={`text-[var(--color-gold-500)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="px-5 pb-4 text-sm text-[var(--color-gold-800)] leading-relaxed">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
