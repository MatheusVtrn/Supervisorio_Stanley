import React from 'react';
import {
  LayoutGrid,
  BarChart3,
  Users,
  Database,
  Printer,
  SlidersHorizontal,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ScreenId } from '../types/scada';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onLogout: () => void;
  isInterlockSecure?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  onLogout,
  isInterlockSecure = true,
}) => {
  const menuItems: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Menu Principal / Home',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'oee',
      label: 'Dashboards & OEE',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'users',
      label: 'Gestão de Usuários',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'history',
      label: 'Consulta BD / Histórico',
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Imprimir Relatórios',
      icon: <Printer className="w-4 h-4" />,
    },
    {
      id: 'plc_config',
      label: 'Configurações CLP',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <span className="text-[11px] font-bold tracking-wider text-[#64748b] uppercase font-sans">
            Navegação Principal
          </span>
          <span className="font-mono text-[10px] font-semibold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-1.5 py-0.5 rounded-[2px]">
            RT-01
          </span>
        </div>

        {/* Menu Items List */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#ea580c] text-white font-semibold shadow-sm'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#64748b]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-[#e2e8f0] space-y-2 bg-[#f8fafc]">
        {/* Interlock Host */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-white border border-[#e2e8f0] rounded-[3px] text-[11px]">
          <div className="flex items-center gap-1.5 text-[#64748b] font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
            <span className="text-[10px] uppercase font-semibold">Interlock Host</span>
          </div>
          <span
            className={`font-mono font-bold text-[10px] tracking-wider ${
              isInterlockSecure ? 'text-[#16a34a]' : 'text-[#dc2626]'
            }`}
          >
            {isInterlockSecure ? 'SEGURO' : 'ALERTA'}
          </span>
        </div>

        {/* Encerrar Sessão (Logoff) */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-[#fef2f2] text-[#64748b] hover:text-[#dc2626] border border-[#e2e8f0] hover:border-[#fecaca] rounded-[3px] text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};
