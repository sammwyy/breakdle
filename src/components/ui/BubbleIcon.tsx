import React from 'react';

interface BubbleIconProps {
  size?: number;
  className?: string;
}

export const BubbleIcon: React.FC<BubbleIconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" />
    <path d="M 16 8 A 4 4 0 0 0 12 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
