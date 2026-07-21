/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Heart, HandHeart, Wind, Compass } from "lucide-react";

export default function WhatToExpect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="flex-1 flex flex-col w-full bg-[var(--color-gold-50)] pt-12">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center text-center px-8 max-w-4xl mx-auto py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--color-gold-900)] mb-6"
        >
          Your journey, at your pace
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-6 text-lg md:text-xl text-[var(--color-gold-800)]"
        >
          <p>I see therapy as a space where things do not need to be rushed. </p>

          <p className="font-medium text-[var(--color-gold-900)]">This is a space where we can slow down, make room for your experiences, and explore what feels important to you.</p>
        </motion.div>
      </section>

      {/* The Process */}
      <section className="py-24 px-8 max-w-5xl mx-auto w-full" ref={containerRef}>
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-heading text-[var(--color-gold-900)] mb-4">The Process</h2>
          <div className="w-16 h-px bg-[var(--color-gold-300)] mx-auto"></div>
        </div>

        <div className="relative">
          {/* Vertical Timeline Connector */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-[var(--color-gold-200)] hidden md:block">
            <motion.div 
              style={{ height: lineHeight }}
              className="w-full bg-[var(--color-gold-500)] origin-top"
            />
          </div>

          <div className="space-y-24 relative z-10">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              <div className="md:w-1/2 flex justify-start md:justify-end">
                <div className="w-16 h-16 rounded-full bg-white border border-[var(--color-gold-200)] flex items-center justify-center text-2xl font-heading text-[var(--color-gold-800)] shadow-sm">
                  1
                </div>
              </div>
              <div className="md:w-1/2 text-left">
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4">Reach Out</h3>
                <div className="space-y-3 text-[var(--color-gold-800)] leading-relaxed">
                  <p>Whether you send a message, schedule a session online, or simply ask a question, reaching out is the first step.</p>
                  <p>You don't need to explain your whole story. A few words are enough.</p>
                  <p>There is no expectation to know exactly what you need before we begin.</p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16"
            >
              <div className="md:w-1/2 flex justify-start md:justify-start">
                <div className="w-16 h-16 rounded-full bg-white border border-[var(--color-gold-200)] flex items-center justify-center text-2xl font-heading text-[var(--color-gold-800)] shadow-sm">
                  2
                </div>
              </div>
              <div className="md:w-1/2 text-left md:text-right">
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4">A First Conversation</h3>
                <div className="space-y-3 text-[var(--color-gold-800)] leading-relaxed">
                  <p>Our first session is an opportunity to get to know each other and begin understanding what brings you here.</p>
                  <p>There is no pressure to share everything immediately.</p>
                  <p>We can start wherever feels most comfortable for you.</p>
                  <p>The first conversation is less about "getting it right" and more about seeing whether the space feels supportive and useful for you.</p>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              <div className="md:w-1/2 flex justify-start md:justify-end">
                <div className="w-16 h-16 rounded-full bg-white border border-[var(--color-gold-200)] flex items-center justify-center text-2xl font-heading text-[var(--color-gold-800)] shadow-sm">
                  3
                </div>
              </div>
              <div className="md:w-1/2 text-left">
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4">Building Safety and Trust</h3>
                <div className="space-y-3 text-[var(--color-gold-800)] leading-relaxed">
                  <p>Trust is not something that is expected from the beginning.</p>
                  <p>It develops over time through consistency, honesty, and mutual understanding.</p>
                  <p>Throughout our work together, we will continue checking in about what feels helpful, what doesn't, and how the process is feeling for you.</p>
                  <p>Your feedback matters, and your comfort is important.</p>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16"
            >
              <div className="md:w-1/2 flex justify-start md:justify-start">
                <div className="w-16 h-16 rounded-full bg-white border border-[var(--color-gold-300)] flex items-center justify-center text-2xl font-heading text-[var(--color-gold-900)] shadow-md">
                  4
                </div>
              </div>
              <div className="md:w-1/2 text-left md:text-right">
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4">Exploring What Matters</h3>
                <div className="space-y-3 text-[var(--color-gold-800)] leading-relaxed">
                  <p>As trust develops, we may begin to look more closely at the experiences, emotions, patterns, relationships, and questions that feel significant in your life.</p>
                  <p>Sometimes this involves reflection and understanding.</p>
                  <p>Sometimes it involves experimenting with new ways of relating to yourself and others.</p>
                  <p>There is no fixed timeline. The pace and depth of the work remain collaborative throughout the process.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* The Approach */}
      <section className="py-32 px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-[var(--color-gold-600)] mb-4 font-bold">The Approach</p>
          <h2 className="text-3xl md:text-4xl font-heading text-[var(--color-gold-900)] mb-4">How We Work Together</h2>
          <div className="w-16 h-px bg-[var(--color-gold-300)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Relational",
              icon: <HandHeart className="w-6 h-6" />,
              text: "We are shaped by our experiences, relationships, environments, and histories. Rather than viewing difficulties in isolation, we explore them within the broader context of your life and experiences."
            },
            {
              title: "Warm and Honest",
              icon: <Heart className="w-6 h-6" />,
              text: "Therapy is grounded in compassion, curiosity, and respect. Alongside support, there is also room for honesty, reflection, and meaningful conversations that help deepen understanding."
            },
            {
              title: "Flexible and Responsive",
              icon: <Wind className="w-6 h-6" />,
              text: "No single approach works for everyone. Our work can draw from humanistic, narrative, emotion-focused, and somatic perspectives depending on what feels most supportive and relevant to you."
            },
            {
              title: "Your Pace, Always",
              icon: <Compass className="w-6 h-6" />,
              text: "There is no expectation to move faster than feels right. You remain an active participant in the process, with space to decide what feels comfortable, meaningful, and manageable for you."
            }
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-gold-200)] group flex flex-col h-full"
            >
              <motion.div 
                className="w-12 h-12 bg-[var(--color-gold-50)] rounded-full flex items-center justify-center text-[var(--color-gold-700)] mb-6 group-hover:bg-[var(--color-gold-100)] group-hover:text-[var(--color-gold-900)] transition-colors"
                whileHover={{ rotate: 5 }}
              >
                {card.icon}
              </motion.div>
              <h3 className="text-xl font-heading text-[var(--color-gold-900)] mb-4">{card.title}</h3>
              <p className="text-[var(--color-gold-800)] text-sm leading-relaxed flex-1">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-32 px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading text-[var(--color-gold-900)] mb-8">A Space to Begin</h2>
          <div className="space-y-6 text-lg text-[var(--color-gold-800)] mb-12">
            <p>Starting therapy can feel unfamiliar.</p>
            <p>Whether you are carrying something difficult, navigating a period of change, or simply wanting to understand yourself more deeply, you do not need to do it alone.</p>
            <p className="font-medium text-[var(--color-gold-900)]">Whenever you feel ready, the conversation can begin.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/book" 
              className="px-8 py-4 bg-[var(--color-gold-700)] hover:bg-[var(--color-gold-800)] text-white rounded-full font-medium transition-colors shadow-sm inline-block"
            >
              Book a Session
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-transparent border border-[var(--color-gold-400)] text-[var(--color-gold-800)] hover:bg-[var(--color-gold-100)] rounded-full font-medium transition-colors inline-block"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
