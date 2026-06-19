"use client";

import { Sparkles, GraduationCap, Heart, HandHeart, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex-1 flex flex-col items-center w-full bg-white">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-6">About Khushi Mundra</h1>
        <p className="text-lg text-[var(--color-gold-700)] max-w-2xl mx-auto">
          Counselling Psychologist dedicated to providing a warm, reflective, and safe space for healing and personal growth.
        </p>
      </section>

      {/* Two Column Section */}
      <section className="w-full max-w-6xl px-8 pb-24 flex flex-col md:flex-row gap-16 items-start">
        <div className="flex-1 w-full relative">
          {/* Profile Image */}
          <div className="w-full aspect-[4/5] bg-[var(--color-gold-100)] rounded-3xl overflow-hidden relative border border-[var(--color-gold-200)]">
            <img 
              src="/khushi.JPG" 
              alt="Khushi Mundra Profile Photo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-12">
          {/* Background */}
          <div>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
              <GraduationCap className="text-[var(--color-gold-500)]" /> Professional Background
            </h2>
            <ul className="space-y-3 text-[var(--color-gold-800)]">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                MSc in Counselling Psychology
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                CHRIST (Deemed to be University), Bangalore
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                200+ supervised counselling hours
              </li>
            </ul>
          </div>

          {/* Approach */}
          <div>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
              <Heart className="text-[var(--color-gold-500)]" /> Therapeutic Approach
            </h2>
            <p className="text-[var(--color-gold-800)] mb-4 leading-relaxed">
              My work is relational and trauma-informed. Rather than following one fixed model, therapy is adapted to the unique needs, pace, and lived experiences of each client.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Humanistic', 'Somatic', 'Emotion-Focused', 'Narrative'].map((approach) => (
                <div key={approach} className="bg-[var(--color-gold-50)] px-4 py-3 rounded-xl border border-[var(--color-gold-200)] text-[var(--color-gold-900)] text-sm font-medium text-center">
                  {approach}
                </div>
              ))}
            </div>
          </div>

          {/* What to Expect */}
          <div>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
              <HandHeart className="text-[var(--color-gold-500)]" /> What Clients Can Expect
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Warmth', 'Curiosity', 'Collaboration', 'Respect', 'Reflection', 'Honest conversations'].map((item) => (
                <span key={item} className="px-4 py-2 bg-white border border-[var(--color-gold-300)] rounded-full text-sm text-[var(--color-gold-800)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Practical Details (Floating Card) */}
      <section className="py-20 px-8 max-w-5xl mx-auto w-full relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -5 }}
          className="bg-white p-8 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-gold-100)] relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 text-[var(--color-gold-200)] text-4xl opacity-50 rotate-12">✦</div>
          <div className="absolute bottom-10 left-10 text-[var(--color-gold-200)] text-4xl opacity-50 -rotate-12">✦</div>
          
          <div className="text-center mb-14 relative z-10">
            <h3 className="text-3xl md:text-4xl font-heading text-[var(--color-gold-900)]">Practical Details</h3>
            <div className="w-12 h-1 bg-[var(--color-gold-300)] mx-auto mt-6 rounded-full opacity-70"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-16 relative z-10">
            {/* Left Column */}
            <div className="md:w-1/2 space-y-10">
              <div>
                <h4 className="font-heading text-xl text-[var(--color-gold-900)] mb-5 flex items-center gap-3">
                  <span className="text-[var(--color-gold-400)] text-sm">✧</span> The Process
                </h4>
                <div className="bg-[var(--color-gold-50)] p-7 rounded-3xl border border-[var(--color-gold-100)]">
                  <p className="text-[var(--color-gold-800)] mb-5 leading-relaxed">All sessions are conducted online through a secure video platform.</p>
                  <p className="text-[var(--color-gold-900)] mb-4 font-medium">Once a session is booked, you will receive:</p>
                  <ul className="list-none space-y-3 text-[var(--color-gold-800)]">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0"></div> A calendar invitation</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0"></div> Session details</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0"></div> A secure meeting link via email</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-heading text-xl text-[var(--color-gold-900)] mb-5 flex items-center gap-3">
                  <span className="text-[var(--color-gold-400)] text-sm">✧</span> Session Details & Fees
                </h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-[var(--color-gold-200)] pl-5 py-1">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg">Individual Counselling</div>
                    <div className="text-[var(--color-gold-700)] mt-1.5">50–60 minutes</div>
                  </div>
                  <div className="border-l-2 border-[var(--color-gold-200)] pl-5 py-1">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg">Fees</div>
                    <div className="text-[var(--color-gold-700)] mt-1.5 leading-relaxed">Session fees are discussed and agreed upon individually before beginning counselling. Payment is expected as mutually agreed.</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="md:w-1/2 space-y-10">
              <div>
                <h4 className="font-heading text-xl text-[var(--color-gold-900)] mb-5 flex items-center gap-3">
                  <span className="text-[var(--color-gold-400)] text-sm">✧</span> Scheduling & Policies
                </h4>
                <div className="space-y-5">
                  <div className="bg-white p-6 rounded-3xl border border-[var(--color-gold-100)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg mb-3">Rescheduling & Cancellation</div>
                    <div className="text-[var(--color-gold-700)] leading-relaxed">If you need to cancel or reschedule a session, please try to inform me at least 24 hours in advance. Late cancellations or missed sessions may be charged unless there are exceptional circumstances.</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-[var(--color-gold-100)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg mb-3">Late Arrival</div>
                    <div className="text-[var(--color-gold-700)] leading-relaxed">If a session begins late, it will still need to end at the originally scheduled time.</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-[var(--color-gold-100)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg mb-3">Between-Session Communication</div>
                    <div className="text-[var(--color-gold-700)] leading-relaxed">Communication outside sessions is best kept for scheduling or practical concerns. Messages are usually responded to within 24–48 hours during working hours.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Callout */}
      <section className="w-full bg-[var(--color-gold-50)] py-20 px-8 border-y border-[var(--color-gold-200)] text-center">
        <div className="max-w-3xl mx-auto">
          <Leaf className="mx-auto text-[var(--color-gold-500)] mb-6" size={32} />
          <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6 leading-relaxed">
            "People are more than the difficulties they bring into therapy. Growth often happens through curiosity, reflection, and understanding."
          </h3>
        </div>
      </section>
    </div>
  );
}
