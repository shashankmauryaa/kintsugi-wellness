"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { saveSessionNote } from "@/actions/booking";

export default function PortalDashboard({ initialBookings, profileData }: { initialBookings: any[], profileData: any }) {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  
  const [selectedUpcoming, setSelectedUpcoming] = useState<any | null>(null);
  const [selectedPast, setSelectedPast] = useState<any | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update 'now' every minute to dynamically shift sessions from upcoming to past
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Compute partitions based on current 'now'
  const upcomingBookings = initialBookings.filter((b) => b.endTime > now).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const pastBookings = initialBookings.filter((b) => b.endTime <= now).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  const handleOpenPastModal = (session: any) => {
    setSelectedPast(session);
    setNoteContent(session.note || "");
    setNoteSaved(false);
  };

  const handleSaveNote = async () => {
    if (!selectedPast) return;
    setIsSavingNote(true);
    setNoteSaved(false);
    
    const result = await saveSessionNote(selectedPast.id, noteContent);
    setIsSavingNote(false);
    
    if (result.success) {
      setNoteSaved(true);
      // Mutate initialBookings locally so it reflects without page reload
      const sessionIndex = initialBookings.findIndex(b => b.id === selectedPast.id);
      if (sessionIndex !== -1) {
        initialBookings[sessionIndex].note = noteContent;
      }
      setTimeout(() => {
        setNoteSaved(false);
        setSelectedPast(null);
      }, 1500);
    } else {
      alert("Failed to save note: " + result.error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-heading text-[var(--color-gold-900)] mb-8">Dashboard</h1>

      {!profileData?.hasActiveConsent && (
        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading text-yellow-900 mb-1">Action Required: Complete Consent Form</h3>
            <p className="text-yellow-800">You must complete the mandatory consent form before you can book a session.</p>
          </div>
          <Link href="/consent-form" className="px-6 py-2 bg-yellow-600 text-white rounded-full font-medium whitespace-nowrap hover:bg-yellow-700 transition-colors">
            Complete Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[var(--color-gold-200)] shadow-sm flex flex-col h-[500px]">
          <h2 className="text-xl font-heading text-[var(--color-gold-900)] mb-6 flex items-center gap-3">
            <Calendar size={24} className="text-[var(--color-gold-500)]" /> Upcoming Sessions
          </h2>
          {upcomingBookings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--color-gold-600)]">
              <div className="w-16 h-16 bg-[var(--color-gold-50)] rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-[var(--color-gold-400)]" />
              </div>
              <p>No upcoming sessions scheduled.</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {upcomingBookings.map((session, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedUpcoming(session)}
                  className="p-5 border border-[var(--color-gold-200)] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--color-gold-50)] hover:bg-[var(--color-gold-100)] cursor-pointer transition-colors shadow-[0_2px_10px_rgb(0,0,0,0.02)] gap-4"
                >
                  <div>
                    <div className="font-medium text-[var(--color-gold-900)] text-lg mb-1">
                      {session.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-[var(--color-gold-700)] flex items-center gap-2">
                      <Clock size={14} />
                      {session.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {session.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full shadow-sm shrink-0">
                    Confirmed
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/book" className="block w-full text-center py-4 bg-white border border-[var(--color-gold-200)] text-[var(--color-gold-800)] rounded-2xl font-medium hover:bg-[var(--color-gold-50)] hover:text-[var(--color-gold-900)] transition-all shadow-sm hover:shadow-md mt-6 shrink-0">
            Book a New Session
          </Link>
        </div>

        {/* Past Sessions */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[var(--color-gold-200)] shadow-sm flex flex-col h-[500px]">
          <h2 className="text-xl font-heading text-[var(--color-gold-900)] mb-6 flex items-center gap-3">
            <Clock size={24} className="text-[var(--color-gold-500)]" /> Past Sessions
          </h2>
          {pastBookings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--color-gold-600)]">
              <div className="w-16 h-16 bg-[var(--color-gold-50)] rounded-full flex items-center justify-center mb-4 opacity-50">
                <Clock size={24} className="text-[var(--color-gold-400)]" />
              </div>
              <p>No past sessions recorded.</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {pastBookings.map((session, i) => (
                <div 
                  key={i} 
                  onClick={() => handleOpenPastModal(session)}
                  className="p-5 border border-[var(--color-gold-100)] rounded-2xl flex justify-between items-center bg-white hover:bg-[var(--color-gold-50)] cursor-pointer transition-colors shadow-sm group"
                >
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="font-medium text-[var(--color-gold-900)] text-lg mb-1">
                      {session.startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-[var(--color-gold-700)] flex items-center gap-2">
                      <Clock size={14} />
                      {session.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-[var(--color-gold-600)] font-medium">
                      Completed
                    </div>
                    {session.note && (
                      <div className="text-xs text-[var(--color-gold-500)] bg-[var(--color-gold-50)] px-2 py-1 rounded-md">
                        Note added
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {mounted && selectedUpcoming && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setSelectedUpcoming(null)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors z-10"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6">Session Details</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-[var(--color-gold-50)] rounded-2xl border border-[var(--color-gold-200)]">
                <p className="text-xs text-[var(--color-gold-600)] uppercase tracking-wider font-bold mb-1">Date</p>
                <p className="text-lg text-[var(--color-gold-900)] font-medium">
                  {selectedUpcoming.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="p-4 bg-[var(--color-gold-50)] rounded-2xl border border-[var(--color-gold-200)] flex justify-between items-center">
                <div>
                  <p className="text-xs text-[var(--color-gold-600)] uppercase tracking-wider font-bold mb-1">Time</p>
                  <p className="text-lg text-[var(--color-gold-900)] font-medium">
                    {selectedUpcoming.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {selectedUpcoming.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full shadow-sm">
                  Confirmed
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {mounted && selectedPast && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-[var(--color-gold-200)] flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedPast(null)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors z-10"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-2 shrink-0">Session Note</h2>
            <p className="text-sm text-[var(--color-gold-600)] mb-6 shrink-0">
              {selectedPast.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {selectedPast.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
            
            <div className="flex-1 flex flex-col min-h-0">
              <label className="text-sm font-medium text-[var(--color-gold-800)] mb-2 block shrink-0">Your private notes about this session</label>
              <textarea 
                className="w-full flex-1 min-h-[150px] p-4 rounded-2xl border border-[var(--color-gold-200)] bg-[var(--color-gold-50)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none resize-none text-[var(--color-gold-900)] placeholder:text-[var(--color-gold-400)]"
                placeholder="Write down any thoughts, reflections, or homework from this session..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>
            
            <div className="mt-6 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedPast(null)}
                className="px-6 py-2.5 text-[var(--color-gold-700)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors"
                disabled={isSavingNote}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="px-6 py-2.5 bg-[var(--color-gold-700)] hover:bg-[var(--color-gold-800)] text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSavingNote ? (
                  <><Loader2 size={18} className="animate-spin" /> Saving...</>
                ) : noteSaved ? (
                  "Saved!"
                ) : (
                  "Save Note"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
