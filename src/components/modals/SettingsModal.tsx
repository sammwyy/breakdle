import React, { useState } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { BaseModal } from '../ui/BaseModal';
import { state } from '../../game/state';
import { audio } from '../../game/audio';
import { t } from '../../i18n';

interface SettingsModalProps {
  onClose: () => void;
  onResetData: () => void;
  language: string;
  setLanguage: (lang: any) => void;
  volumes: any;
  handleVolumeChange: (key: string, value: number) => void;
  pauseOnMenu: boolean;
  setPauseOnMenu: (val: boolean) => void;
  showFps: boolean;
  setShowFps: (val: boolean) => void;
  version: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onResetData,
  language,
  setLanguage,
  volumes,
  handleVolumeChange,
  pauseOnMenu,
  setPauseOnMenu,
  showFps,
  setShowFps,
  version
}) => {
  const [settingsTab, setSettingsTab] = useState<'sounds' | 'gameplay' | 'data' | 'about'>('sounds');

  return (
    <BaseModal
      title={t('settings', language as any)}
      icon={<SettingsIcon size={32} />}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="flex gap-2 mb-6">
        {(['sounds', 'gameplay', 'data', 'about'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSettingsTab(tab)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${settingsTab === tab ? 'bg-[#FFC6FF] text-[#9D8189]' : 'bg-white/50 text-[#9D8189]/50 hover:bg-white/80'}`}
          >
            {t(`tab_${tab}`, language as any)}
          </button>
        ))}
      </div>

      {settingsTab === 'sounds' && (
        <div className="flex flex-col gap-4">
          <Slider label={t('setting_bgm', language as any)} value={Math.round(volumes.bgm * 100)} min={0} max={100} onChange={(v) => handleVolumeChange('bgm', v / 100)} />
          <Slider label={t('setting_hit_block', language as any)} value={Math.round(volumes.hitBlock * 100)} min={0} max={100} onChange={(v) => handleVolumeChange('hitBlock', v / 100)} />
          <Slider label={t('setting_hit_paddle', language as any)} value={Math.round(volumes.hitPaddle * 100)} min={0} max={100} onChange={(v) => handleVolumeChange('hitPaddle', v / 100)} />
          <Slider label={t('setting_arena_clear', language as any)} value={Math.round(volumes.arenaClear * 100)} min={0} max={100} onChange={(v) => handleVolumeChange('arenaClear', v / 100)} />
          <Slider label={t('setting_arena_reset', language as any)} value={Math.round(volumes.arenaReset * 100)} min={0} max={100} onChange={(v) => handleVolumeChange('arenaReset', v / 100)} />
        </div>
      )}

      {settingsTab === 'gameplay' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#9D8189]">{t('setting_pause_on_menu', language as any)}</span>
              <span className="text-[10px] text-[#9D8189]/60">{t('setting_pause_on_menu_desc', language as any)}</span>
            </div>
            <button
              onClick={() => {
                const newVal = !pauseOnMenu;
                setPauseOnMenu(newVal);
                state.settings.pauseOnMenu = newVal;
                state.save();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${pauseOnMenu ? 'bg-[#CAFFBF]' : 'bg-[#9D8189]/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pauseOnMenu ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#9D8189]">{t('setting_language', language as any)}</span>
            </div>
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value as 'en' | 'es';
                setLanguage(newLang);
                state.settings.language = newLang;
                state.save();
              }}
              className="bg-white/50 text-[#9D8189] font-bold text-sm px-3 py-1 rounded-xl border border-[#9D8189]/20 outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#9D8189]">{t('setting_show_fps', language as any)}</span>
              <span className="text-[10px] text-[#9D8189]/60">{t('setting_show_fps_desc', language as any)}</span>
            </div>
            <button
              onClick={() => {
                const newVal = !showFps;
                setShowFps(newVal);
                state.settings.showFps = newVal;
                state.save();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${showFps ? 'bg-[#CAFFBF]' : 'bg-[#9D8189]/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${showFps ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      )}

      {settingsTab === 'data' && (
        <div className="flex flex-col gap-4">
          <p className="text-[#9D8189]/80 text-sm font-semibold text-center mb-4">
            {t('data_warning', language as any)}
          </p>
          <button
            onClick={onResetData}
            className="w-full py-4 bg-[#FFADAD] hover:bg-[#FF9393] text-white font-bold rounded-2xl shadow-sm transition-colors"
          >
            {t('data_delete_btn', language as any)}
          </button>
        </div>
      )}

      {settingsTab === 'about' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 p-4 bg-white/50 rounded-2xl border border-white/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#9D8189]/60">{t('about_author', language as any)}</span>
              <a href="https://twitter.com/sammwy" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#A0C4FF] hover:underline">@sammwy</a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#9D8189]/60">{t('about_source', language as any)}</span>
              <a href="https://github.com/sammwyy/breakdle" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#A0C4FF] hover:underline">GitHub</a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#9D8189]/60">{t('about_version', language as any)}</span>
              <span className="text-sm font-bold text-[#9D8189]">{version}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#9D8189]/60">{t('about_donations', language as any)}</span>
              <a href="https://patreon.com/sammwy" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#A0C4FF] hover:underline">Patreon</a>
            </div>
          </div>
          <p className="text-xs text-[#9D8189]/50 text-center italic">
            {t('about_thanks', language as any)}
          </p>
        </div>
      )}
    </BaseModal>
  );
};
