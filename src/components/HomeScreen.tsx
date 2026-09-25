import React from 'react';
import {
  Activity,
  ArrowRight,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { ScreenId } from '../types/scada';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const productionLines = [
    {
      id: 'L01',
      name: 'Linha 01 - Prensa & Estampagem Stanley',
      status: 'OPERANDO',
      statusColor: '#16a34a',
      oee: 87.4,
      availability: 94.2,
      performance: 95.8,
      quality: 96.9,
      currentSpeed: '450 pç/h',
      targetSpeed: '470 pç/h',
      activeShift: 'Turno A (Manhã)',
      operator: 'OP-77492-SP (Matheus V.)',
      clpNode: '192.168.1.101',
    },
    {
      id: 'L02',
      name: 'Linha 02 - Célula Robótica de Solda',
      status: 'OPERANDO',
      statusColor: '#16a34a',
      oee: 89.2,
      availability: 96.0,
      performance: 94.5,
      quality: 98.3,
      currentSpeed: '320 ciclos/h',
      targetSpeed: '330 ciclos/h',
      activeShift: 'Turno A (Manhã)',
      operator: 'OP-33921-SP (Carlos M.)',
      clpNode: '192.168.1.102',
    },
    {
      id: 'L03',
      name: 'Linha 03 - Centro de Usinagem CNC 5-Eixos',
      status: 'ATENÇÃO - SETUP',
      statusColor: '#d97706',
      oee: 76.8,
      availability: 81.5,
      performance: 97.0,
      quality: 97.2,
      currentSpeed: '185 pç/h',
      targetSpeed: '240 pç/h',
      activeShift: 'Turno A (Manhã)',
      operator: 'OP-11844-SP (Lucas F.)',
      clpNode: '192.168.1.103',
    },
    {
      id: 'L04',
      name: 'Linha 04 - Montagem & Interlock Final',
      status: 'OPERANDO',
      statusColor: '#16a34a',
      oee: 92.1,
      availability: 97.4,
      performance: 95.9,
      quality: 98.6,
      currentSpeed: '510 pç/h',
      targetSpeed: '520 pç/h',
      activeShift: 'Turno A (Manhã)',
      operator: 'OP-55219-SP (Juliana R.)',
      clpNode: '192.168.1.104',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      {/* Overview Banner */}
      <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-[#eff6ff] text-[#0284c7] border border-[#bfdbfe] px-2 py-0.5 rounded-[2px]">
              PLANTA INDUSTRIAL BR-SP
            </span>
            <h1 className="text-lg font-black tracking-tight text-[#0f172a] uppercase">
              Menu Principal · Status Geral de Manufatura
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Supervisão centralizada de linhas automatizadas e telemetria de produção
          </p>
        </div>

        <button
          onClick={() => onNavigate('oee')}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <span>Acessar [TELA 4B] OEE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Production Lines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {productionLines.map((line) => (
          <div
            key={line.id}
            className="bg-white rounded-[4px] border border-[#e2e8f0] p-4 shadow-sm hover:border-[#cbd5e1] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-2 border-b border-[#e2e8f0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#ea580c]">
                      [{line.id}]
                    </span>
                    <h2 className="font-bold text-sm text-[#0f172a]">
                      {line.name}
                    </h2>
                  </div>
                  <div className="text-[11px] font-mono text-[#64748b] mt-0.5">
                    CLP: {line.clpNode} · {line.activeShift}
                  </div>
                </div>

                <span
                  className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] border"
                  style={{
                    backgroundColor: `${line.statusColor}15`,
                    borderColor: `${line.statusColor}40`,
                    color: line.statusColor,
                  }}
                >
                  ● {line.status}
                </span>
              </div>

              {/* Line Metrics */}
              <div className="grid grid-cols-4 gap-2 py-3 text-center font-mono">
                <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">OEE</div>
                  <div className="font-bold text-sm text-[#0f172a]">{line.oee}%</div>
                </div>
                <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">DISP.</div>
                  <div className="font-bold text-sm text-[#16a34a]">{line.availability}%</div>
                </div>
                <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">PERF.</div>
                  <div className="font-bold text-sm text-[#0284c7]">{line.performance}%</div>
                </div>
                <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">QUAL.</div>
                  <div className="font-bold text-sm text-[#ea580c]">{line.quality}%</div>
                </div>
              </div>

              <div className="text-[11px] text-[#334155] space-y-1 pt-1 font-sans">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Velocidade Atual vs Alvo:</span>
                  <span className="font-mono font-bold text-[#0f172a]">
                    {line.currentSpeed} / {line.targetSpeed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Operador Responsável:</span>
                  <span className="font-mono font-medium text-[#0f172a]">{line.operator}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#e2e8f0] flex justify-end">
              <button
                onClick={() => onNavigate('oee')}
                className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1 uppercase tracking-wider"
              >
                <span>Ver Telemetria Detalhada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
