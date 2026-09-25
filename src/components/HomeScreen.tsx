import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  BarChart3,
  Database,
  Printer,
  SlidersHorizontal,
  ArrowRight,
  LogOut,
  Image as ImageIcon,
  Download,
  Code,
} from 'lucide-react';
import { ScreenId, ShiftInfo } from '../types/scada';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentShift: ShiftInfo;
  onLogout: () => void;
  onOpenImageLinks: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  currentShift,
  onLogout,
  onOpenImageLinks,
}) => {
  const [clockTime, setClockTime] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setClockTime(`${hours}:${mins}:${secs} UTC-3`);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setCurrentDateStr(`${year}-${month}-${day}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const moduleCards = [
    {
      id: 'login' as ScreenId,
      telaTag: '[TELA 2]',
      title: 'Login / Autenticação de Operador',
      description:
        'Acesso seguro de operadores e supervisores com controle de sessão ativa e rastreabilidade total.',
      icon: <ShieldCheck className="w-5 h-5 text-[#ea580c]" />,
      footerLeft: 'Acessar Módulo →',
      footerRight: 'Porta: 502/SSL',
      footerRightColor: 'text-[#64748b]',
    },
    {
      id: 'users' as ScreenId,
      telaTag: '[TELA 3]',
      title: 'Gestão de Usuários',
      description:
        'Cadastro de matriz de permissões, papéis de supervisão, turnos fabris e credenciais industriais.',
      icon: <Users className="w-5 h-5 text-[#ea580c]" />,
      footerLeft: 'Acessar Módulo →',
      footerRight: 'Admin / Nível 3',
      footerRightColor: 'text-[#64748b]',
    },
    {
      id: 'oee' as ScreenId,
      telaTag: '[TELA 4]',
      title: 'Dashboards & OEE',
      description:
        'Telemetria de linha de montagem, disponibilidade, rendimento, qualidade e gargalos em tempo real.',
      icon: <BarChart3 className="w-5 h-5 text-[#ea580c]" />,
      footerLeft: 'Acessar Módulo →',
      footerRight: 'OEE 87.4%',
      footerRightColor: 'text-[#16a34a] font-bold',
    },
    {
      id: 'history' as ScreenId,
      telaTag: '[TELA 5]',
      title: 'Consulta no Banco de Dados',
      description:
        'Consultas SQL industriais, logs de paradas de máquina, alarmes históricos e séries temporais.',
      icon: <Database className="w-5 h-5 text-[#ea580c]" />,
      footerLeft: 'Acessar Módulo →',
      footerRight: 'PostgreSQL SCADA',
      footerRightColor: 'text-[#64748b]',
    },
    {
      id: 'reports' as ScreenId,
      telaTag: '[TELA 6]',
      title: 'Imprimir Relatórios',
      description:
        'Emissão de ordens de serviço, relatórios de turnos concluídos e laudos de auditoria de qualidade.',
      icon: <Printer className="w-5 h-5 text-[#ea580c]" />,
      footerLeft: 'Acessar Módulo →',
      footerRight: 'Spooler Pronto',
      footerRightColor: 'text-[#64748b]',
    },
    {
      id: 'plc_config' as ScreenId,
      telaTag: '[TELA 7]',
      title: 'Configurações do Sistema',
      description:
        'Parametrização de rede Modbus TCP/IP, mapeamento de memória CLP e rotinas de heartbeat.',
      icon: <SlidersHorizontal className="w-5 h-5 text-[#ea580c]" />,
      footerLeft: 'Acessar Módulo →',
      footerRight: '192.168.1.100',
      footerRightColor: 'text-[#64748b]',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fc] flex flex-col font-sans select-none">
      {/* Top Header matching image */}
      <header className="w-full bg-white border-b border-[#e2e8f0] px-4 md:px-8 py-2 flex items-center justify-between gap-4">
        {/* Left: Brand Lockup */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight text-[#0f172a] uppercase font-sans">
            STANLEY
          </span>
          <span className="bg-[#ea580c] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-[2px] tracking-wider uppercase">
            SCADA
          </span>
          <span className="w-2 h-2 rounded-full bg-[#16a34a] ml-1 animate-pulse" />
        </div>

        {/* Right: Telemetry Time, Operator info & Logout */}
        <div className="flex items-center gap-4 text-xs">
          {/* Time & Shift */}
          <div className="text-right font-mono text-[11px] leading-tight">
            <div className="font-bold text-[#0f172a] tabular-nums">
              {clockTime || '14:32:08 UTC-3'}
            </div>
            <div className="text-[#64748b] text-[10px]">
              {currentDateStr || '2024-10-24'} | TURNO A
            </div>
          </div>

          {/* Operator Details */}
          <div className="text-right leading-tight hidden sm:block">
            <div className="font-mono font-bold text-[#0f172a] text-[11px]">
              OP_4402 - Silva, M.
            </div>
            <div className="font-mono font-bold text-[#16a34a] text-[10px] uppercase">
              SUPERVISOR N2
            </div>
          </div>

          {/* Direct Download MVC C# for Visual Studio */}
          <a
            href="./StanleyScada_MVC_CSharp.zip"
            download="StanleyScada_MVC_CSharp.zip"
            className="flex items-center gap-1.5 bg-[#5c2d91] hover:bg-[#4a2475] text-white px-2.5 py-1 rounded-[3px] font-sans font-bold text-[11px] transition-colors shadow-xs"
            title="Baixar Projeto MVC C# Completo para Visual Studio (.sln)"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual Studio MVC C# (.sln)</span>
          </a>

          {/* Direct Download dist for GitHub Pages */}
          <a
            href="./dist_pronto_para_github_pages.zip"
            download="dist_pronto_para_github_pages.zip"
            className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-2.5 py-1 rounded-[3px] font-sans font-bold text-[11px] transition-colors shadow-xs"
            title="Baixar arquivos compilados (dist) para abrir instantaneamente no GitHub Pages"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar GitHub Pages Pronto (.zip)</span>
          </a>

          {/* Direct Download Source ZIP Button */}
          <a
            href="./SUP_STAN.zip"
            download="SUP_STAN.zip"
            className="flex items-center gap-1.5 bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#cbd5e1] px-2.5 py-1 rounded-[3px] font-sans font-semibold text-[11px] transition-colors shadow-xs"
            title="Baixar código-fonte completo em .ZIP"
          >
            <Download className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="hidden sm:inline">Código Fonte (.ZIP)</span>
          </a>

          {/* Image Links Reference */}
          <button
            onClick={onOpenImageLinks}
            className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-[#006194] bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#cbdbf5] px-2 py-1 rounded-[3px] transition-colors"
            title="Ver Referências e Links de Imagens HTML"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Links HTML</span>
          </button>

          {/* Sair Button */}
          <button
            onClick={onLogout}
            className="px-3 py-1 bg-white hover:bg-[#fef2f2] text-[#334155] hover:text-[#dc2626] border border-[#cbd5e1] hover:border-[#fecaca] rounded-[3px] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Hero Central Gateway Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-[6px] p-6 md:p-8 text-center shadow-xs space-y-3">
          {/* Stanley Supervisory Core Logo Lockup */}
          <div className="flex flex-col items-center justify-center">
            <div className="border border-[#fed7aa] bg-[#fffaf5] px-6 py-2 rounded-[3px] shadow-2xs">
              <span className="font-black text-2xl tracking-tighter text-[#ea580c] uppercase font-sans">
                STANLEY
              </span>
              <div className="text-[9px] font-bold tracking-widest text-[#64748b] uppercase -mt-1 font-mono">
                INDUSTRIAL SUPERVISORY CORE
              </div>
            </div>
          </div>

          {/* Module Tag */}
          <div className="pt-1">
            <span className="inline-block text-[11px] font-mono font-bold text-[#ea580c] bg-[#fff7ed] border border-[#ffedd5] px-2.5 py-0.5 rounded-[2px] tracking-wide uppercase">
              MÓDULO [T0] | ISA-101 CENTRAL GATEWAY
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#0f172a] uppercase">
            [TELA DE ABERTURA] SISTEMA SUPERVISÓRIO INDUSTRIAL STANLEY
          </h1>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-[#475569] max-w-2xl mx-auto font-medium">
            Portal Central de Acesso à Operação, Monitoramento SCADA e Gestão de Planta
          </p>

          {/* Host & Scan status indicators */}
          <div className="flex items-center justify-center gap-4 text-xs font-mono pt-2 text-[#64748b]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span>Host:</span>
              <strong className="text-[#0f172a]">STANLEY-LINHA-04</strong>
            </div>
            <div className="w-px h-3 bg-[#cbd5e1]" />
            <div className="flex items-center gap-1">
              <span>PLC Scan:</span>
              <strong className="text-[#0f172a]">12ms (Sincronizado)</strong>
            </div>
          </div>
        </div>

        {/* 6 Modules Grid (2 rows x 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {moduleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="group bg-white border border-[#e2e8f0] hover:border-[#ea580c] rounded-[4px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon + Tela Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center transition-transform group-hover:scale-105">
                    {card.icon}
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-[2px]">
                    {card.telaTag}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-bold text-sm text-[#0f172a] group-hover:text-[#ea580c] transition-colors mb-1.5">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-[#475569] leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>

              {/* Bottom Footer Row */}
              <div className="pt-4 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-mono">
                <span className="text-[#ea580c] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  {card.footerLeft}
                </span>
                <span className={`text-[11px] ${card.footerRightColor}`}>
                  {card.footerRight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
