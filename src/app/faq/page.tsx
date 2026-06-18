"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full py-20 px-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-4">Frequently Asked Questions</h1>
          <p className="text-[var(--color-gold-700)]">Answers to common questions about starting therapy.</p>
        </div>

        <div className="space-y-12">
          {faqs.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h2 className="text-2xl font-heading text-[var(--color-gold-800)] mb-6">{group.category}</h2>
              <div className="space-y-4">
                {group.questions.map((faq, qIdx) => {
                  const id = `${groupIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className="border border-[var(--color-gold-200)] rounded-2xl bg-white overflow-hidden">
                      <button 
                        onClick={() => toggle(id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
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
                            <div className="px-6 pb-4 text-[var(--color-gold-800)]">
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
    </div>
  );
}
