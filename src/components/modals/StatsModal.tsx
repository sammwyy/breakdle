import React from 'react';
import { BarChart2, Zap, Layers, Circle, FastForward } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';
import { StatCard } from '../ui/StatCard';
import { BubbleIcon } from '../ui/BubbleIcon';
import { state } from '../../game/state';
import { t } from '../../i18n';

interface StatsModalProps {
  onClose: () => void;
  language: string;
  formatNumber: (num: number) => string;
}

export const StatsModal: React.FC<StatsModalProps> = ({ onClose, language, formatNumber }) => {
  return (
    <BaseModal
      title={t('stats', language as any)}
      icon={<BarChart2 size={32} />}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label={t('stat_total_gold_earned', language as any)}
          value={formatNumber(state.stats.totalGoldEarned)}
          icon={<BubbleIcon size={24} />}
          color="bg-[#FFD6A5]"
        />
        <StatCard
          label={t('stat_total_gold_spent', language as any)}
          value={formatNumber(state.stats.totalGoldSpent)}
          icon={<BubbleIcon size={24} />}
          color="bg-[#FFADAD]"
        />
        <StatCard
          label={t('stat_peak_pps', language as any)}
          value={formatNumber(state.stats.peakPps)}
          icon={<Zap size={24} />}
          color="bg-[#9BF6FF]"
        />
        <StatCard
          label={t('stat_blocks_destroyed', language as any)}
          value={state.stats.blocksDestroyed}
          icon={<Layers size={24} />}
          color="bg-[#CAFFBF]"
        />
        <StatCard
          label={t('stat_balls_spawned', language as any)}
          value={state.stats.ballsSpawned}
          icon={<Circle size={24} />}
          color="bg-[#A0C4FF]"
        />
        <StatCard
          label={t('stat_arenas_completed', language as any)}
          value={state.stats.arenasCompleted}
          icon={<FastForward size={24} />}
          color="bg-[#FFC6FF]"
        />
      </div>
    </BaseModal>
  );
};
