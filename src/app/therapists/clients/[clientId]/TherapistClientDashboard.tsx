"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, X, ChevronLeft, User, Phone, Mail, FileText } from "lucide-react";
import { createPortal } from "react-dom";
import { saveSessionNote } from "@/actions/booking";
import { format } from "date-fns";

export default function TherapistClientDashboard({ client, initialBookings }: { client: any, initialBookings: any[] }) {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);
  
  const [selectedPast, setSelectedPast] = useState<any | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const upcomingBookings = bookings.filter((b) => new Date(b.endTime) > now).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const pastBookings = bookings.filter((b) => new Date(b.endTime) <= now).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const handleOpenPastModal = (session: any) => {
    setSelectedPast(session);
    setNoteContent(session.therapistNote || "");
    setNoteSaved(false);
  };

  const handleSaveNote = async () => {
    if (!selectedPast) return;
    setIsSavingNote(true);
    setNoteSaved(false);
    
    // The server action now checks if we are the therapist and saves to therapistNote securely
    const result = await saveSessionNote(selectedPast.id, noteContent);
    setIsSavingNote(false);
    
    if (result.success) {
      setNoteSaved(true);
      const sessionIndex = bookings.findIndex(b => b.id === selectedPast.id);
      if (sessionIndex !== -1) {
        const newBookings = [...bookings];
        newBookings[sessionIndex] = { ...newBookings[sessionIndex], therapistNote: noteContent };
        setBookings(newBookings);
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
    <div className="flex-1 w-full bg-[var(--color-surface-200)] p-8 md:p-12 relative z-10 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/therapists/clients" className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[var(--color-gold-200)] text-[var(--color-gold-700)] hover:bg-[var(--color-gold-50)] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-3xl font-heading text-[var(--color-gold-900)]">Client Details</h1>
        </div>

        {/* Client Info Card */}
        <div className="bg-white p-8 rounded-3xl border border-[var(--color-gold-200)] shadow-sm flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-24 h-24 bg-[var(--color-gold-50)] rounded-full flex items-center justify-center text-[var(--color-gold-600)] shrink-0">
            <User size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-1">{client.name}</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              {client.email && (
                <div className="flex items-center gap-2 text-[var(--color-gold-700)]">
                  <Mail size={16} className="text-[var(--color-gold-400)]" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-[var(--color-gold-700)]">
                  <Phone size={16} className="text-[var(--color-gold-400)]" />
                  {client.phone}
                </div>
              )}
            </div>
            {client.age && client.gender && (
              <p className="text-sm text-[var(--color-gold-600)] mt-3 bg-[var(--color-gold-50)] inline-block px-3 py-1 rounded-full">
                {client.age} years old • {client.gender}
              </p>
            )}
          </div>
        </div>

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
                <p>No upcoming sessions scheduled with this client.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {upcomingBookings.map((session) => (
                  <div key={session.id} className="p-4 md:p-5 rounded-2xl border border-[var(--color-gold-200)] bg-[var(--color-gold-50)] hover:border-[var(--color-gold-400)] transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-[var(--color-gold-900)] text-lg">
                          {format(new Date(session.startTime), 'EEEE, MMMM d')}
                        </h4>
                        <div className="flex items-center gap-2 text-[var(--color-gold-700)] mt-1">
                          <Clock size={16} className="text-[var(--color-gold-500)]" />
                          <span>{format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Confirmed
                      </span>
                    </div>
                    {session.googleMeetLink && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-gold-200)]">
                        <a href={session.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium underline flex items-center gap-1">
                          Join Google Meet
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Sessions & Clinical Notes */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[var(--color-gold-200)] shadow-sm flex flex-col h-[500px]">
            <h2 className="text-xl font-heading text-[var(--color-gold-900)] mb-6 flex items-center gap-3">
              <Clock size={24} className="text-[var(--color-gold-500)]" /> Past Sessions
            </h2>
            {pastBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--color-gold-600)]">
                <div className="w-16 h-16 bg-[var(--color-gold-50)] rounded-full flex items-center justify-center mb-4">
                  <Clock size={24} className="text-[var(--color-gold-400)]" />
                </div>
                <p>No past sessions found.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {pastBookings.map((session) => (
                  <div key={session.id} className="p-4 md:p-5 rounded-2xl border border-[var(--color-gold-100)] bg-white hover:bg-[var(--color-gold-50)] transition-colors cursor-pointer group" onClick={() => handleOpenPastModal(session)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-[var(--color-gold-900)]">
                          {format(new Date(session.startTime), 'MMM d, yyyy')}
                        </h4>
                        <p className="text-sm text-[var(--color-gold-600)] mt-1">
                          {format(new Date(session.startTime), 'h:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {session.therapistNote && (
                          <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            <FileText size={12} /> Note Added
                          </span>
                        )}
                        <span className="text-[var(--color-gold-400)] group-hover:text-[var(--color-gold-600)] text-sm font-medium">
                          {session.therapistNote ? "Edit Note" : "Add Note"} &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mounted && selectedPast && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[var(--color-gold-100)]">
              <div>
                <h3 className="text-xl font-heading text-[var(--color-gold-900)]">Clinical Session Note</h3>
                <p className="text-sm text-[var(--color-gold-600)] mt-1">
                  {format(new Date(selectedPast.startTime), 'EEEE, MMMM d, yyyy • h:mm a')}
                </p>
                <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md inline-flex items-center border border-red-100 font-medium">
                  Privacy Notice: These notes are strictly private and cannot be seen by the client.
                </div>
              </div>
              <button 
                onClick={() => setSelectedPast(null)}
                className="w-10 h-10 bg-[var(--color-gold-50)] text-[var(--color-gold-600)] rounded-full flex items-center justify-center hover:bg-[var(--color-gold-100)] transition-colors self-start"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your clinical notes, observations, or next steps here..."
                className="w-full h-64 p-4 rounded-xl border border-[var(--color-gold-200)] focus:outline-none focus:border-[var(--color-gold-400)] focus:ring-1 focus:ring-[var(--color-gold-400)] transition-all resize-none bg-[var(--color-surface-100)]"
              />
            </div>
            
            <div className="p-6 border-t border-[var(--color-gold-100)] bg-[var(--color-gold-50)] flex justify-end">
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote || noteSaved}
                className="px-6 py-2.5 bg-[var(--color-gold-700)] text-white rounded-full font-medium hover:bg-[var(--color-gold-800)] transition-colors disabled:opacity-50 min-w-[120px]"
              >
                {noteSaved ? "Saved!" : isSavingNote ? "Saving..." : "Save Private Note"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
