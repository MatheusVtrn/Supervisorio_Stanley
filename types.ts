/**
 * Stanley SCADA OS - Definições de Tipos e Contratos de Dados (TypeScript)
 * Use este arquivo como referência ao iniciar o back-end da aplicação.
 */

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

export interface ProductionLine {
  id: string;
  name: string;
  status: 'OPERANDO' | 'ATENÇÃO - SETUP' | 'PARADA' | 'MANUTENÇÃO';
  statusColor: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  currentSpeed: string;
  targetSpeed: string;
  activeShift: string;
  operator: string;
  clpNode: string;
}

export interface PlcRegister {
  address: string;
  name: string;
  type: 'UINT16' | 'UINT32' | 'FLOAT32' | 'BOOL';
  value: string;
  access: 'R' | 'R/W';
}

/**
 * Contrato de Rotas para o Back-end da Aplicação (REST & WebSocket)
 */
export interface BackendEndpointsContract {
  // Autenticação
  login: {
    method: 'POST';
    url: '/api/auth/login';
    body: { badge: string; password?: string };
    response: { user: ShiftInfo; token: string };
  };

  // Telemetria em Tempo Real
  getTelemetry: {
    method: 'GET';
    url: '/api/scada/telemetry';
    response: {
      telemetry: PlcTelemetry;
      metrics: { oee: number; availability: number; performance: number; quality: number };
      hourlyData: HourlyDataPoint[];
    };
  };

  // Linhas de Produção
  getLines: {
    method: 'GET';
    url: '/api/scada/lines';
    response: ProductionLine[];
  };

  // Usuários / Crachás
  getUsers: {
    method: 'GET';
    url: '/api/users';
    response: UserRecord[];
  };
  createUser: {
    method: 'POST';
    url: '/api/users';
    body: Omit<UserRecord, 'id' | 'lastAccess'>;
    response: UserRecord;
  };

  // Histórico
  getHistory: {
    method: 'GET';
    url: '/api/scada/history';
    params?: { search?: string; limit?: number };
    response: HistoryRecord[];
  };

  // Configuração CLP
  testPlcConnection: {
    method: 'POST';
    url: '/api/plc/test-connection';
    body: { ip: string; port: string; opcUa: string };
    response: { success: boolean; latencyMs: number; crcErrors: number };
  };
}
