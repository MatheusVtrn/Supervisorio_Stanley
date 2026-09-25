import React, { useState, useEffect } from 'react';
import { Clock, Radio, User, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { ShiftInfo } from '../types/scada';

interface HeaderProps {
  currentShift: ShiftInfo;
  onOpenImageLinks: () => void;
  onToggleLogin: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentShift,
  onOpenImageLinks,
  onToggleLogin,
  isOnline,
  onToggleOnline,
}) => {
  const [localTime, setLocalTime] = useState('');
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format with milliseconds e.g. 10:42:18.420
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setLocalTime(`${hours}:${mins}:${secs}.${ms}`);

      // UTC time
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${utcHours}:${utcMins}:${utcSecs}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white border-b border-[#e2e8f0] px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none text-xs">
      {/* Brand lockup */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {/* Stanley Wordmark / SCADA Icon */}
          <div className="flex items-center gap-1.5">
            <span className="bg-[#ea580c] text-white font-extrabold px-1.5 py-0.5 tracking-tighter text-sm uppercase rounded-[2px] font-sans">
              Stanley
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#64748b] uppercase leading-tight">
                Supervisório
              </div>
              <div className="text-xs font-black tracking-tight text-[#0f172a] uppercase leading-none">
                SCADA OS
              </div>
            </div>
          </div>

          {/* Mechanical Arm SCADA Icon */}
          <div className="ml-1 text-[#ea580c] flex items-center" title="Controlador Robótico SCADA RT-01">
            <svg
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="2" />
              <circle cx="6" cy="19" r="2" />
              <path d="m14 7-6 6" />
              <path d="M12 19h6" />
              <path d="m9 11 5 5" />
            </svg>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#e2e8f0] hidden md:block" />

        {/* Status indicator: ONLINE */}
        <button
          onClick={onToggleOnline}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-mono text-[11px] font-semibold transition-colors border ${
            isOnline
              ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0] hover:bg-[#dcfce7]'
              : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca] hover:bg-[#fee2e2]'
          }`}
          title="Clique para alternar conexão CLP"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'
            }`}
          />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE CLP'}</span>
        </button>

        {/* Turno badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#fffbeb] text-[#b45309] border border-[#fde68a] px-2.5 py-1 rounded-[3px] font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-[#d97706]" />
          <span className="font-semibold uppercase tracking-tight">
            {currentShift.name}: {currentShift.code} [{currentShift.timeRange}]
          </span>
        </div>
      </div>

      {/* Right: Clock + Operator badge + Reference buttons */}
      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        {/* Real-time SCADA Clock */}
        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded-[3px]">
          <div className="flex items-center gap-1">
            <span className="text-[#64748b] text-[10px] uppercase font-sans font-semibold">LOCAL</span>
            <span className="font-bold text-[#0f172a] tabular-nums">{localTime || '10:42:18.420'}</span>
          </div>
          <div className="w-px h-3 bg-[#cbd5e1]" />
          <div className="flex items-center gap-1 text-[#64748b]">
            <span className="text-[10px] uppercase font-sans">UTC</span>
            <span className="tabular-nums">{utcTime || '13:42:18'}</span>
          </div>
        </div>

        {/* Operator Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] px-2.5 py-1 rounded-[3px] text-[11px]">
          <span className="text-[#334155] font-medium hidden sm:inline">
            Operador {currentShift.operatorRole}
          </span>
          <span className="bg-[#ea580c] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider">
            NÍVEL {currentShift.operatorLevel}
          </span>
          <span className="font-mono text-[#64748b] text-[10px] hidden md:inline">
            Reg. {currentShift.operatorBadge}
          </span>
        </div>

        {/* Direct Image Links & Reference Modal Trigger */}
        <button
          onClick={onOpenImageLinks}
          className="flex items-center gap-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] border border-[#cbdbf5] px-2.5 py-1 rounded-[3px] font-sans font-semibold text-[11px] transition-colors"
          title="Ver Links Diretos das Imagens / HTML e Informações Técnicas"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Links Imagens HTML</span>
        </button>

        {/* Quick switch to login button for operator convenience */}
        <button
          onClick={onToggleLogin}
          className="text-[#64748b] hover:text-[#0f172a] p-1 border border-[#e2e8f0] rounded-[3px] hover:bg-[#f1f5f9] transition-colors"
          title="Alternar Tela de Login / Trocar Usuário"
        >
          <User className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
