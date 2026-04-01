import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border border-white/50 shadow-sm ${color}/30`}>
      <div className={`p-3 rounded-xl ${color} text-[#9D8189] shadow-sm`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-[#9D8189]/70">{label}</div>
        <div className="text-2xl font-bold text-[#9D8189]">{value}</div>
      </div>
    </div>
  );
};
