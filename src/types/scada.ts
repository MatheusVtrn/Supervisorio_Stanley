export type ScreenId =
  | 'login'
  | 'home'
  | 'oee'
  | 'users'
  | 'history'
  | 'reports'
  | 'plc_config';

export interface ShiftInfo {
  id: string;
  name: string;
  code: string;
  timeRange: string;
  operator: string;
  operatorBadge: string;
  operatorRole: string;
  operatorLevel: number;
}

export interface MetricGauge {
  id: string;
  title: string;
  value: number;
  unit: string;
  target: number;
  status: 'nominal' | 'warning' | 'alarm';
  statusText: string;
  icon: 'speed' | 'clock' | 'bolt' | 'check';
  color: string;
}

export interface HourlyDataPoint {
  hour: string;
  label: string;
  oee: number;
  target: number;
  status: 'nominal' | 'warning' | 'alarm';
  tag: string;
  piecesProduced: number;
  scrapPieces: number;
  downtimeMinutes: number;
  availability: number;
  performance: number;
  quality: number;
  isPeak?: boolean;
}

export interface PlcTelemetry {
  sampleRate: string;
  commBus: string;
  opcUa: string;
  packetsTx: number;
  packetsRx: number;
  errors: number;
  version: string;
  industrialNode: string;
  lastReading: string;
  interlockSecure: boolean;
}

export interface UserRecord {
  id: string;
  badge: string;
  name: string;
  role: string;
  level: number;
  shift: string;
  status: 'Ativo' | 'Em Pausa' | 'Desconectado';
  lastAccess: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  batchId: string;
  shift: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  productionCount: number;
  scrapCount: number;
  plcStatus: string;
}
