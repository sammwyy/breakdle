import React from 'react';
import { Store, BarChart2 } from 'lucide-react';
import { t } from '../../i18n';

interface SideButtonsProps {
  onOpenShop: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  language: string;
}

export const SideButtons: React.FC<SideButtonsProps> = ({
  onOpenShop,
  onOpenStats,
  onOpenSettings,
  language
}) => {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 items-end pointer-events-auto">
      <button
        onClick={onOpenShop}
        className="group flex flex-row-reverse items-center justify-start bg-[#CAFFBF] text-[#9D8189] rounded-full p-4 shadow-sm border border-white/80 hover:bg-[#B4F8A8] transition-all duration-300 w-[60px] hover:w-[160px] overflow-hidden"
      >
        <Store size={26} className="shrink-0" />
        <span className="mr-3 font-bold text-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{t('upgrades', language as any)}</span>
      </button>

      <button
        onClick={onOpenStats}
        className="group flex flex-row-reverse items-center justify-start bg-[#FFD6A5] text-[#9D8189] rounded-full p-4 shadow-sm border border-white/80 hover:bg-[#FFC285] transition-all duration-300 w-[60px] hover:w-[130px] overflow-hidden"
      >
        <BarChart2 size={26} className="shrink-0" />
        <span className="mr-3 font-bold text-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{t('stats', language as any)}</span>
      </button>

      <button
        onClick={onOpenSettings}
        className="group flex flex-row-reverse items-center justify-start bg-[#A0C4FF] text-[#9D8189] rounded-full p-4 shadow-sm border border-white/80 hover:bg-[#8AB4F8] transition-all duration-300 w-[60px] hover:w-[150px] overflow-hidden"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        <span className="mr-3 font-bold text-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{t('settings', language as any)}</span>
      </button>
    </div>
  );
};
