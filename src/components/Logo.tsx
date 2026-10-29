import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Icon: Open Book + AI Brain Nodes + Knowledge Star */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-2 shadow-md border border-slate-700/40 flex items-center justify-center overflow-hidden shrink-0 group`}>
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-radial from-rose-500/20 via-transparent to-transparent pointer-events-none" />

        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Open Book Base */}
          <path
            d="M6 36C10 33 18 33 24 36C30 33 38 33 42 36V14C38 11 30 11 24 14C18 11 10 11 6 14V36Z"
            stroke="#F8FAFC"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Spine */}
          <path d="M24 14V36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

          {/* AI Neural Circuit/Brain arches above book */}
          <path
            d="M17 18C15 15 17 10 24 9C31 10 33 15 31 18"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeDasharray="2 2"
          />
          <circle cx="17" cy="18" r="2" fill="#F43F5E" />
          <circle cx="31" cy="18" r="2" fill="#F43F5E" />

          {/* Star of Knowledge at the Apex */}
          <path
            d="M24 4L25.2 7.2L28.5 8.2L26 10.4L26.7 13.8L24 12L21.3 13.8L22 10.4L19.5 8.2L22.8 7.2L24 4Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-['Be_Vietnam_Pro']`}>
            VY EDU AI
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
            PRO 2018
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Trợ lý giảng dạy thông minh THPT
          </span>
        )}
      </div>
    </div>
  );
};
