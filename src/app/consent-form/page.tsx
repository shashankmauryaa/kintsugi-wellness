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
  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(true);
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
            <h1 className="text-3xl font-heading text-[var(--color-gold-900)] mb-4">Consent Form for Counselling Services</h1>
            
            <div className="bg-[var(--color-gold-50)] p-6 rounded-2xl border border-[var(--color-gold-100)] text-[var(--color-gold-800)] space-y-3 text-sm mb-8">
              <p>Hello, and thank you for taking the time to fill this out.</p>
              <p>This form shares important information about the counselling process, confidentiality, session guidelines, and what you can expect while working together.</p>
              <p>Counselling is a collaborative process, and this form is meant to help us begin with clarity, transparency, and shared understanding.</p>
              <p className="font-medium">Please read through each section carefully. If anything feels unclear, we can always discuss it before beginning.</p>
            </div>

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
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 2: Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" value={formData.age} onChange={(e) => updateField("age", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
            </div>
            
            <h3 className="text-xl font-heading text-[var(--color-gold-900)] mt-8">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Emergency Contact Name</label>
                <input type="text" value={formData.emergencyContact.name} onChange={(e) => updateField("emergencyContact.name", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact Number</label>
                <input type="tel" value={formData.emergencyContact.phone} onChange={(e) => updateField("emergencyContact.phone", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Relationship to Emergency Contact</label>
                <input type="text" value={formData.emergencyContact.relation} onChange={(e) => updateField("emergencyContact.relation", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 3: About Counselling</h2>
            <div className="text-[var(--color-gold-800)] space-y-4">
              <p>Counselling is a space to explore your thoughts, emotions, experiences, relationships, and concerns in a supportive and collaborative way.</p>
              <p>Our work together may involve:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Exploring thoughts and feelings</li>
                <li>Understanding patterns</li>
                <li>Building emotional awareness</li>
                <li>Developing ways of coping</li>
                <li>Working toward meaningful change</li>
              </ul>
              <p>Counselling can sometimes bring up difficult emotions or uncertainty.</p>
              <p>Healing is often slower and less linear than we expect, especially in a world that constantly asks us to move quickly and "fix" things fast. Here, we can hopefully take the time needed to understand what is happening rather than rushing toward immediate answers.</p>
              <p>If the process ever feels frustrating or unclear, we can talk about that openly.</p>
            </div>
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
              <p>What you share during counselling will be treated with care and kept private.</p>
              <p>There are certain situations where confidentiality may need to be broken, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Serious risk of harm to yourself or someone else</li>
                <li>Disclosure of abuse or situations requiring ethical or legal action</li>
                <li>Legal requirements to disclose information</li>
              </ul>
              <p>As part of my professional practice, I continue to work with clinical supervision. This may involve discussing aspects of our work with my supervisor for guidance and reflection. Your identifying details, including your name and personal identifying information, will not be shared.</p>
              <p>If confidentiality ever needs to be breached, I will do my best to inform you and discuss the next steps with you before proceeding.</p>
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
            <div className="text-[var(--color-gold-800)] space-y-6">
              <div>
                <h3 className="font-medium text-[var(--color-gold-900)] mb-1">Session Length</h3>
                <p>Sessions are typically 50–60 minutes, unless discussed otherwise.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-[var(--color-gold-900)] mb-1">Fees</h3>
                <p>Session fees are discussed and agreed upon individually before beginning counselling.<br/>Payment is expected as mutually agreed.</p>
              </div>

              <div>
                <h3 className="font-medium text-[var(--color-gold-900)] mb-1">Rescheduling / Cancellation</h3>
                <p>If you need to cancel or reschedule a session, please try to inform me at least 24 hours in advance.<br/>Late cancellations or missed sessions may be charged unless there are exceptional circumstances.</p>
              </div>

              <div>
                <h3 className="font-medium text-[var(--color-gold-900)] mb-1">Late Arrival</h3>
                <p>If a session begins late, it will still need to end at the originally scheduled time.</p>
              </div>

              <div>
                <h3 className="font-medium text-[var(--color-gold-900)] mb-1">Between-Session Communication</h3>
                <p>Communication outside sessions is best kept for scheduling or practical concerns.<br/>Messages are usually responded to within 24–48 hours during working hours.</p>
                <p className="mt-2">If something important comes up and you feel you need support before our next session, you are welcome to reach out. Depending on availability, we can try to schedule a session at the earliest possible time.</p>
                <p className="mt-2">If the concern is urgent or involves immediate risk, it is important to also seek immediate support through trusted people or emergency resources.</p>
              </div>
            </div>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack5} onChange={(e) => updateField("ack5", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand and agree to these session guidelines.</span>
            </label>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 6: Additional Support</h2>
            <div className="text-[var(--color-gold-800)] space-y-4">
              <p>If you are experiencing urgent emotional distress, immediate support may sometimes be needed beyond scheduled sessions.</p>
              <p>As I may not always be available right away, please also reach out to trusted supporters, local emergency services, or crisis resources when needed.</p>
              <p>If possible and scheduling allows, we can try to arrange an earlier session.</p>
              <div className="bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-200)] overflow-hidden text-sm">
                <div className="p-4 bg-[var(--color-gold-100)] font-medium text-[var(--color-gold-900)] border-b border-[var(--color-gold-200)]">
                  Suggested Emergency Contacts and Helplines (Please take a screenshot for future reference)
                </div>
                <div className="divide-y divide-[var(--color-gold-200)]">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="font-medium text-[var(--color-gold-900)]">KIRAN (Govt. of India)</div>
                    <a href="tel:18005990019" className="text-[var(--color-gold-700)] hover:underline">1800-599-0019</a>
                    <div className="text-[var(--color-gold-600)]">-</div>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
                    <div className="font-medium text-[var(--color-gold-900)]">NIMHANS</div>
                    <a href="tel:08046110007" className="text-[var(--color-gold-700)] hover:underline">080-46110007</a>
                    <a href="http://nimhans.ac.in/pssmhs-helpline/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold-600)] hover:underline truncate">nimhans.ac.in</a>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="font-medium text-[var(--color-gold-900)]">CADABAM'S Suicide Helpline</div>
                    <div className="text-[var(--color-gold-700)] flex flex-col">
                      <a href="tel:09611194949" className="hover:underline">09611194949</a>
                      <a href="tel:09741476476" className="hover:underline">09741476476</a>
                    </div>
                    <div className="text-[var(--color-gold-600)]">-</div>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
                    <div className="font-medium text-[var(--color-gold-900)]">Vandrevala Foundation</div>
                    <a href="tel:+919999666555" className="text-[var(--color-gold-700)] hover:underline">09999666555</a>
                    <a href="http://www.vandrevalafoundation.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold-600)] hover:underline truncate">vandrevalafoundation.com</a>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="font-medium text-[var(--color-gold-900)]">AASRA</div>
                    <a href="tel:9820466726" className="text-[var(--color-gold-700)] hover:underline">09820466726</a>
                    <a href="http://www.aasra.info/helpline.html" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold-600)] hover:underline truncate">aasra.info</a>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
                    <div className="font-medium text-[var(--color-gold-900)]">Tele MANAS (National)</div>
                    <a href="tel:14416" className="text-[var(--color-gold-700)] hover:underline">14416</a>
                    <div className="text-[var(--color-gold-600)]">-</div>
                  </div>
                </div>
              </div>
            </div>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack6} onChange={(e) => updateField("ack6", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand this and recognise the importance of seeking immediate support when needed.</span>
            </label>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 7: Record Keeping</h2>
            <div className="text-[var(--color-gold-800)] space-y-4">
              <p>Brief notes may be maintained to support the counselling process and professional record keeping.</p>
              <p>These will be stored securely and kept private.</p>
              <p>Sessions will not be recorded unless explicitly discussed and separately agreed to.</p>
            </div>
            <label className="flex items-start gap-3 mt-8 cursor-pointer">
              <input type="checkbox" checked={formData.ack7} onChange={(e) => updateField("ack7", e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-gold-600)]" />
              <span className="text-[var(--color-gold-900)] font-medium">I understand the record-keeping policy.</span>
            </label>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 8: Consent</h2>
            <div className="text-[var(--color-gold-800)] space-y-2 mb-6">
              <p className="font-medium">By signing below, I confirm that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>I have read and understood the information shared in this form</li>
                <li>I have had the opportunity to ask questions or seek clarification</li>
                <li>I am choosing to engage in counselling voluntarily</li>
                <li>I give my informed consent to begin / continue counselling services</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name (Digital Signature)</label>
                <input type="text" value={formData.signature} onChange={(e) => updateField("signature", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[var(--color-gold-400)]" />
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

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-sm border border-[var(--color-gold-200)] max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-[var(--color-gold-100)] rounded-full flex items-center justify-center mx-auto mb-8 text-[var(--color-gold-700)] text-3xl">
            ✓
          </div>
          <h2 className="text-3xl font-heading text-[var(--color-gold-900)] mb-4">Thank you for completing this form.</h2>
          <p className="text-[var(--color-gold-800)] mb-10 text-lg">
            Your response has been received. If needed, we can discuss any questions or clarifications before our session.
          </p>
          <button 
            onClick={() => router.push("/book")}
            className="px-8 py-4 bg-[var(--color-gold-800)] text-white rounded-full font-medium hover:bg-[var(--color-gold-900)] transition-colors w-full"
          >
            Continue to Book a Session
          </button>
        </motion.div>
      </div>
    );
  }

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
