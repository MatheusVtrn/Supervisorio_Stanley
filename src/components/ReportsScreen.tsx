import React from 'react';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ShiftInfo } from '../types/scada';

interface ReportsScreenProps {
  currentShift: ShiftInfo;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ currentShift }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      {/* Header */}
      <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#ea580c]" />
            <h1 className="text-lg font-black tracking-tight text-[#0f172a] uppercase">
              Imprimir Relatórios & Laudos de OEE
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Geração de relatório consolidado para auditoria e gestão industrial Stanley
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Card */}
      <div className="bg-white p-6 md:p-8 rounded-[4px] border border-[#cbd5e1] shadow-sm max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none">
        {/* Report Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#0f172a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ea580c] text-white font-black px-2 py-0.5 text-sm uppercase rounded-[2px]">
                Stanley
              </span>
              <span className="font-mono text-sm font-black text-[#0f172a] tracking-wider uppercase">
                SCADA OS INDUSTRIAL
              </span>
            </div>
            <div className="text-xs text-[#64748b] mt-1 font-mono">
              Laudo Técnico de Produtividade & Cálculo Integrado OEE
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="text-[10px] text-[#64748b] uppercase font-bold">Relatório Nº</div>
            <div className="font-bold text-[#0f172a]">STANLEY-OEE-2026-0924</div>
            <div className="text-[#64748b] text-[10px]">Data Emissão: 24/09/2026 14:00</div>
          </div>
        </div>

        {/* Operational Context Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded-[3px] border border-[#e2e8f0] font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#64748b] block">LINHA DE PRODUÇÃO:</span>
            <strong className="text-[#0f172a]">Linha 01 Prensa & Estamp.</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block">TURNO ATIVO:</span>
            <strong className="text-[#0f172a]">{currentShift.code}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block">OPERADOR RESPONSÁVEL:</span>
            <strong className="text-[#0f172a]">{currentShift.operator} ({currentShift.operatorBadge})</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block">INTERLOCK STATUS:</span>
            <strong className="text-[#16a34a]">SEGURO / HOMOLOGADO</strong>
          </div>
        </div>

        {/* Metrics Summary Table */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#334155] mb-2 font-mono">
            Índices Globais de Eficiência (OEE)
          </h2>
          <table className="w-full text-left text-xs border border-[#e2e8f0]">
            <thead className="bg-[#f1f5f9] font-mono text-[11px] text-[#64748b]">
              <tr>
                <th className="p-2.5 border-b border-[#e2e8f0]">Indicador</th>
                <th className="p-2.5 border-b border-[#e2e8f0] text-center">Meta Contratual</th>
                <th className="p-2.5 border-b border-[#e2e8f0] text-center">Realizado</th>
                <th className="p-2.5 border-b border-[#e2e8f0] text-center">Desvio</th>
                <th className="p-2.5 border-b border-[#e2e8f0] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] font-mono">
              <tr>
                <td className="p-2.5 font-bold text-[#0f172a]">Disponibilidade (A)</td>
                <td className="p-2.5 text-center">90.0%</td>
                <td className="p-2.5 text-center font-bold text-[#16a34a]">94.2%</td>
                <td className="p-2.5 text-center text-[#16a34a]">+4.2%</td>
                <td className="p-2.5 text-center text-[#16a34a] font-bold">CONFORME</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-[#0f172a]">Performance (P)</td>
                <td className="p-2.5 text-center">92.0%</td>
                <td className="p-2.5 text-center font-bold text-[#0284c7]">95.8%</td>
                <td className="p-2.5 text-center text-[#16a34a]">+3.8%</td>
                <td className="p-2.5 text-center text-[#16a34a] font-bold">CONFORME</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-[#0f172a]">Qualidade (Q)</td>
                <td className="p-2.5 text-center">98.0%</td>
                <td className="p-2.5 text-center font-bold text-[#d97706]">96.9%</td>
                <td className="p-2.5 text-center text-[#dc2626]">-1.1%</td>
                <td className="p-2.5 text-center text-[#d97706] font-bold">ADVERTÊNCIA</td>
              </tr>
              <tr className="bg-[#f8fafc] font-black text-sm">
                <td className="p-3 text-[#ea580c]">OEE TOTAL (A × P × Q)</td>
                <td className="p-3 text-center">85.0%</td>
                <td className="p-3 text-center text-[#16a34a] text-base">87.4%</td>
                <td className="p-3 text-center text-[#16a34a]">+2.4%</td>
                <td className="p-3 text-center text-[#16a34a]">APROVADO</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Breakdown Counts */}
        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="p-3 border border-[#e2e8f0] rounded-[3px]">
            <div className="text-[10px] text-[#64748b]">TOTAL PRODUZIDO</div>
            <div className="text-xl font-bold text-[#0f172a]">2.338 pçs</div>
          </div>
          <div className="p-3 border border-[#bbf7d0] bg-[#f0fdf4] rounded-[3px]">
            <div className="text-[10px] text-[#16a34a]">TOTAL APROVADO</div>
            <div className="text-xl font-bold text-[#16a34a]">2.285 pçs</div>
          </div>
          <div className="p-3 border border-[#fecaca] bg-[#fef2f2] rounded-[3px]">
            <div className="text-[10px] text-[#dc2626]">REFUGOS / SUCATA</div>
            <div className="text-xl font-bold text-[#dc2626]">53 pçs (2.2%)</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-[#cbd5e1] grid grid-cols-2 gap-8 text-center font-mono text-xs">
          <div>
            <div className="w-48 h-px bg-[#64748b] mx-auto mb-2" />
            <div className="font-bold text-[#0f172a]">{currentShift.operator}</div>
            <div className="text-[10px] text-[#64748b]">Operador Responsável · Reg. {currentShift.operatorBadge}</div>
          </div>
          <div>
            <div className="w-48 h-px bg-[#64748b] mx-auto mb-2" />
            <div className="font-bold text-[#0f172a]">Engenharia de Processos Stanley</div>
            <div className="text-[10px] text-[#64748b]">Supervisão Industrial SCADA RT-01</div>
          </div>
        </div>
      </div>
    </div>
  );
};
