import { Circle, Zap, Layers, Timer, FastForward, Maximize2, Shield, HelpCircle, Target } from 'lucide-react';
import { state } from './state';
import { t, Language } from '../i18n';

export interface SkillContext {
  skillLevel: number;
  damage: number;
  random: (min: number, max: number) => number;
  randomBool: (percentage: number) => boolean;
  ballState: Record<string, any>;
  mustBounce: boolean;
  isGhost: boolean;
  blockImpactHP: number;
  mustBlockDestroy: () => boolean;
  explode: (radius: number, hp: number) => void;
}

export interface Skill {
  id: string;
  nameKey: string;
  descriptionKey: string;
  maxLevel: number;
  category: 'ball' | 'paddle' | 'arena';
  icon?: any;
  requires?: string;
  cost: (level: number) => number;
  bonusLabel: (level: number, lang?: Language) => string;
  onBallHit?: (ctx: SkillContext) => void;
}

export const SKILLS: Skill[] = [
  { 
    id: 'multiball', 
    nameKey: 'skill_multiball_name',
    descriptionKey: 'skill_multiball_desc',
    maxLevel: 50,
    category: 'ball',
    icon: Circle,
    cost: (lvl) => Math.floor(100 * Math.pow(1.4, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_multiball', lang, { val: lvl + 1 })
  },
  { 
    id: 'spikes', 
    nameKey: 'skill_spikes_name',
    descriptionKey: 'skill_spikes_desc',
    maxLevel: 999,
    category: 'ball',
    icon: Zap,
    cost: (lvl) => Math.floor(25 * Math.pow(1.12, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_spikes', lang, { val: 1 + lvl }),
    onBallHit: (ctx) => {
      ctx.damage = 1 + ctx.skillLevel;
    }
  },
  { 
    id: 'multipaddle', 
    nameKey: 'skill_multipaddle_name',
    descriptionKey: 'skill_multipaddle_desc',
    maxLevel: 10,
    category: 'paddle',
    icon: Layers,
    cost: (lvl) => Math.floor(500 * Math.pow(1.5, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_multipaddle', lang, { val: lvl })
  },
  { 
    id: 'fastRespawn', 
    nameKey: 'skill_fast_respawn_name',
    descriptionKey: 'skill_fast_respawn_desc',
    maxLevel: 9,
    category: 'ball',
    icon: Timer,
    cost: (lvl) => Math.floor(200 * Math.pow(1.3, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_fast_respawn', lang, { val: Math.max(0, 10 - lvl) })
  },
  { 
    id: 'fastTravel', 
    nameKey: 'skill_fast_travel_name',
    descriptionKey: 'skill_fast_travel_desc',
    maxLevel: 25,
    category: 'arena',
    icon: FastForward,
    cost: (lvl) => Math.floor(100 * Math.pow(1.2, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_fast_travel', lang, { val: Math.max(0, 30 - lvl) })
  },
  { 
    id: 'bigPaddles', 
    nameKey: 'skill_big_paddles_name',
    descriptionKey: 'skill_big_paddles_desc',
    maxLevel: 50,
    category: 'paddle',
    icon: Maximize2,
    cost: (lvl) => Math.floor(50 * Math.pow(1.18, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_big_paddles', lang, { val: 150 + lvl * 20 })
  },
  {
    id: 'fastBarrier',
    nameKey: 'skill_fast_barrier_name',
    descriptionKey: 'skill_fast_barrier_desc',
    maxLevel: 9,
    category: 'paddle',
    icon: Shield,
    cost: (lvl) => Math.floor(300 * Math.pow(1.4, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_fast_barrier', lang, { val: Math.max(0, 10 - lvl) })
  },
  {
    id: 'drill',
    nameKey: 'skill_drill_name',
    descriptionKey: 'skill_drill_desc',
    maxLevel: 100,
    category: 'ball',
    icon: Zap,
    cost: (lvl) => Math.floor(1000 * Math.pow(1.2, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_drill', lang, { val: lvl }),
    onBallHit: (ctx) => {
      if (ctx.skillLevel > 0 && ctx.mustBlockDestroy()) {
        if (ctx.randomBool(ctx.skillLevel / 100)) {
          ctx.mustBounce = false;
        }
      }
    }
  },
  {
    id: 'explosion',
    nameKey: 'skill_explosion_name',
    descriptionKey: 'skill_explosion_desc',
    maxLevel: 50,
    category: 'ball',
    icon: Target,
    cost: (lvl) => Math.floor(2000 * Math.pow(1.5, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_explosion', lang, { val: lvl }),
    onBallHit: (ctx) => {
      if (ctx.skillLevel > 0 && ctx.randomBool(ctx.skillLevel / 100)) {
        const novaLevel = state.skills['expl_nova'] ?? 0;
        const demoLevel = state.skills['expl_demolition'] ?? 0;
        
        const radius = 60 + (novaLevel * 10);
        const damage = 1 + demoLevel;
        
        ctx.explode(radius, damage);
      }
    }
  },
  {
    id: 'expl_nova',
    nameKey: 'skill_expl_nova_name',
    descriptionKey: 'skill_expl_nova_desc',
    maxLevel: 50,
    category: 'ball',
    icon: Maximize2,
    requires: 'explosion',
    cost: (lvl) => Math.floor(1000 * Math.pow(1.3, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_expl_nova', lang, { val: lvl * 10 })
  },
  {
    id: 'expl_demolition',
    nameKey: 'skill_expl_demolition_name',
    descriptionKey: 'skill_expl_demolition_desc',
    maxLevel: 50,
    category: 'ball',
    icon: Zap,
    requires: 'explosion',
    cost: (lvl) => Math.floor(1500 * Math.pow(1.3, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_expl_demolition', lang, { val: lvl })
  },
  {
    id: 'ghost_ball',
    nameKey: 'skill_ghost_ball_name',
    descriptionKey: 'skill_ghost_ball_desc',
    maxLevel: 50,
    category: 'ball',
    icon: Circle,
    cost: (lvl) => Math.floor(5000 * Math.pow(1.4, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_ghost_ball', lang, { val: lvl })
  },
  {
    id: 'gold_mastery',
    nameKey: 'skill_gold_mastery_name',
    descriptionKey: 'skill_gold_mastery_desc',
    maxLevel: 999,
    category: 'arena',
    icon: Target,
    cost: (lvl) => Math.floor(500 * Math.pow(1.2, lvl)),
    bonusLabel: (lvl, lang) => t('bonus_gold_mastery', lang, { val: lvl * 10 })
  }
];
