import React, { useState } from 'react';
import { Store, X, ArrowUpCircle, HelpCircle } from 'lucide-react';
import { BubbleIcon } from '../ui/BubbleIcon';
import { SKILLS } from '../../game/skills';
import { formatNumber } from '../../utils/format';
import { t } from '../../i18n';

interface ShopModalProps {
  onClose: () => void;
  language: string;
  gold: number;
  skills: Record<string, number>;
  handleUpgrade: (skillId: string) => void;
}

const getCategoryStyles = (category: string, isSelected: boolean, canAfford: boolean, isMax: boolean) => {
  const baseOpacity = (!canAfford && !isMax) ? 'opacity-50 hover:opacity-75' : '';

  if (category === 'ball') {
    return `${baseOpacity} ${isSelected ? 'bg-[#A0C4FF] border-[#8AB4F8] text-white' : 'bg-[#A0C4FF]/20 border-[#A0C4FF]/50 text-[#7A9EDC] hover:bg-[#A0C4FF]/40'}`;
  }
  if (category === 'paddle') {
    return `${baseOpacity} ${isSelected ? 'bg-[#CAFFBF] border-[#A8E89D] text-[#5A9A50]' : 'bg-[#CAFFBF]/30 border-[#CAFFBF]/60 text-[#7BBA70] hover:bg-[#CAFFBF]/50'}`;
  }
  if (category === 'arena') {
    return `${baseOpacity} ${isSelected ? 'bg-[#FFC6FF] border-[#E8A8E8] text-[#A86BA8]' : 'bg-[#FFC6FF]/30 border-[#FFC6FF]/60 text-[#B87BB8] hover:bg-[#FFC6FF]/50'}`;
  }
  return '';
};

export const ShopModal: React.FC<ShopModalProps> = ({ onClose, language, gold, skills, handleUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'ball' | 'paddle' | 'arena'>('ball');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-6 pointer-events-auto animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl border border-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#9D8189]/10">
          <h2 className="text-3xl font-bold text-[#9D8189] flex items-center gap-3">
            <Store size={32} /> {t('upgrades', language as any)}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-[#9D8189] flex items-center gap-2 bg-white/50 px-4 py-2 rounded-2xl">
              <BubbleIcon size={24} className="text-[#FFD6A5]" /> {formatNumber(gold)}
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-[#FFADAD]/20 text-[#FFADAD] rounded-xl hover:bg-[#FFADAD]/40 transition-colors"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left List */}
          <div className="w-1/2 border-r border-[#9D8189]/10 flex flex-col">
            {/* Tabs */}
            <div className="flex p-4 gap-2 border-b border-[#9D8189]/10 shrink-0">
              {(['ball', 'paddle', 'arena'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm capitalize transition-colors ${activeTab === tab ? 'bg-[#FFC6FF] text-[#9D8189]' : 'bg-white/50 text-[#9D8189]/60 hover:bg-white/80'}`}
                >
                  {t(tab, language as any)}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-2 content-start" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFC6FF transparent' }}>
              {SKILLS.filter(s => s.category === activeTab).map(skill => {
                const currentLevel = skills[skill.id] ?? 0;
                const cost = skill.cost(currentLevel);
                const isMax = currentLevel >= skill.maxLevel;
                const canAfford = gold >= cost;
                const isSelected = selectedSkillId === skill.id;
                const Icon = skill.icon || HelpCircle;
                const isLocked = skill.requires ? (skills[skill.requires] ?? 0) < 1 : false;

                if (isLocked) return null;

                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all text-center border-2 ${getCategoryStyles(skill.category, isSelected, canAfford, isMax)}`}
                  >
                    <Icon size={24} className="mb-1.5" />
                    <div className="font-bold text-xs leading-tight mb-1">{t(skill.nameKey, language as any)}</div>
                    <div className="text-[10px] font-semibold mb-1.5 opacity-80">{t('level', language as any)} {currentLevel}{isMax ? ` (${t('shop_max_level', language as any)})` : ''}</div>
                    {!isMax && (
                      <div className={`text-[10px] font-bold flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded-md ${canAfford ? 'text-current' : 'text-[#FFADAD]'}`}>
                        <BubbleIcon size={12} className={canAfford ? "text-current" : "text-[#FFADAD]"} /> {formatNumber(cost)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Details */}
          <div className="w-1/2 p-8 flex flex-col bg-white/30">
            {selectedSkillId ? (() => {
              const skill = SKILLS.find(s => s.id === selectedSkillId)!;
              const currentLevel = skills[skill.id] ?? 0;
              const isMax = currentLevel >= skill.maxLevel;
              const cost = skill.cost(currentLevel);
              const canAfford = gold >= cost;
              const isLocked = skill.requires ? (skills[skill.requires] ?? 0) < 1 : false;

              if (isLocked) {
                const reqSkill = SKILLS.find(s => s.id === skill.requires);
                return (
                  <div className="flex-1 flex items-center justify-center text-[#9D8189]/40 font-bold text-xl text-center px-8">
                    {t('shop_unlock_first', language as any, { name: reqSkill ? t(reqSkill.nameKey, language as any) : skill.requires })}
                  </div>
                );
              }

              return (
                <>
                  <h3 className="text-4xl font-bold text-[#9D8189] mb-2">{t(skill.nameKey, language as any)}</h3>
                  <div className="inline-block bg-white/60 px-3 py-1 rounded-lg text-[#9D8189]/70 font-bold text-sm mb-6 w-fit">
                    {t('level', language as any)} {currentLevel} / {skill.maxLevel}
                  </div>

                  <p className="text-xl text-[#9D8189]/80 mb-8 leading-relaxed">
                    {t(skill.descriptionKey, language as any)}
                  </p>

                  <div className="bg-white/50 rounded-2xl p-6 mb-auto border border-white">
                    <div className="text-sm font-bold text-[#9D8189]/60 uppercase tracking-wider mb-2">{t('shop_current_bonus', language as any)}</div>
                    <div className="text-2xl font-bold text-[#9D8189] mb-4">{currentLevel === 0 ? t('shop_none', language as any) : skill.bonusLabel(currentLevel, language as any)}</div>

                    {!isMax && (
                      <>
                        <div className="text-sm font-bold text-[#9D8189]/60 uppercase tracking-wider mb-2">{t('shop_next_level', language as any)}</div>
                        <div className="text-2xl font-bold text-[#A0C4FF]">{skill.bonusLabel(currentLevel + 1, language as any)}</div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpgrade(skill.id)}
                    disabled={isMax || !canAfford}
                    className={`w-full py-5 rounded-2xl font-bold text-2xl flex items-center justify-center gap-3 transition-all ${isMax ? 'bg-white/50 text-[#9D8189]/40 cursor-not-allowed border border-white' : canAfford ? 'bg-[#CAFFBF] text-[#9D8189] hover:bg-[#B4F8A8] active:scale-95 shadow-sm border border-white' : 'bg-[#FFADAD]/30 text-[#9D8189]/50 cursor-not-allowed border border-white'}`}
                  >
                    {isMax ? (
                      t('shop_max_level', language as any)
                    ) : (
                      <>
                        <ArrowUpCircle size={28} />
                        {currentLevel === 0 ? t('shop_buy_for', language as any) : t('shop_upgrade_for', language as any)} <BubbleIcon size={24} className="text-[#FFD6A5] drop-shadow-sm" /> {formatNumber(cost)}
                      </>
                    )}
                  </button>
                </>
              );
            })() : (
              <div className="flex-1 flex items-center justify-center text-[#9D8189]/40 font-bold text-xl">
                {t('shop_select_upgrade', language as any)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
