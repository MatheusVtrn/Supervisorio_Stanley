import React, { useState } from 'react';
import { Database, Search, Download, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { HistoryRecord } from '../types/scada';

export const HistoryScreen: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([
    {
      id: 'REC-9410',
      timestamp: '24/09/2026 14:00:00',
      batchId: 'BATCH-2026-0924-A',
      shift: 'Turno A',
      oee: 91.3,
      availability: 96.0,
      performance: 98.1,
      quality: 99.3,
      productionCount: 450,
      scrapCount: 3,
      plcStatus: 'NOMINAL_RUN',
    },
    {
      id: 'REC-9409',
      timestamp: '24/09/2026 12:00:00',
      batchId: 'BATCH-2026-0924-A',
      shift: 'Turno A',
      oee: 89.8,
      availability: 95.2,
      performance: 97.4,
      quality: 99.1,
      productionCount: 435,
      scrapCount: 4,
      plcStatus: 'NOMINAL_RUN',
    },
    {
      id: 'REC-9408',
      timestamp: '24/09/2026 11:00:00',
      batchId: 'BATCH-2026-0924-A',
      shift: 'Turno A',
      oee: 88.0,
      availability: 94.5,
      performance: 96.0,
      quality: 98.8,
      productionCount: 420,
      scrapCount: 5,
      plcStatus: 'NOMINAL_RUN',
    },
    {
      id: 'REC-9407',
      timestamp: '24/09/2026 10:00:00',
      batchId: 'BATCH-2026-0924-A',
      shift: 'Turno A',
      oee: 79.5,
      availability: 82.0,
      performance: 97.0,
      quality: 93.2,
      productionCount: 280,
      scrapCount: 19,
      plcStatus: 'INTERRUPCAO_SENSOR',
    },
    {
      id: 'REC-9406',
      timestamp: '24/09/2026 09:00:00',
      batchId: 'BATCH-2026-0924-A',
      shift: 'Turno A',
      oee: 84.6,
      availability: 91.0,
      performance: 93.8,
      quality: 98.0,
      productionCount: 395,
      scrapCount: 8,
      plcStatus: 'NOMINAL_RUN',
    },
    {
      id: 'REC-9405',
      timestamp: '24/09/2026 08:00:00',
      batchId: 'BATCH-2026-0924-A',
      shift: 'Turno A',
      oee: 81.2,
      availability: 88.5,
      performance: 92.1,
      quality: 96.1,
      productionCount: 310,
      scrapCount: 12,
      plcStatus: 'INICIO_TURNO',
    },
    {
      id: 'REC-9404',
      timestamp: '23/09/2026 21:50:00',
      batchId: 'BATCH-2026-0923-B',
      shift: 'Turno B',
      oee: 86.9,
      availability: 93.1,
      performance: 95.0,
      quality: 98.2,
      productionCount: 412,
      scrapCount: 7,
      plcStatus: 'NOMINAL_RUN',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [exportedMessage, setExportedMessage] = useState(false);

  const filtered = records.filter(
    (r) =>
      r.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.timestamp.includes(searchTerm) ||
      r.plcStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Lote,Turno,OEE,Disponibilidade,Performance,Qualidade,Produzidas,Refugo,Status_CLP\n';
    const rows = filtered
      .map(
        (r) =>
          `${r.id},${r.timestamp},${r.batchId},${r.shift},${r.oee}%,${r.availability}%,${r.performance}%,${r.quality}%,${r.productionCount},${r.scrapCount},${r.plcStatus}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Stanley_SCADA_Historico_OEE_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedMessage(true);
    setTimeout(() => setExportedMessage(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      {/* Header */}
      <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#ea580c]" />
            <h1 className="text-lg font-black tracking-tight text-[#0f172a] uppercase">
              Consulta BD / Histórico Telemétrico OEE
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Registros de produtividade, registros de CLP e auditoria de bateladas
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          {exportedMessage ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span>{exportedMessage ? 'CSV Exportado!' : 'Exportar Dados (.CSV)'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex items-center max-w-sm w-full">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por lote, data ou status..."
            className="w-full pl-9 pr-3 py-1.5 border border-[#cbd5e1] rounded-[3px] text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#64748b]">
          <span>Mostrando:</span>
          <strong className="text-[#0f172a]">{filtered.length}</strong>
          <span>amostragens registradas</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Registro</th>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Lote Batelada</th>
                <th className="py-3 px-4 text-center">OEE</th>
                <th className="py-3 px-4 text-center">Disp.</th>
                <th className="py-3 px-4 text-center">Perf.</th>
                <th className="py-3 px-4 text-center">Qual.</th>
                <th className="py-3 px-4 text-right">Produção</th>
                <th className="py-3 px-4 text-right">Refugo</th>
                <th className="py-3 px-4 text-center">Status CLP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors font-mono">
                  <td className="py-3 px-4 font-bold text-[#0f172a]">{r.id}</td>
                  <td className="py-3 px-4 text-[#64748b] text-[11px]">{r.timestamp}</td>
                  <td className="py-3 px-4 text-[#006194] font-semibold">{r.batchId}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-[2px] font-bold ${
                        r.oee >= 85.0
                          ? 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
                          : 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
                      }`}
                    >
                      {r.oee.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-[#16a34a]">{r.availability.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center text-[#0284c7]">{r.performance.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center text-[#ea580c]">{r.quality.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right font-bold text-[#0f172a]">
                    {r.productionCount} pçs
                  </td>
                  <td className="py-3 px-4 text-right text-[#dc2626] font-semibold">
                    {r.scrapCount} pçs
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] ${
                        r.plcStatus === 'NOMINAL_RUN'
                          ? 'bg-[#f0fdf4] text-[#16a34a]'
                          : 'bg-[#fffbeb] text-[#d97706]'
                      }`}
                    >
                      {r.plcStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
