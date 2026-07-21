"use client";

import { useState } from "react";
import { User, ChevronRight, Edit2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateClientNickname } from "@/actions/client";

export default function ClientCard({ client }: { client: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(client.profile?.nickname || "");
  const [isSaving, setIsSaving] = useState(false);
  const [displayedNickname, setDisplayedNickname] = useState(client.profile?.nickname || "");

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on edit controls, don't navigate
    if ((e.target as Element).closest('.nickname-controls')) {
      return;
    }
    router.push(`/therapists/clients/${client.id}`);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaving(true);
    const result = await updateClientNickname(client.id, nickname);
    setIsSaving(false);
    
    if (result.success) {
      setDisplayedNickname(nickname);
      setIsEditing(false);
    } else {
      alert("Failed to update nickname: " + result.error);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNickname(displayedNickname);
    setIsEditing(false);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white p-6 rounded-3xl border border-[var(--color-gold-200)] shadow-sm hover:shadow-md transition-all group flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[var(--color-gold-50)] rounded-full flex items-center justify-center text-[var(--color-gold-600)] shrink-0 group-hover:scale-105 transition-transform">
          <User size={32} />
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex items-center justify-between gap-2">
            {isEditing ? (
              <div className="nickname-controls flex items-center gap-2 w-full">
                <input 
                  autoFocus
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full text-sm font-heading border-b border-[var(--color-gold-400)] focus:outline-none bg-transparent"
                  placeholder="Set Nickname"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(e as any);
                    if (e.key === 'Escape') handleCancel(e as any);
                  }}
                />
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="text-green-600 hover:bg-green-50 p-1 rounded transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 max-w-full">
                <h3 className="text-lg font-heading text-[var(--color-gold-900)] truncate">
                  {displayedNickname ? displayedNickname : client.name}
                </h3>
                {displayedNickname && (
                  <span className="text-xs text-[var(--color-gold-500)] shrink-0 bg-[var(--color-gold-50)] px-2 py-0.5 rounded-full">
                    {client.name}
                  </span>
                )}
                <button 
                  className="nickname-controls text-[var(--color-gold-400)] hover:text-[var(--color-gold-700)] opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  title="Set Nickname"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
          {client.email && (
            <p className="text-sm text-[var(--color-gold-600)] truncate mt-0.5">{client.email}</p>
          )}
        </div>
      </div>
      <div className="mt-2 pt-4 border-t border-[var(--color-gold-100)] flex justify-between items-center text-sm font-medium text-[var(--color-gold-700)] group-hover:text-[var(--color-gold-900)]">
        View Sessions
        <ChevronRight size={18} className="text-[var(--color-gold-400)] group-hover:text-[var(--color-gold-600)] transition-colors" />
      </div>
    </div>
  );
}
