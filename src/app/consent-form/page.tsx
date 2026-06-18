"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitConsentForm } from "@/actions/consent";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsentForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    ack1: false,
    fullName: "",
    age: "",
    email: "", // Pre-filled ideally
    phone: "",
    emergencyContact: { name: "", phone: "", relation: "" },
    ack3: false,
    ack4: false,
    ack5: false,
    ack6: false,
    ack7: false,
    signature: "",
    date: new Date().toISOString().split("T")[0],
    finalAck: false,
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("consentFormDraft");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("consentFormDraft", JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      if (keys.length === 2) {
        return { ...prev, [keys[0]]: { ...(prev as any)[keys[0]], [keys[1]]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const validateStep = () => {
    switch (step) {
      case 1: return formData.ack1;
      case 2: return formData.fullName && formData.age && formData.phone && formData.emergencyContact.name && formData.emergencyContact.phone && formData.emergencyContact.relation;
      case 3: return formData.ack3;
      case 4: return formData.ack4;
      case 5: return formData.ack5;
      case 6: return formData.ack6;
      case 7: return formData.ack7;
      case 8: return formData.signature && formData.date && formData.finalAck;
      default: return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 8));
    } else {
      setError("Please complete all required fields for this section.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    
    const result = await submitConsentForm(formData);
    
    if (result.success) {
      localStorage.removeItem("consentFormDraft");
      router.push("/book");
    } else {
      setError(result.error || "Failed to submit consent form.");
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 1: About Your Counsellor</h2>
            <div className="text-[var(--color-gold-800)] space-y-4">
              <p>Counselling sessions will be conducted by Khushi Mundra, an early-career Counselling Psychologist who has completed an MSc in Counselling Psychology from CHRIST (Deemed to be University), Bangalore, with over 200 hours of supervised counselling practice.</p>
              <p>My work is relational and trauma-informed, drawing from humanistic, somatic, emotion-focused, and narrative approaches. Rather than following one fixed method, I aim to tailor therapy to your needs, pace, and lived experiences.</p>
              <p>I see therapy as a space where things do not need to be rushed, and where there is room to gently explore, reflect, and understand your experiences.</p>
            </div>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack1} onChange={(e) => updateField("ack1", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I have read and understood this information.</span>
            </label>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 2: Client Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" value={formData.age} onChange={(e) => updateField("age", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
            </div>
            
            <h3 className="text-xl font-heading text-[var(--color-gold-900)] mt-8">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={formData.emergencyContact.name} onChange={(e) => updateField("emergencyContact.name", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" value={formData.emergencyContact.phone} onChange={(e) => updateField("emergencyContact.phone", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Relationship</label>
                <input type="text" value={formData.emergencyContact.relation} onChange={(e) => updateField("emergencyContact.relation", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 3: About Counselling</h2>
            <p className="text-[var(--color-gold-800)]">Therapy is a collaborative process. We will work together to explore your thoughts, feelings, and experiences in a safe, non-judgmental environment.</p>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack3} onChange={(e) => updateField("ack3", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand the nature of counselling and what the process may involve.</span>
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 4: Confidentiality</h2>
            <div className="text-[var(--color-gold-800)] space-y-4">
              <p>Everything discussed in our sessions is strictly confidential. Information will only be disclosed under the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>If there is a clear and imminent risk of harm to yourself or others.</li>
                <li>In cases of disclosed abuse (child, elder, or dependent adult).</li>
                <li>If required by a court of law.</li>
              </ul>
              <p className="font-medium">As part of my professional practice, I continue to work with clinical supervision. This may involve discussing aspects of our work with my supervisor for guidance and reflection. Your identifying details, including your name and personal identifying information, will not be shared.</p>
            </div>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack4} onChange={(e) => updateField("ack4", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand confidentiality and its limits.</span>
            </label>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 5: Session Guidelines</h2>
            <ul className="list-disc pl-5 space-y-2 text-[var(--color-gold-800)]">
              <li>Sessions are 50 minutes long.</li>
              <li>Cancellations require a minimum 24-hour notice, otherwise the full fee will be charged.</li>
              <li>If you arrive late, the session will still end at the scheduled time.</li>
              <li>Communication outside of sessions should be limited to administrative matters only (e.g., scheduling).</li>
            </ul>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack5} onChange={(e) => updateField("ack5", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I agree to the session guidelines.</span>
            </label>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 6: Additional Support</h2>
            <p className="text-[var(--color-gold-800)]">This practice is not an emergency crisis service. In the event of an emergency, please contact a local crisis hotline, visit the nearest hospital, or reach out to your emergency contact.</p>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack6} onChange={(e) => updateField("ack6", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand the emergency procedures.</span>
            </label>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 7: Record Keeping</h2>
            <p className="text-[var(--color-gold-800)]">Brief, secure session notes will be kept to ensure continuity of care. These notes are encrypted and stored securely. Sessions are never recorded unless separately and explicitly agreed upon.</p>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack7} onChange={(e) => updateField("ack7", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand the record-keeping policies.</span>
            </label>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 8: Informed Consent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Digital Signature (Type Full Name)</label>
                <input type="text" value={formData.signature} onChange={(e) => updateField("signature", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={formData.date} disabled className="w-full px-4 py-2 border rounded-xl bg-gray-50 text-gray-500" />
              </div>
            </div>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.finalAck} onChange={(e) => updateField("finalAck", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I give my consent to participate in counselling services.</span>
            </label>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-[var(--color-gold-700)] mb-2">
            <span>Step {step} of 8</span>
            <span>{Math.round((step / 8) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-gold-200)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--color-gold-600)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 8) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-[var(--color-gold-600)] mt-2">Progress is automatically saved.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-gold-200)] min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-12 pt-8 border-t border-[var(--color-gold-100)]">
            <button
              onClick={handleBack}
              disabled={step === 1 || loading}
              className="px-6 py-2 border border-[var(--color-gold-300)] text-[var(--color-gold-800)] rounded-full font-medium disabled:opacity-50 hover:bg-[var(--color-gold-50)] transition-colors"
            >
              Back
            </button>
            
            {step < 8 ? (
              <button
                onClick={handleNext}
                className="px-8 py-2 bg-[var(--color-gold-600)] text-white rounded-full font-medium hover:bg-[var(--color-gold-700)] transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !validateStep()}
                className="px-8 py-2 bg-[var(--color-gold-800)] text-white rounded-full font-medium disabled:opacity-50 hover:bg-[var(--color-gold-900)] transition-colors flex items-center gap-2"
              >
                {loading ? "Submitting..." : "Submit & Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
