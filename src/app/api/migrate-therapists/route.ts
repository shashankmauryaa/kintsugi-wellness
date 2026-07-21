import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';

const THERAPISTS = [
  {
    id: "khushi-mundra",
    name: "Khushi Mundra",
    photoUrl: "/khushi.JPG",
    title: "Counselling Psychologist",
    email: "khushiimundrawork@gmail.com",
    bio: "Counselling Psychologist dedicated to providing a warm, reflective, and safe space for healing and personal growth.",
    personalNote: "I believe that therapy is a collaborative journey. My goal is to help you discover your own strengths and build resilience in a safe, non-judgmental space.",
    background: [
      "MSc in Counselling Psychology",
      "CHRIST (Deemed to be University), Bangalore",
      "200+ supervised counselling hours"
    ],
    approach: {
      description: "My work is relational and trauma-informed. Rather than following one fixed model, therapy is adapted to the unique needs, pace, and lived experiences of each client.",
      tags: ["Humanistic", "Somatic", "Emotion-Focused", "Narrative"]
    },
    expectations: ["Warmth", "Curiosity", "Collaboration", "Respect", "Reflection", "Honest conversations"],
    isActive: true,
    joinedAt: 1
  },
  {
    id: "arav-sharma",
    name: "Arav Sharma",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    title: "Clinical Psychologist",
    email: "arav.sharma@gmail.com",
    bio: "Clinical Psychologist specializing in cognitive-behavioral techniques to help clients navigate anxiety and life transitions.",
    personalNote: "Taking the first step towards therapy can be daunting. I'm here to provide structured support and practical tools to help you navigate life's challenges.",
    background: [
      "MPhil in Clinical Psychology",
      "NIMHANS, Bangalore",
      "5+ years of clinical experience"
    ],
    approach: {
      description: "My approach is structured and goal-oriented. We work collaboratively to identify unhelpful thought patterns and build practical coping strategies.",
      tags: ["CBT", "Mindfulness", "Solution-Focused", "Behavioral"]
    },
    expectations: ["Structure", "Empathy", "Action-oriented", "Skill-building", "Patience"],
    isActive: true,
    joinedAt: 2
  }
];

export async function GET() {
  try {
    const batch = adminDb.batch();
    
    THERAPISTS.forEach((therapist) => {
      const docRef = adminDb.collection('therapist_profiles').doc(therapist.id);
      batch.set(docRef, therapist);
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: "Therapists migrated successfully!" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
