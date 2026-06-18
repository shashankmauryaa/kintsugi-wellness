"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, Users, Leaf, Sparkles } from "lucide-react";

export default function Home() {
  const fadeIn: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Full-width Hero Image */}
      <motion.div 
        className="w-full h-screen relative mb-16 -mt-[88px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img 
          src="/kintsugi-vase.png" 
          alt="Kintsugi Wellness vase" 
          className="w-full h-full object-cover object-[center_30%]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1616861214040-3882f07d2c38?q=80&w=2500&auto=format&fit=crop";
          }}
        />
        <div className="absolute bottom-12 left-8 md:left-16 z-10">
          <Link 
            href="/book" 
            className="px-8 py-4 bg-white/30 hover:bg-white/50 border border-white/40 text-[var(--color-gold-900)] backdrop-blur-md rounded-full text-lg font-medium shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center"
          >
            Book a Session
          </Link>
        </div>
      </motion.div>

      {/* Hero Content */}
      <section className="w-full max-w-6xl px-8 pb-24 mx-auto flex flex-col items-center">
        <motion.div 
          className="w-full text-center max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl md:text-6xl font-heading text-[var(--color-gold-900)] leading-tight mb-6"
          >
            Therapy at <br className="hidden md:block" /> your own pace.
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-lg md:text-xl text-[var(--color-gold-800)] mb-10 mx-auto"
          >
            A warm, compassionate, and safe space for emotional exploration and reflective growth. Healing does not need to be rushed.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link 
              href="/services" 
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-gold-700)] hover:bg-[var(--color-gold-800)] text-white rounded-full text-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              Begin Your Journey <ArrowRight size={20} />
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[var(--color-gold-400)] text-[var(--color-gold-800)] hover:bg-[var(--color-gold-100)] rounded-full text-lg font-medium transition-all text-center"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="w-full bg-white py-24 px-8 border-y border-[var(--color-gold-100)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading text-[var(--color-gold-900)] mb-4">Core Values</h2>
            <p className="text-[var(--color-gold-700)] max-w-2xl mx-auto">
              Our practice is built on a foundation of empathy, respect, and deep understanding of the human experience.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { title: "Collaborative", desc: "Therapy is built together.", icon: Users },
              { title: "Non-Judgmental", desc: "Clients are welcomed with openness and respect.", icon: Heart },
              { title: "Human-Centered", desc: "People matter more than labels.", icon: Sparkles },
              { title: "Growth-Oriented", desc: "Therapy supports meaningful change.", icon: Leaf },
            ].map((value, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                className="bg-[var(--color-gold-50)] p-8 rounded-2xl border border-[var(--color-gold-100)] hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[var(--color-gold-200)] text-[var(--color-gold-800)] rounded-xl flex items-center justify-center mb-6">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-heading text-[var(--color-gold-900)] mb-3">{value.title}</h3>
                <p className="text-[var(--color-gold-700)]">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Practice Philosophy */}
      <section className="w-full max-w-4xl px-8 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <Sparkles className="mx-auto text-[var(--color-gold-400)] mb-8" size={32} />
          <h2 className="text-3xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-8 leading-tight">
            "Therapy is not about fixing people. Healing does not need to be rushed. The therapeutic relationship itself can be healing."
          </h2>
          <p className="text-lg text-[var(--color-gold-800)]">
            — Khushi Mundra, Counselling Psychologist
          </p>
        </motion.div>
      </section>
    </div>
  );
}
