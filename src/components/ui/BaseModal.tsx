import React from 'react';
import { X } from 'lucide-react';

export interface BaseModalProps {
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({ onClose, title, icon, children, maxWidth = "max-w-2xl" }) => {
  return (
    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-6 pointer-events-auto animate-in fade-in duration-200">
      <div className={`bg-white/90 backdrop-blur-xl w-full ${maxWidth} rounded-[2rem] shadow-2xl border border-white flex flex-col overflow-hidden p-8`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#9D8189] flex items-center gap-3">
            {icon} {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-[#FFADAD]/20 text-[#FFADAD] rounded-xl hover:bg-[#FFADAD]/40 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
