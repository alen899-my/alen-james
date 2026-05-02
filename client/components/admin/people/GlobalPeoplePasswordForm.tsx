'use client';

import { useState } from 'react';
import { updateGlobalPeoplePasswordAction } from '@/lib/admin/actions/people.actions';
import { Lock, Save, Edit2, Loader2, X } from 'lucide-react';

interface Props {
  initialPassword: string | null;
}

export default function GlobalPeoplePasswordForm({ initialPassword }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState(initialPassword || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    const res = await updateGlobalPeoplePasswordAction(password);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsEditing(false);
    } else {
      alert(res.error || 'Failed to update global password');
    }
  };

  const handleCancel = () => {
    setPassword(initialPassword || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl">
        <Lock size={14} className="text-[#1084a2]" />
        
        {isEditing ? (
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter global password..."
            className="bg-transparent border-none text-sm font-medium text-[#1a1a1a] focus:outline-none w-48"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <span className="text-sm font-medium text-[#1a1a1a]">
            {initialPassword ? 'Global Password Set' : 'No Global Password'}
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="p-1.5 bg-[#1084a2] text-white rounded-lg hover:bg-[#1a9bbf] transition-colors disabled:opacity-50"
            title="Save Password"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-1.5 bg-white text-[#8b9aaa] border border-[#e8e2d5] rounded-lg hover:bg-[#faf7f0] transition-colors disabled:opacity-50"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
          title="Edit Global Password"
        >
          <Edit2 size={14} />
        </button>
      )}
    </div>
  );
}
