"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, User, GraduationCap, MessagesSquare, Users } from "lucide-react";
import FaqLink from "@/components/FaqLink";

export default function Services() {
  const services = [
    {
      title: "Individual Counselling",
      description: "One-on-one sessions tailored to your unique needs, providing a safe space to explore anxiety, stress, relationships, life transitions, and emotional wellbeing.",
      duration: "50 Minutes",
      icon: User,
      tags: ["Anxiety", "Stress", "Relationships", "Life transitions"],
      href: "/book?service=individual",
    },
    {
      title: "Student Counselling",
      description: "Specialized support for students navigating academic pressure, identity exploration, career uncertainty, and peer relationships.",
      duration: "50 Minutes",
      icon: GraduationCap,
      tags: ["Academic stress", "Identity", "Career uncertainty"],
      href: "/book?service=student",
    },
    {
      title: "Listening Space Sessions",
      description: "Shorter, focused sessions meant for times when you just need to feel heard, process a specific experience, and receive emotional support.",
      duration: "30 Minutes",
      icon: MessagesSquare,
      tags: ["Feeling heard", "Processing", "Reflection"],
      href: "/book?service=listening",
    },
    {
      title: "Workshops & Psychoeducation",
      description: "Group awareness sessions and psychoeducation programs focused on mental health advocacy and collective healing.",
      duration: "Variable",
      icon: Users,
      tags: ["Group workshops", "Awareness", "Psychoeducation"],
      href: "/contact",
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center w-full pb-24">
      {/* Header */}
      <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center text-center px-8 max-w-4xl mx-auto py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--color-gold-900)] mb-12"
        >
          Our Services
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-6 text-lg md:text-xl text-[var(--color-gold-800)]"
        >
          <p>Counselling adapted to your pace and lived experiences. Choose the support that feels right for you.</p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="w-full max-w-6xl px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-[var(--color-gold-200)] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-14 h-14 bg-[var(--color-gold-100)] text-[var(--color-gold-800)] rounded-2xl flex items-center justify-center mb-6">
                <service.icon size={28} />
              </div>
              <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-3">{service.title}</h2>
              <p className="text-[var(--color-gold-700)] mb-6 flex-1">
                {service.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[var(--color-gold-50)] text-[var(--color-gold-800)] text-xs rounded-md border border-[var(--color-gold-200)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[var(--color-gold-100)]">
                <span className="text-sm font-medium text-[var(--color-gold-800)] bg-[var(--color-gold-100)] px-3 py-1 rounded-full">
                  {service.duration}
                </span>
                <Link 
                  href={service.href}
                  className="flex items-center gap-2 text-[var(--color-gold-700)] font-medium hover:text-[var(--color-gold-900)] transition-colors"
                >
                  {service.title.includes("Workshops") ? "Inquire Now" : "Book Session"} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Note Section */}
      <section className="w-full max-w-4xl px-8 pt-24 text-center">
        <div className="bg-[var(--color-gold-50)] rounded-[2.5rem] p-10 md:p-14 border border-[var(--color-gold-200)] relative overflow-hidden shadow-sm">
          {/* Decorative subtle element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold-100)] rounded-full blur-3xl opacity-60 translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-gold-100)] rounded-full blur-3xl opacity-60 -translate-x-10 translate-y-10"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4">Still have questions?</h3>
            <p className="text-lg text-[var(--color-gold-800)] mb-8 max-w-2xl mx-auto">
              If you're unsure about the process, what to expect, or which service feels right for you, we have answers.
            </p>
            <FaqLink className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-white/80 border border-[var(--color-gold-200)] text-[var(--color-gold-900)] rounded-full font-medium transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5">
              View FAQs
            </FaqLink>
          </div>
        </div>
      </section>
    </div>
  );
}
