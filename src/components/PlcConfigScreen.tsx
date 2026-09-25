import React, { useState } from 'react';
import { SlidersHorizontal, Cpu, Network, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { PlcTelemetry } from '../types/scada';

interface PlcConfigScreenProps {
  telemetry: PlcTelemetry;
  onUpdateTelemetry: (newTelem: Partial<PlcTelemetry>) => void;
}

export const PlcConfigScreen: React.FC<PlcConfigScreenProps> = ({
  telemetry,
  onUpdateTelemetry,
}) => {
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [port, setPort] = useState('502');
  const [opcUaEndpoint, setOpcUaEndpoint] = useState('opc.tcp://192.168.1.100:4840');
  const [sampleRate, setSampleRate] = useState('100ms');
  const [nodeId, setNodeId] = useState('BR-SP-04');
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestSuccess(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
      onUpdateTelemetry({
        commBus: `MODBUS/TCP ${port}`,
        opcUa: opcUaEndpoint,
        industrialNode: nodeId,
        sampleRate: `${sampleRate} (${sampleRate === '100ms' ? '10Hz' : '2Hz'})`,
      });
    }, 600);
  };

  const plcRegisters = [
    { address: 'HR_40001', name: 'Ciclos_Prensa_Contador', type: 'UINT32', value: '2338', access: 'R' },
    { address: 'HR_40002', name: 'Sensor_Pressao_Hidraulica', type: 'FLOAT32', value: '184.5 BAR', access: 'R' },
    { address: 'HR_40003', name: 'Temperatura_Matriz_Estampo', type: 'FLOAT32', value: '62.4 °C', access: 'R' },
    { address: 'HR_40004', name: 'Setpoint_Cadencia_Minuto', type: 'UINT16', value: '8 pç/min', access: 'R/W' },
    { address: 'HR_40005', name: 'Status_Interlock_Cortina_Luz', type: 'BOOL', value: 'TRUE (SEGURO)', access: 'R' },
    { address: 'HR_40006', name: 'Contador_Pecas_Aprovadas', type: 'UINT32', value: '2285', access: 'R' },
    { address: 'HR_40007', name: 'Contador_Refugos_Sensor_Optico', type: 'UINT16', value: '53', access: 'R' },
    { address: 'HR_40008', name: 'Velocidade_Motor_Principal', type: 'UINT16', value: '1750 RPM', access: 'R/W' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      {/* Header */}
      <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#ea580c]" />
            <h1 className="text-lg font-black tracking-tight text-[#0f172a] uppercase">
              Configurações de Comunicação CLP & OPC-UA
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Parametrização de barramentos Modbus/TCP, Nós Industriais e Registradores
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          {isTesting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Network className="w-4 h-4" />
          )}
          <span>{isTesting ? 'Pingando CLP...' : 'Testar Comunicação'}</span>
        </button>
      </div>

      {testSuccess && (
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[3px] flex items-center gap-2 text-xs text-[#16a34a] font-mono">
          <Check className="w-4 h-4" />
          <span>Handshake validado com sucesso! Latência CLP: 4.2ms · 0 Erros de CRC.</span>
        </div>
      )}

      {/* Network & Comm Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[4px] border border-[#e2e8f0] shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0]">
            <Network className="w-4 h-4 text-[#ea580c]" />
            <h2 className="font-bold text-sm text-[#0f172a] uppercase">
              Parâmetros de Rede Industrial
            </h2>
          </div>

          <div className="space-y-3 font-mono">
            <div>
              <label className="block text-[#64748b] text-[11px] mb-1">ENDEREÇO IP DO CLP (MODBUS SERVER):</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#64748b] text-[11px] mb-1">PORTA TCP:</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold"
                />
              </div>
              <div>
                <label className="block text-[#64748b] text-[11px] mb-1">NÓ INDUSTRIAL:</label>
                <input
                  type="text"
                  value={nodeId}
                  onChange={(e) => setNodeId(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] mb-1">ENDPOINT DO SERVIDOR OPC-UA:</label>
              <input
                type="text"
                value={opcUaEndpoint}
                onChange={(e) => setOpcUaEndpoint(e.target.value)}
                className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold text-xs"
              />
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] mb-1">TAXA DE POLING / AMOSTRAGEM:</label>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value)}
                className="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold text-xs"
              >
                <option value="100ms">100ms (10Hz - Alta Precisão)</option>
                <option value="250ms">250ms (4Hz - Padrão)</option>
                <option value="500ms">500ms (2Hz - Econômico)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Telemetry Hardware Statistics */}
        <div className="bg-white p-5 rounded-[4px] border border-[#e2e8f0] shadow-sm space-y-4 text-xs font-mono">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0]">
            <Cpu className="w-4 h-4 text-[#ea580c]" />
            <h2 className="font-bold text-sm text-[#0f172a] uppercase font-sans">
              Diagnóstico de Barramento SCADA
            </h2>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span className="text-[#64748b]">Total de Pacotes Transmitidos (TX):</span>
              <strong className="text-[#0f172a]">{telemetry.packetsTx.toLocaleString('pt-BR')}</strong>
            </div>
            <div className="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span className="text-[#64748b]">Total de Pacotes Recebidos (RX):</span>
              <strong className="text-[#0f172a]">{telemetry.packetsRx.toLocaleString('pt-BR')}</strong>
            </div>
            <div className="flex justify-between p-2 bg-[#f0fdf4] rounded border border-[#bbf7d0]">
              <span className="text-[#16a34a]">Erros de Timeout / Paridade:</span>
              <strong className="text-[#16a34a]">{telemetry.errors}</strong>
            </div>
            <div className="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span className="text-[#64748b]">Versão do Firmware Supervisório:</span>
              <strong className="text-[#ea580c]">{telemetry.version}</strong>
            </div>
            <div className="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span className="text-[#64748b]">Interlock de Segurança RT-01:</span>
              <strong className="text-[#16a34a]">SEGURO (Conexão Criptografada)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* PLC Registers Table */}
      <div className="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-3 bg-[#f8fafc] border-b border-[#e2e8f0] font-mono text-xs font-bold text-[#334155] uppercase">
          Mapeamento de Registradores Holding (Modbus 40001 - 40008)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#f1f5f9] text-[#64748b] text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Endereço CLP</th>
                <th className="py-2.5 px-4">Nome da Tag / Variável</th>
                <th className="py-2.5 px-4">Tipo de Dado</th>
                <th className="py-2.5 px-4 text-center">Acesso</th>
                <th className="py-2.5 px-4 text-right">Valor em Tempo Real</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {plcRegisters.map((reg) => (
                <tr key={reg.address} className="hover:bg-[#f8fafc]">
                  <td className="py-2.5 px-4 font-bold text-[#ea580c]">{reg.address}</td>
                  <td className="py-2.5 px-4 text-[#0f172a] font-medium">{reg.name}</td>
                  <td className="py-2.5 px-4 text-[#64748b]">{reg.type}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="px-1.5 py-0.5 bg-[#f1f5f9] rounded text-[10px] text-[#334155] border">
                      {reg.access}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#0f172a]">{reg.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
