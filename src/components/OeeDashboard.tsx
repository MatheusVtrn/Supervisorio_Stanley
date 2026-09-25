import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Filter,
  Clock,
  Zap,
  CheckCircle2,
  Gauge,
  Sliders,
  Radio,
  Calendar,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';
import { MetricGauge, HourlyDataPoint, PlcTelemetry } from '../types/scada';

interface OeeDashboardProps {
  isLive: boolean;
  onToggleLive: () => void;
  telemetry: PlcTelemetry;
  onOpenImageLinks: () => void;
}

export const OeeDashboard: React.FC<OeeDashboardProps> = ({
  isLive,
  onToggleLive,
  telemetry,
  onOpenImageLinks,
}) => {
  // Filter state
  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  const [selectedWindow, setSelectedWindow] = useState('08:00 - 14:00 (Turno Atual)');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<HourlyDataPoint | null>(null);
  const [customFilterModal, setCustomFilterModal] = useState(false);

  // Live fluctuating metric values
  const [metrics, setMetrics] = useState<{
    oee: number;
    availability: number;
    performance: number;
    quality: number;
  }>({
    oee: 87.4,
    availability: 94.2,
    performance: 95.8,
    quality: 96.9,
  });

  // Simulated live update
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Minor realistic micro-jitter
        const delta = (Math.random() - 0.48) * 0.1;
        const newOee = Math.min(99.9, Math.max(85.0, Number((prev.oee + delta).toFixed(1))));
        return {
          ...prev,
          oee: newOee,
        };
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

  // Hourly Data Points matching Image 1
  const hourlyData: HourlyDataPoint[] = [
    {
      hour: '08:00',
      label: 'Início Turno',
      oee: 81.2,
      target: 85.0,
      status: 'alarm',
      tag: 'Início Turno',
      piecesProduced: 310,
      scrapPieces: 12,
      downtimeMinutes: 18,
      availability: 88.5,
      performance: 92.1,
      quality: 96.1,
    },
    {
      hour: '09:00',
      label: 'Estável',
      oee: 84.6,
      target: 85.0,
      status: 'warning',
      tag: 'Estável',
      piecesProduced: 395,
      scrapPieces: 8,
      downtimeMinutes: 7,
      availability: 91.0,
      performance: 93.8,
      quality: 98.0,
    },
    {
      hour: '10:00',
      label: 'Interrupção',
      oee: 79.5,
      target: 85.0,
      status: 'alarm',
      tag: 'Interrupção',
      piecesProduced: 280,
      scrapPieces: 19,
      downtimeMinutes: 24,
      availability: 82.0,
      performance: 97.0,
      quality: 93.2,
    },
    {
      hour: '11:00',
      label: 'Recuperação',
      oee: 88.0,
      target: 85.0,
      status: 'nominal',
      tag: 'Recuperação',
      piecesProduced: 420,
      scrapPieces: 5,
      downtimeMinutes: 0,
      availability: 94.5,
      performance: 96.0,
      quality: 98.8,
    },
    {
      hour: '12:00',
      label: 'Nominal',
      oee: 89.8,
      target: 85.0,
      status: 'nominal',
      tag: 'Nominal',
      piecesProduced: 435,
      scrapPieces: 4,
      downtimeMinutes: 0,
      availability: 95.2,
      performance: 97.4,
      quality: 99.1,
    },
    {
      hour: '14:00 (Atual)',
      label: 'Pico 91.3%',
      oee: 91.3,
      target: 85.0,
      status: 'nominal',
      tag: 'Pico 91.3%',
      piecesProduced: 450,
      scrapPieces: 3,
      downtimeMinutes: 0,
      availability: 96.0,
      performance: 98.1,
      quality: 99.3,
      isPeak: true,
    },
  ];

  // SVG Chart calculation variables
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 60;
  const paddingY = 35;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  // Y Scale: 70% min to 100% max
  const minY = 70;
  const maxY = 100;
  const getY = (val: number) => {
    const ratio = (val - minY) / (maxY - minY);
    return chartHeight - paddingY - ratio * graphHeight;
  };

  const getX = (idx: number) => {
    return paddingX + (idx / (hourlyData.length - 1)) * graphWidth;
  };

  // Generate SVG path for line
  const linePoints = hourlyData.map((d, i) => `${getX(i)},${getY(d.oee)}`);
  const linePath = `M ${linePoints.join(' L ')}`;
  const areaPath = `M ${getX(0)},${chartHeight - paddingY} L ${linePoints.join(
    ' L '
  )} L ${getX(hourlyData.length - 1)},${chartHeight - paddingY} Z`;

  const targetY = getY(85.0);

  // Circular gauge SVG generator
  const renderDonutGauge = (
    value: number,
    color: string,
    icon: React.ReactNode,
    size = 110,
    strokeWidth = 10
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(100, Math.max(0, value));
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center icon */}
        <div className="absolute flex items-center justify-center text-[#ea580c]">
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      {/* View Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#ea580c] tracking-tight">
              [TELA 4B]
            </span>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-[#0f172a] uppercase">
              Dashboards Industriais - Acompanhamento OEE
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5 font-medium">
            Overall Equipment Effectiveness - Cálculo Integrado de Produtividade Stanley
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCustomFilterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#cbd5e1] rounded-[3px] text-xs font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Personalizado</span>
          </button>

          <button
            onClick={onToggleLive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all ${
              isLive
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>OEE</span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isLive ? 'bg-black/20 text-white' : 'bg-slate-400 text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-white animate-ping' : 'bg-white'}`} />
              {isLive ? 'live' : 'pausado'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-[4px] border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* Data Filter */}
          <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-[3px]">
            <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="text-[11px] font-bold text-[#64748b] font-mono uppercase">DATA:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-mono text-xs font-bold text-[#0f172a] bg-transparent border-none focus:outline-none cursor-pointer"
            />
          </div>

          {/* Janela de Tempo */}
          <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-[3px]">
            <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="text-[11px] font-bold text-[#64748b] font-mono uppercase">JANELA DE TEMPO:</span>
            <select
              value={selectedWindow}
              onChange={(e) => setSelectedWindow(e.target.value)}
              className="font-mono text-xs font-bold text-[#0f172a] bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="08:00 - 14:00 (Turno Atual)">08:00 - 14:00 (Turno Atual)</option>
              <option value="06:00 - 14:00 (Turno A Completo)">06:00 - 14:00 (Turno A Completo)</option>
              <option value="Últimas 4 Horas">Últimas 4 Horas</option>
              <option value="Tempo Real (Última Hora)">Tempo Real (Última Hora)</option>
            </select>
          </div>
        </div>

        {/* Aplicar Filtros Button */}
        <button
          onClick={() => {
            setIsFilterApplied(true);
            setTimeout(() => setIsFilterApplied(false), 1200);
          }}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ml-auto"
        >
          {isFilterApplied ? <Check className="w-3.5 h-3.5" /> : <Filter className="w-3.5 h-3.5" />}
          <span>{isFilterApplied ? 'Filtros Aplicados' : 'Aplicar Filtros'}</span>
        </button>
      </div>

      {/* 4 Metric Donut Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: OEE ATUAL */}
        <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h2 className="text-sm font-black tracking-tight text-[#0f172a] uppercase">
              OEE ATUAL
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              DENTRO DA META
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            {renderDonutGauge(
              metrics.oee,
              '#16a34a',
              <Gauge className="w-5 h-5 text-[#ea580c]" />,
              96,
              10
            )}
            <div className="text-right">
              <span className="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">
                {metrics.oee.toFixed(1)}
              </span>
              <span className="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div className="text-[10px] font-mono text-[#64748b] mt-1">
                Alvo Stanley: <span className="text-[#0f172a] font-bold">85.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: DISPONIBILIDADE */}
        <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h2 className="text-sm font-black tracking-tight text-[#0f172a] uppercase">
              DISPONIBILIDADE
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              DENTRO DA META
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            {renderDonutGauge(
              metrics.availability,
              '#10b981',
              <Clock className="w-5 h-5 text-[#10b981]" />,
              96,
              10
            )}
            <div className="text-right">
              <span className="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">
                {metrics.availability.toFixed(1)}
              </span>
              <span className="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div className="text-[10px] font-mono text-[#64748b] mt-1">
                Operação: <span className="text-[#0f172a] font-bold">342 min / 360</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: PERFORMANCE */}
        <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h2 className="text-sm font-black tracking-tight text-[#0f172a] uppercase">
              PERFORMANCE
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              DENTRO DA META
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            {renderDonutGauge(
              metrics.performance,
              '#0284c7',
              <Zap className="w-5 h-5 text-[#0284c7]" />,
              96,
              10
            )}
            <div className="text-right">
              <span className="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">
                {metrics.performance.toFixed(1)}
              </span>
              <span className="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div className="text-[10px] font-mono text-[#64748b] mt-1">
                Velocidade CLP: <span className="text-[#0f172a] font-bold">450 pç/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: QUALIDADE */}
        <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h2 className="text-sm font-black tracking-tight text-[#0f172a] uppercase">
              QUALIDADE
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#d97706] bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded-[2px]">
              <AlertTriangle className="w-3 h-3 text-[#d97706]" />
              ATENÇÃO
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            {renderDonutGauge(
              metrics.quality,
              '#f59e0b',
              <CheckCircle2 className="w-5 h-5 text-[#f59e0b]" />,
              96,
              10
            )}
            <div className="text-right">
              <span className="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">
                {metrics.quality.toFixed(1)}
              </span>
              <span className="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div className="text-[10px] font-mono text-[#64748b] mt-1">
                Aprovadas: <span className="text-[#0f172a] font-bold">2.285 / 2.338</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Chart Card */}
      <div className="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Chart Header */}
        <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-[#ea580c] mt-0.5" />
            <div>
              <h2 className="text-base font-black tracking-tight text-[#0f172a] uppercase">
                Evolução Hora a Hora
              </h2>
              <p className="text-xs text-[#64748b] font-medium">
                Tendência temporal contínua e amostragem em tempo real (08:00 - 14:00)
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#ea580c] font-semibold">
              <span className="w-4 h-0 border-t-2 border-dashed border-[#ea580c]" />
              <span>META DE EFICIÊNCIA (85.0%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#16a34a] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
              <span>OEE REALIZADO</span>
            </div>
            <div className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px] text-[11px] font-bold">
              6 INTERVALOS ATIVOS
            </div>
          </div>
        </div>

        {/* Industrial SVG Chart Container */}
        <div className="p-4 bg-white overflow-x-auto">
          <div className="min-w-[760px] relative">
            {/* Theoretical Capacity and Critical limits indicators */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] px-6 mb-1">
              <span>100% Capacidade Teórica</span>
              <span className="text-[#ea580c] font-bold">--- LINHA DE META OPERACIONAL (85.0%) ---</span>
              <span className="text-[#dc2626]">70% Limite Crítico</span>
            </div>

            {/* SVG Plot */}
            <div className="relative border border-[#e2e8f0] rounded-[3px] bg-[#f8fafc]/50 p-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto select-none">
                <defs>
                  {/* Subtle green area gradient */}
                  <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line
                  x1={paddingX}
                  y1={getY(100)}
                  x2={chartWidth - paddingX}
                  y2={getY(100)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <line
                  x1={paddingX}
                  y1={getY(90)}
                  x2={chartWidth - paddingX}
                  y2={getY(90)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={chartWidth - paddingX}
                  y2={targetY}
                  stroke="#ea580c"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <line
                  x1={paddingX}
                  y1={getY(80)}
                  x2={chartWidth - paddingX}
                  y2={getY(80)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={getY(70)}
                  x2={chartWidth - paddingX}
                  y2={getY(70)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />

                {/* Shaded Area Under Curve */}
                <path d={areaPath} fill="url(#oeeGradient)" />

                {/* Main Connected Trajectory Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points & Interactive Nodes */}
                {hourlyData.map((d, i) => {
                  const cx = getX(i);
                  const cy = getY(d.oee);
                  const isUnderTarget = d.oee < 85.0;

                  return (
                    <g
                      key={d.hour}
                      className="cursor-pointer group"
                      onClick={() => setSelectedPoint(d)}
                    >
                      {/* Vertical connector line */}
                      <line
                        x1={cx}
                        y1={cy}
                        x2={cx}
                        y2={chartHeight - paddingY}
                        stroke={isUnderTarget ? '#fecaca' : '#bbf7d0'}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />

                      {/* Outer pulse circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="white"
                        stroke={isUnderTarget ? '#dc2626' : '#16a34a'}
                        strokeWidth="3"
                        className="transition-transform group-hover:scale-125"
                      />

                      {/* Inner dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="3.5"
                        fill={isUnderTarget ? '#dc2626' : '#16a34a'}
                      />

                      {/* Score Value Tag Box */}
                      <foreignObject
                        x={cx - 32}
                        y={cy - 36}
                        width="64"
                        height="26"
                        className="overflow-visible"
                      >
                        <div
                          className={`text-center font-mono text-[11px] font-bold py-0.5 px-1 rounded-[3px] border shadow-xs transition-transform group-hover:-translate-y-1 ${
                            d.isPeak
                              ? 'bg-[#16a34a] text-white border-[#15803d]'
                              : isUnderTarget
                              ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
                              : 'bg-white text-[#0f172a] border-[#cbd5e1]'
                          }`}
                        >
                          {d.oee.toFixed(1)}%
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Labels row underneath chart */}
              <div className="grid grid-cols-6 text-center text-xs font-mono pt-2 border-t border-[#e2e8f0]">
                {hourlyData.map((d) => (
                  <div
                    key={d.hour}
                    onClick={() => setSelectedPoint(d)}
                    className="cursor-pointer hover:bg-[#f1f5f9] py-1 rounded transition-colors"
                  >
                    <div className="font-bold text-[#0f172a]">{d.hour}</div>
                    <div
                      className={`text-[10px] uppercase font-semibold ${
                        d.status === 'alarm'
                          ? 'text-[#dc2626]'
                          : d.isPeak
                          ? 'text-[#16a34a] font-bold'
                          : 'text-[#64748b]'
                      }`}
                    >
                      {d.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Telemetry Hardware Bus Bar */}
        <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-4 py-2 text-[11px] font-mono flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 text-[#16a34a]">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
            <span className="text-[#64748b]">TAXA AMOSTRAGEM:</span>
            <span className="font-bold text-[#0f172a]">{telemetry.sampleRate}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#64748b]">COMM BUS:</span>
            <span className="font-bold text-[#16a34a]">{telemetry.commBus}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#64748b]">OPC-UA:</span>
            <span className="font-bold text-[#0284c7]">{telemetry.opcUa}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#64748b]">PACOTES TX/RX:</span>
            <span className="font-bold text-[#0f172a]">
              {telemetry.packetsTx.toLocaleString('pt-BR')} / {telemetry.errors} ERROS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#64748b]">STANLEY SCADA OS:</span>
            <span className="font-bold text-[#ea580c]">{telemetry.version}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#64748b]">NÓ INDUSTRIAL:</span>
            <span className="font-bold text-[#0f172a]">{telemetry.industrialNode}</span>
          </div>
        </div>

        {/* Bottom Efficiency Summary Bar */}
        <div className="bg-white border-t border-[#e2e8f0] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#16a34a]" />
            <span className="text-[#0f172a] font-semibold">
              Pico de Eficiência: <strong className="text-[#16a34a]">13:00 - 14:00 (OEE 91.3%)</strong>
            </span>
            <span className="text-[#cbd5e1]">|</span>
            <span className="text-[#64748b]">
              Desvio em Relação à Meta:{' '}
              <strong className="text-[#16a34a]">+6.3% acima do alvo</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#64748b] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span>Última leitura CLP:</span>
            <span className="font-bold text-[#0f172a] tabular-nums">
              {telemetry.lastReading}
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Detail Telemetry Modal (when clicking a point) */}
      {selectedPoint && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-[#cbd5e1] max-w-md w-full p-5 shadow-xl font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#ea580c]" />
                <h3 className="font-bold text-sm text-[#0f172a] uppercase">
                  Amostragem {selectedPoint.hour} - {selectedPoint.tag}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-[#64748b] hover:text-[#0f172a] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#f8fafc] rounded-[3px] border border-[#e2e8f0]">
                <span className="text-[#64748b]">OEE CALCULADO:</span>
                <span className="font-bold text-lg text-[#0f172a]">{selectedPoint.oee.toFixed(1)}%</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">DISP.</div>
                  <div className="font-bold text-[#16a34a]">{selectedPoint.availability}%</div>
                </div>
                <div className="p-2 bg-[#eff6ff] border border-[#bfdbfe] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">PERF.</div>
                  <div className="font-bold text-[#0284c7]">{selectedPoint.performance}%</div>
                </div>
                <div className="p-2 bg-[#fffbeb] border border-[#fde68a] rounded-[3px]">
                  <div className="text-[10px] text-[#64748b]">QUAL.</div>
                  <div className="font-bold text-[#d97706]">{selectedPoint.quality}%</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 text-[#334155]">
                <div className="flex justify-between">
                  <span>Peças Produzidas:</span>
                  <span className="font-bold text-[#0f172a]">{selectedPoint.piecesProduced} unid.</span>
                </div>
                <div className="flex justify-between">
                  <span>Refugos / Defeitos:</span>
                  <span className="font-bold text-[#dc2626]">{selectedPoint.scrapPieces} unid.</span>
                </div>
                <div className="flex justify-between">
                  <span>Parada de Linha:</span>
                  <span className="font-bold text-[#0f172a]">{selectedPoint.downtimeMinutes} min</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPoint(null)}
              className="w-full mt-2 bg-[#ea580c] text-white py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider hover:bg-[#c2410c] transition-colors"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Custom Filter Modal */}
      {customFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-[#cbd5e1] max-w-lg w-full p-5 shadow-xl font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#ea580c]" />
                <h3 className="font-bold text-sm text-[#0f172a] uppercase">
                  Parâmetros de Amostragem SCADA
                </h3>
              </div>
              <button
                onClick={() => setCustomFilterModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#334155] mb-1">Linha de Produção:</label>
                <select className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] font-mono text-xs">
                  <option>Linha 01 - Prensa & Estampagem Stanley</option>
                  <option>Linha 02 - Célula Robótica de Solda</option>
                  <option>Linha 03 - Centro de Usinagem CNC</option>
                  <option>Linha 04 - Montagem & Interlock Final</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">Meta Operacional OEE (%):</label>
                <input
                  type="number"
                  defaultValue={85}
                  step={0.5}
                  className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">Amostragem de Taxa de CLP:</label>
                <select className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] font-mono text-xs">
                  <option>100ms (10Hz) - Tempo Real Ultra-rápido</option>
                  <option>500ms (2Hz) - Padrão de Rede</option>
                  <option>1000ms (1Hz) - Economia de Banda</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCustomFilterModal(false)}
                className="flex-1 bg-[#ea580c] text-white py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider hover:bg-[#c2410c] transition-colors"
              >
                Salvar Configuração
              </button>
              <button
                onClick={() => setCustomFilterModal(false)}
                className="px-4 py-2 border border-[#cbd5e1] rounded-[3px] text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
