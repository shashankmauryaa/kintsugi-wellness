"use client";

import { useState } from "react";
import Link from "next/link";
import { updateClientInfo } from "@/actions/profile";
import { User, Phone, Mail, Calendar, HeartPulse, CheckCircle2, AlertCircle, Save, X, Edit2, FileText, ArrowRight } from "lucide-react";

export default function MyInfoView({
  user,
  profileData,
  latestConsent
}: {
  user: { name: string; email: string };
  profileData: any;
  latestConsent: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    age: profileData?.age || "",
    phone: profileData?.phone || "",
    emergencyContact: {
      name: profileData?.emergencyContact?.name || "",
      phone: profileData?.emergencyContact?.phone || "",
      relation: profileData?.emergencyContact?.relation || "",
    }
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => {
      const keys = field.split(".");
      if (keys.length === 2) {
        return { ...prev, [keys[0]]: { ...(prev as any)[keys[0]], [keys[1]]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    const result = await updateClientInfo(formData);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setError(result.error || "Failed to save information");
    }
    setLoading(false);
  };

  const consentedDate = latestConsent?.consentedAt 
    ? new Date(latestConsent.consentedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading text-[var(--color-gold-900)] mb-2">My Information</h1>
        <p className="text-[var(--color-gold-700)]">Manage your personal details and view your agreed terms.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Personal Details Card */}
      <div className="bg-white rounded-[2rem] border border-[var(--color-gold-200)] shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-gold-100)]">
          <div className="flex items-center gap-3 text-[var(--color-gold-900)]">
            <User size={24} className="text-[var(--color-gold-600)]" />
            <h2 className="text-xl font-heading font-medium">Personal Details</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gold-50)] text-[var(--color-gold-800)] hover:bg-[var(--color-gold-100)] rounded-full transition-colors text-sm font-medium w-fit"
            >
              <Edit2 size={16} /> Edit Info
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  // Reset form data to original
                  setFormData({
                    age: profileData?.age || "",
                    phone: profileData?.phone || "",
                    emergencyContact: {
                      name: profileData?.emergencyContact?.name || "",
                      phone: profileData?.emergencyContact?.phone || "",
                      relation: profileData?.emergencyContact?.relation || "",
                    }
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 text-[var(--color-gold-600)] hover:bg-[var(--color-gold-50)] rounded-full transition-colors text-sm font-medium"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-[var(--color-gold-600)] text-white hover:bg-[var(--color-gold-700)] rounded-full transition-colors text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Static Account Info (Not editable directly here) */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold-600)] mb-1">
                <User size={16} /> Full Name
              </label>
              <div className="text-[var(--color-gold-900)] px-3 py-2 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                {user.name || "Not provided"}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold-600)] mb-1">
                <Mail size={16} /> Email Address
              </label>
              <div className="text-[var(--color-gold-900)] px-3 py-2 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                {user.email}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold-600)] mb-1">
                <Calendar size={16} /> Age
              </label>
              {isEditing ? (
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-gold-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent transition-all"
                  placeholder="Your age"
                />
              ) : (
                <div className="text-[var(--color-gold-900)] px-3 py-2">
                  {formData.age || "Not provided"}
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold-600)] mb-1">
                <Phone size={16} /> Phone Number
              </label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-gold-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent transition-all"
                  placeholder="Your phone number"
                />
              ) : (
                <div className="text-[var(--color-gold-900)] px-3 py-2">
                  {formData.phone || "Not provided"}
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 font-medium text-[var(--color-gold-800)] pb-2 border-b border-[var(--color-gold-100)]">
              <HeartPulse size={18} className="text-[var(--color-gold-500)]" /> Emergency Contact
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-600)] mb-1">Contact Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.emergencyContact.name}
                  onChange={(e) => updateField("emergencyContact.name", e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-gold-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent transition-all"
                  placeholder="Emergency contact name"
                />
              ) : (
                <div className="text-[var(--color-gold-900)] px-3 py-2 bg-white rounded-xl">
                  {formData.emergencyContact.name || "Not provided"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-600)] mb-1">Contact Phone</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={formData.emergencyContact.phone}
                  onChange={(e) => updateField("emergencyContact.phone", e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-gold-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent transition-all"
                  placeholder="Emergency contact phone"
                />
              ) : (
                <div className="text-[var(--color-gold-900)] px-3 py-2 bg-white rounded-xl">
                  {formData.emergencyContact.phone || "Not provided"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-600)] mb-1">Relationship</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.emergencyContact.relation}
                  onChange={(e) => updateField("emergencyContact.relation", e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-gold-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent transition-all"
                  placeholder="e.g. Mother, Partner"
                />
              ) : (
                <div className="text-[var(--color-gold-900)] px-3 py-2 bg-white rounded-xl">
                  {formData.emergencyContact.relation || "Not provided"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms Agreed Section */}
      <div className="bg-white rounded-[2rem] border border-[var(--color-gold-200)] shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-gold-100)] bg-[var(--color-gold-50)]/50">
          <div className="flex items-center gap-3 text-[var(--color-gold-900)]">
            <FileText size={24} className="text-[var(--color-gold-600)]" />
            <h2 className="text-xl font-heading font-medium">Terms Agreed</h2>
          </div>
          {consentedDate ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
              <CheckCircle2 size={16} />
              Agreed on {consentedDate}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              <AlertCircle size={16} />
              No consent form on file
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          {consentedDate ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="text-[var(--color-gold-500)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-[var(--color-gold-900)]">Nature of Counselling</h3>
                  <p className="text-sm text-[var(--color-gold-700)] mt-1">Understood that counselling explores thoughts and emotions, that healing is non-linear, and agreed to communicate openly if the process feels unclear.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle2 className="text-[var(--color-gold-500)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-[var(--color-gold-900)]">Confidentiality & Limits</h3>
                  <p className="text-sm text-[var(--color-gold-700)] mt-1">Understood that information is kept private, except in situations involving serious risk of harm, disclosure of abuse, or legal requirements.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="text-[var(--color-gold-500)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-[var(--color-gold-900)]">Session Guidelines</h3>
                  <p className="text-sm text-[var(--color-gold-700)] mt-1">Agreed to the 50-60 minute session length, fee structure, 24-hour cancellation policy, and communication boundaries between sessions.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="text-[var(--color-gold-500)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-[var(--color-gold-900)]">Additional Support</h3>
                  <p className="text-sm text-[var(--color-gold-700)] mt-1">Recognised the importance of seeking immediate support from trusted supporters, helplines, or emergency services during urgent emotional distress.</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[var(--color-gold-600)] text-center py-8">
              We don't have a record of your signed consent form yet. If you believe this is an error, please contact us.
            </p>
          )}
        </div>
      </div>

      {/* Revisit Consent Form Card */}
      <div className="bg-white rounded-[2rem] border border-[var(--color-gold-200)] shadow-sm overflow-hidden p-8 md:p-10 text-center relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-gold-300)] via-[var(--color-gold-500)] to-[var(--color-gold-300)] opacity-50"></div>
        
        <div className="mx-auto w-16 h-16 bg-[var(--color-gold-50)] text-[var(--color-gold-600)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <FileText size={28} />
        </div>
        
        <h2 className="text-2xl font-heading font-medium text-[var(--color-gold-900)] mb-3">
          Review Complete Consent Form
        </h2>
        
        <p className="text-[var(--color-gold-700)] max-w-lg mx-auto text-sm mb-8 leading-relaxed">
          Need to review the full details, read through our practice policies again, or update your formal acknowledgements? You can access your complete onboarding documentation here.
        </p>
        
        <Link 
          href="/consent-form" 
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-gold-600)] hover:bg-[var(--color-gold-700)] text-white rounded-full transition-all hover:-translate-y-1 hover:shadow-lg shadow-md text-sm font-medium"
        >
          Revisit Consent Form <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
}
