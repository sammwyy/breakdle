import React from 'react';
import { t } from '../../i18n';

interface ResetConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  language: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onClose, onConfirm, language }) => {
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 pointer-events-auto">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white flex flex-col gap-6 animate-in zoom-in duration-200">
        <div className="flex flex-col gap-2 text-center">
          <h3 className="text-2xl font-bold text-[#9D8189]">{t('data_confirm_title', language as any)}</h3>
          <p className="text-[#9D8189]/70">{t('data_confirm_desc', language as any)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#9D8189]/10 text-[#9D8189] rounded-xl font-bold hover:bg-[#9D8189]/20 transition-all"
          >
            {t('data_confirm_no', language as any)}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#FFADAD] text-white rounded-xl font-bold hover:bg-[#FFADAD]/80 transition-all shadow-sm"
          >
            {t('data_confirm_yes', language as any)}
          </button>
        </div>
      </div>
    </div>
  );
};
