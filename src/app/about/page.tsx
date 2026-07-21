"use client";

import { Sparkles, GraduationCap, Heart, HandHeart, Leaf, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define the therapist type
interface TherapistProfile {
  id: string;
  name: string;
  photoUrl: string;
  title: string;
  email: string;
  phone?: string;
  bio: string;
  personalNote?: string;
  background: string[];
  approach: {
    description: string;
    tags: string[];
  };
  expectations: string[];
  isActive?: boolean;
  joinedAt?: number;
}

export default function AboutUs() {
  const [therapists, setTherapists] = useState<TherapistProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const q = query(collection(db, "therapist_profiles"), where("isActive", "==", true));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TherapistProfile[];
        
        // Sort by joinedAt so the oldest (lowest number) appears first
        data.sort((a, b) => (a.joinedAt || 99) - (b.joinedAt || 99));
        
        setTherapists(data);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center w-full bg-white">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center text-center px-8 max-w-4xl mx-auto py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--color-gold-900)] mb-12"
        >
          About Us
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-6 text-lg md:text-xl text-[var(--color-gold-800)]"
        >
          <p>A collective of dedicated psychologists providing a warm, reflective, and safe space for healing and personal growth.</p>
        </motion.div>
      </section>

      {/* Therapists Directory */}
      <div className="w-full flex flex-col gap-24 pb-24 px-4 md:px-8 min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-[var(--color-gold-600)]">
            Loading therapists...
          </div>
        ) : therapists.map((therapist, index) => (
          <motion.section 
            key={therapist.id} 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-6xl mx-auto bg-white p-8 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-gold-100)] relative overflow-hidden flex flex-col"
          >
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start w-full">
              <div className={`flex-1 w-full relative space-y-6 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-heading text-[var(--color-gold-900)] mb-2">
                  {therapist.name}
                </h2>
                <h3 className="text-xl text-[var(--color-gold-600)] font-medium">
                  {therapist.title}
                </h3>
              </div>
              {/* Profile Image */}
              <div className="w-full aspect-[4/5] bg-[var(--color-gold-50)] rounded-3xl overflow-hidden relative border border-[var(--color-gold-200)] flex items-center justify-center">
                {therapist.photoUrl ? (
                  <img 
                    src={therapist.photoUrl} 
                    alt={`${therapist.name} Profile Photo`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-[var(--color-gold-300)]" />
                )}
              </div>
              <div className="pt-2 flex justify-center w-full">
                <Link href={`/book?therapist=${therapist.id}`} className="w-full md:w-auto">
                  <button className="px-8 py-4 bg-[var(--color-gold-700)] text-white rounded-full font-medium hover:bg-[var(--color-gold-800)] transition-colors shadow-sm hover:shadow-md active:scale-95 w-full md:w-auto">
                    Book a session with {therapist.name.split(' ')[0]}
                  </button>
                </Link>
              </div>
            </div>

            <div className={`flex-1 space-y-12 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
              
              <div>
                <p className="text-[var(--color-gold-800)] text-lg leading-relaxed">
                  {therapist.bio}
                </p>
              </div>

              {/* Background */}
              <div>
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
                  <GraduationCap className="text-[var(--color-gold-500)]" /> Professional Background
                </h3>
                <ul className="space-y-3 text-[var(--color-gold-800)]">
                  {therapist.background.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Approach */}
              <div>
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
                  <Heart className="text-[var(--color-gold-500)]" /> Therapeutic Approach
                </h3>
                <p className="text-[var(--color-gold-800)] mb-4 leading-relaxed">
                  {therapist.approach.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {therapist.approach.tags.map((approach) => (
                    <div key={approach} className="bg-[var(--color-gold-50)] px-4 py-3 rounded-xl border border-[var(--color-gold-200)] text-[var(--color-gold-900)] text-sm font-medium text-center">
                      {approach}
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div>
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
                  <HandHeart className="text-[var(--color-gold-500)]" /> What Clients Can Expect
                </h3>
                <div className="flex flex-wrap gap-3">
                  {therapist.expectations.map((item) => (
                    <span key={item} className="px-4 py-2 bg-white border border-[var(--color-gold-300)] rounded-full text-sm text-[var(--color-gold-800)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4">
                <h3 className="text-2xl font-heading text-[var(--color-gold-900)] flex items-center gap-3">
                  <Mail className="text-[var(--color-gold-500)]" /> Get In Touch
                </h3>
                <span className="hidden sm:block text-[var(--color-gold-300)]">|</span>
                <a href={`mailto:${therapist.email}`} className="text-[var(--color-gold-800)] hover:text-[var(--color-gold-600)] transition-colors text-lg">
                  {therapist.email}
                </a>
              </div>

            </div>
            </div>

            {/* Note from therapist (Full width) */}
            {therapist.personalNote && (
              <div className="w-full mt-12 pt-12 border-t border-[var(--color-gold-100)] text-center">
                <h4 className="text-[var(--color-gold-600)] text-sm font-bold tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
                  <Sparkles size={16} /> A Note from {therapist.name.split(' ')[0]} <Sparkles size={16} />
                </h4>
                <p className="text-[var(--color-gold-900)] italic leading-relaxed text-xl md:text-2xl max-w-3xl mx-auto">
                  "{therapist.personalNote}"
                </p>
              </div>
            )}
          </motion.section>
        ))}
      </div>

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
                    <div className="font-medium text-[var(--color-gold-900)] text-lg">Counselling</div>
                    <div className="text-[var(--color-gold-700)] mt-1.5">60 minutes</div>
                  </div>
                  <div className="border-l-2 border-[var(--color-gold-200)] pl-5 py-1">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg">Listening Space Sessions</div>
                    <div className="text-[var(--color-gold-700)] mt-1.5">30 minutes</div>
                  </div>
                  <div className="border-l-2 border-[var(--color-gold-200)] pl-5 py-1">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg">Fees</div>
                    <div className="text-[var(--color-gold-700)] mt-1.5 leading-relaxed">Session fees are to be paid before the session begins for booking the session slot.</div>
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
                    <div className="text-[var(--color-gold-700)] leading-relaxed">If you need to cancel or reschedule a session, please try to reschedule through the website and inform me at least 24 hours in advance. Late cancellations or missed sessions may be charged unless there are exceptional circumstances.</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-[var(--color-gold-100)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg mb-3">Late Arrival</div>
                    <div className="text-[var(--color-gold-700)] leading-relaxed">If a session begins late, it will still need to end at the originally scheduled time because of further upcoming sessions.</div>
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
