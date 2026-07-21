"use client";

import { useState, useRef } from "react";
import { updateTherapistProfile } from "@/actions/therapist";
import { User, Mail, Phone, BookOpen, Heart, GraduationCap, Sparkles, Camera, HandHeart, X, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function TherapistDashboard({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setMessage(null);
    try {
      const storageRef = ref(storage, `therapist_profiles/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setProfile((prev: any) => ({ ...prev, photoUrl: downloadURL }));
      setMessage({ type: "success", text: "Photo uploaded successfully! Don't forget to click Save Profile." });
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to upload photo: " + err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateTherapistProfile(profile);
    
    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully! It is now live on the About page." });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile." });
    }
    
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: string, value: string) => {
    // Splits by newline to allow easy array entry
    const arr = value.split('\n').map(s => s.trim()).filter(s => s !== "");
    setProfile((prev: any) => ({ ...prev, [name]: arr }));
  };

  return (
    <div className="flex-1 py-8 px-4 md:px-12 max-w-6xl w-full">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-[var(--color-gold-900)] flex items-center gap-3">
              <User size={32} className="text-[var(--color-gold-500)]" />
              Therapist Profile
            </h1>
            <p className="text-[var(--color-gold-700)] mt-2">Manage your public information displayed on the website.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-[var(--color-gold-200)] text-sm font-medium text-[var(--color-gold-700)] flex items-center gap-2 shadow-sm">
            Status: 
            <span className={profile.isActive ? "text-green-600" : "text-amber-600"}>
              {profile.isActive ? "Active (Visible on Site)" : "Pending Admin Approval"}
            </span>
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[var(--color-gold-200)] shadow-sm space-y-6">
            <h2 className="text-xl font-heading text-[var(--color-gold-800)] border-b border-[var(--color-gold-100)] pb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--color-gold-500)]" /> Basic Info
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[var(--color-gold-50)] border-4 border-white shadow-md flex items-center justify-center">
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-[var(--color-gold-300)]" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-white border border-[var(--color-gold-200)] text-[var(--color-gold-800)] rounded-full text-sm font-medium hover:bg-[var(--color-gold-50)] transition-colors flex items-center gap-2"
                >
                  <Camera size={16} /> {isUploading ? "Uploading..." : "Change Photo"}
                </button>
              </div>

              {/* Text Fields */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Professional Title</label>
                  <input type="text" name="title" value={profile.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1 flex items-center gap-2"><Mail size={14}/> Email</label>
                  <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1 flex items-center gap-2"><Phone size={14}/> Phone (Optional)</label>
                  <input type="text" name="phone" value={profile.phone || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Professional Bio</label>
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" required />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[var(--color-gold-200)] shadow-sm space-y-6">
            <h2 className="text-xl font-heading text-[var(--color-gold-800)] border-b border-[var(--color-gold-100)] pb-4 flex items-center gap-2">
              <Heart size={20} className="text-[var(--color-gold-500)]" /> Personal Touch
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Note from Therapist</label>
              <p className="text-xs text-[var(--color-gold-600)] mb-2">This appears in italics at the bottom of your card on the website.</p>
              <textarea name="personalNote" value={profile.personalNote || ""} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" />
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-[var(--color-gold-200)] shadow-sm space-y-6">
            <h2 className="text-xl font-heading text-[var(--color-gold-800)] border-b border-[var(--color-gold-100)] pb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-[var(--color-gold-500)]" /> Background & Approach
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Background / Education (One per line)</label>
              <textarea 
                value={profile.background?.join('\n') || ""} 
                onChange={(e) => handleArrayChange('background', e.target.value)} 
                rows={4} 
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none leading-relaxed" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Therapeutic Approach</label>
              <textarea 
                value={profile.approach?.description || ""} 
                onChange={(e) => setProfile((prev: any) => ({ ...prev, approach: { ...prev.approach, description: e.target.value } }))} 
                rows={3} 
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Tags (One per line)</label>
              <textarea 
                value={profile.approach?.tags?.join('\n') || ""} 
                onChange={(e) => {
                  const arr = e.target.value.split('\n').map(s => s.trim()).filter(s => s !== "");
                  setProfile((prev: any) => ({ ...prev, approach: { ...prev.approach, tags: arr } }));
                }}
                rows={3} 
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1 flex items-center gap-2"><Sparkles size={14}/> Expectations (One per line)</label>
              <textarea 
                value={profile.expectations?.join('\n') || ""} 
                onChange={(e) => handleArrayChange('expectations', e.target.value)} 
                rows={4} 
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-8 py-4 bg-white border border-[var(--color-gold-300)] text-[var(--color-gold-800)] rounded-full font-medium hover:bg-[var(--color-gold-50)] transition-all shadow-sm hover:shadow flex items-center gap-2 text-lg"
            >
              <Eye size={20} /> Preview Card
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-4 bg-[var(--color-gold-600)] text-white rounded-full font-medium hover:bg-[var(--color-gold-700)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
            >
              {isSaving ? "Saving changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 md:p-8">
          <div className="bg-white w-full max-w-5xl mx-auto rounded-[2.5rem] relative my-auto mt-12 mb-12 shadow-2xl">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 p-2 bg-[var(--color-gold-50)] text-[var(--color-gold-900)] rounded-full hover:bg-[var(--color-gold-100)] transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-14 relative overflow-hidden flex flex-col">
              <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start w-full">
                <div className="flex-1 w-full relative space-y-6 md:order-2">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-heading text-[var(--color-gold-900)] mb-2">
                      {profile.name || "Your Name"}
                    </h2>
                    <h3 className="text-xl text-[var(--color-gold-600)] font-medium">
                      {profile.title || "Your Title"}
                    </h3>
                  </div>
                  <div className="w-full aspect-[4/5] bg-[var(--color-gold-50)] rounded-3xl overflow-hidden relative border border-[var(--color-gold-200)] flex items-center justify-center">
                    {profile.photoUrl ? (
                      <img 
                        src={profile.photoUrl} 
                        alt={`${profile.name} Profile Photo`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={64} className="text-[var(--color-gold-300)]" />
                    )}
                  </div>
                  <div className="pt-2 flex justify-center w-full">
                    <button className="px-8 py-4 bg-[var(--color-gold-700)] text-white rounded-full font-medium shadow-sm w-full md:w-auto cursor-not-allowed opacity-80" disabled>
                      Book a session with {profile.name ? profile.name.split(' ')[0] : "Therapist"}
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-12 md:order-1">
                  <div>
                    <p className="text-[var(--color-gold-800)] text-lg leading-relaxed whitespace-pre-line">
                      {profile.bio || "Your professional bio will appear here."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
                      <GraduationCap className="text-[var(--color-gold-500)]" /> Professional Background
                    </h3>
                    <ul className="space-y-3 text-[var(--color-gold-800)]">
                      {profile.background?.length > 0 ? profile.background.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                          {item}
                        </li>
                      )) : <p className="text-sm italic opacity-70">Add background/education entries</p>}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
                      <Heart className="text-[var(--color-gold-500)]" /> Therapeutic Approach
                    </h3>
                    <p className="text-[var(--color-gold-800)] mb-4 leading-relaxed">
                      {profile.approach?.description || "Your therapeutic approach description."}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {profile.approach?.tags?.map((approach: string) => (
                        <div key={approach} className="bg-[var(--color-gold-50)] px-4 py-3 rounded-xl border border-[var(--color-gold-200)] text-[var(--color-gold-900)] text-sm font-medium text-center">
                          {approach}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
                      <HandHeart className="text-[var(--color-gold-500)]" /> What Clients Can Expect
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.expectations?.map((item: string) => (
                        <span key={item} className="px-4 py-2 bg-white border border-[var(--color-gold-300)] rounded-full text-sm text-[var(--color-gold-800)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4">
                    <h3 className="text-2xl font-heading text-[var(--color-gold-900)] flex items-center gap-3">
                      <Mail className="text-[var(--color-gold-500)]" /> Get In Touch
                    </h3>
                    <span className="hidden sm:block text-[var(--color-gold-300)]">|</span>
                    <span className="text-[var(--color-gold-800)] text-lg">
                      {profile.email || "email@example.com"}
                    </span>
                  </div>
                </div>
              </div>

              {profile.personalNote && (
                <div className="w-full mt-12 pt-12 border-t border-[var(--color-gold-100)] text-center">
                  <h4 className="text-[var(--color-gold-600)] text-sm font-bold tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
                    <Sparkles size={16} /> A Note from {profile.name ? profile.name.split(' ')[0] : "Me"} <Sparkles size={16} />
                  </h4>
                  <p className="text-[var(--color-gold-900)] italic leading-relaxed text-xl md:text-2xl max-w-3xl mx-auto">
                    "{profile.personalNote}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
