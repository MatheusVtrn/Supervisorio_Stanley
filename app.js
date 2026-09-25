/**
 * Stanley SCADA OS - Supervisório Industrial OEE
 * Motor de Interface Frontend (HTML / CSS / JS Vanilla)
 * Executa 100% localmente sem CORS, sem módulos externos e preparado para integração com o Back-end.
 */

// ==========================================
// 1. CONFIGURAÇÃO DE INTEGRAÇÃO COM BACK-END
// ==========================================
const BACKEND_CONFIG = {
  // Altere para a URL do seu servidor back-end quando iniciá-lo
  apiBaseUrl: 'http://localhost:3001/api',
  // Modo mock local: mantém a aplicação interativa mesmo sem o back-end rodando
  useMock: true,
};

// ==========================================
// 2. ESTADO GLOBAL DA APLICAÇÃO (SCADA STATE)
// ==========================================
const scadaState = {
  currentScreen: 'oee', // 'login' | 'home' | 'oee' | 'users' | 'history' | 'reports' | 'plc_config'
  isLive: true,
  isOnline: true,
  isInterlockSecure: true,
  isFilterApplied: false,
  selectedPoint: null,
  customFilterModal: false,
  isImageLinksModalOpen: false,
  isAddUserModalOpen: false,
  userSearchTerm: '',
  historySearchTerm: '',

  // Operador e Turno ativo
  currentShift: {
    id: 'shift-1',
    name: 'TURNO',
    code: 'TURNO A - MANHÃ',
    timeRange: '06:00 - 14:00',
    operator: 'Matheus Vitorino',
    operatorBadge: '84920',
    operatorRole: 'Admin',
    operatorLevel: 4,
  },

  // Telemetria Industrial
  telemetry: {
    sampleRate: '100ms (10Hz)',
    commBus: 'MODBUS/TCP 502',
    opcUa: 'opc.tcp://192.168.1.100:4840',
    packetsTx: 1284992,
    packetsRx: 1284992,
    errors: 0,
    version: 'v4.18.2-PROD',
    industrialNode: 'BR-SP-04',
    lastReading: '14:00:00.000',
    interlockSecure: true,
  },

  // Índices OEE Globais
  metrics: {
    oee: 87.4,
    availability: 94.2,
    performance: 95.8,
    quality: 96.9,
  },

  // Amostragem Horária (Evolução Hora a Hora - Tela 4B)
  hourlyData: [
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
  ],

  // Linhas de Produção
  productionLines: [
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
  ],

  // Operadores e Crachás
  users: [
    {
      id: 'usr-1',
      badge: 'OP-77492-SP',
      name: 'Matheus Vitorino',
      role: 'Operador Admin',
      level: 4,
      shift: 'Turno A - Manhã',
      status: 'Ativo',
      lastAccess: 'Hoje, 10:42:18',
    },
    {
      id: 'usr-2',
      badge: 'OP-33921-SP',
      name: 'Carlos Mendes',
      role: 'Engenheiro de Automação',
      level: 3,
      shift: 'Turno A - Manhã',
      status: 'Ativo',
      lastAccess: 'Hoje, 09:15:02',
    },
    {
      id: 'usr-3',
      badge: 'OP-11844-SP',
      name: 'Lucas Ferreira',
      role: 'Técnico de Linha',
      level: 2,
      shift: 'Turno A - Manhã',
      status: 'Em Pausa',
      lastAccess: 'Hoje, 08:00:10',
    },
    {
      id: 'usr-4',
      badge: 'OP-55219-SP',
      name: 'Juliana Rocha',
      role: 'Líder de Manutenção',
      level: 3,
      shift: 'Turno B - Tarde',
      status: 'Desconectado',
      lastAccess: 'Ontem, 21:40:00',
    },
    {
      id: 'usr-5',
      badge: 'OP-99104-SP',
      name: 'Roberto Souza',
      role: 'Supervisor de Produção',
      level: 4,
      shift: 'Turno C - Noite',
      status: 'Desconectado',
      lastAccess: 'Ontem, 05:58:30',
    },
  ],

  // Histórico de Produção
  history: [
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
  ],

  // Registradores Holding Modbus
  plcRegisters: [
    { address: 'HR_40001', name: 'Ciclos_Prensa_Contador', type: 'UINT32', value: '2338', access: 'R' },
    { address: 'HR_40002', name: 'Sensor_Pressao_Hidraulica', type: 'FLOAT32', value: '184.5 BAR', access: 'R' },
    { address: 'HR_40003', name: 'Temperatura_Matriz_Estampo', type: 'FLOAT32', value: '62.4 °C', access: 'R' },
    { address: 'HR_40004', name: 'Setpoint_Cadencia_Minuto', type: 'UINT16', value: '8 pç/min', access: 'R/W' },
    { address: 'HR_40005', name: 'Status_Interlock_Cortina_Luz', type: 'BOOL', value: 'TRUE (SEGURO)', access: 'R' },
    { address: 'HR_40006', name: 'Contador_Pecas_Aprovadas', type: 'UINT32', value: '2285', access: 'R' },
    { address: 'HR_40007', name: 'Contador_Refugos_Sensor_Optico', type: 'UINT16', value: '53', access: 'R' },
    { address: 'HR_40008', name: 'Velocidade_Motor_Principal', type: 'UINT16', value: '1750 RPM', access: 'R/W' },
  ],
};

// ==========================================
// 3. ÍCONES VETORIAIS SVG EMBUTIDOS (OFFLINE)
// ==========================================
const ICONS = {
  robotArm: `<svg class="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><path d="m14 7-6 6"/><path d="M12 19h6"/><path d="m9 11 5 5"/></svg>`,
  home: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  barChart: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  users: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  database: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
  printer: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
  sliders: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>`,
  logout: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  shieldCheck: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
  clock: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  user: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  image: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  trendingUp: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  zap: `<svg class="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  gauge: `<svg class="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  checkCircle: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  alertTriangle: `<svg class="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
  arrowRight: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  calendar: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  filter: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  download: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  search: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`,
  plus: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  lock: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  eye: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  cpu: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  network: `<svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
  copy: `<svg class="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  check: `<svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

// ==========================================
// 4. FUNÇÕES DE NAVEGAÇÃO E CONTROLE
// ==========================================
function navigateTo(screenId) {
  scadaState.currentScreen = screenId;
  renderApp();
}

function toggleOnline() {
  scadaState.isOnline = !scadaState.isOnline;
  renderApp();
}

function toggleLive() {
  scadaState.isLive = !scadaState.isLive;
  renderApp();
}

function openImageModal() {
  scadaState.isImageLinksModalOpen = true;
  renderApp();
}

function closeImageModal() {
  scadaState.isImageLinksModalOpen = false;
  renderApp();
}

function setSelectedHourlyPoint(index) {
  if (index === null) {
    scadaState.selectedPoint = null;
  } else {
    scadaState.selectedPoint = scadaState.hourlyData[index];
  }
  renderApp();
}

function openCustomFilter() {
  scadaState.customFilterModal = true;
  renderApp();
}

function closeCustomFilter() {
  scadaState.customFilterModal = false;
  renderApp();
}

function openAddUserModal() {
  scadaState.isAddUserModalOpen = true;
  renderApp();
}

function closeAddUserModal() {
  scadaState.isAddUserModalOpen = false;
  renderApp();
}

function handleAddUserSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const badge = form.badge.value.trim().toUpperCase();
  const name = form.name.value.trim();
  const role = form.role.value;
  const level = parseInt(form.level.value, 10);
  const shift = form.shift.value;

  if (!badge || !name) return;

  const newUser = {
    id: `usr-${Date.now()}`,
    badge,
    name,
    role,
    level,
    shift,
    status: 'Ativo',
    lastAccess: 'Agora',
  };

  scadaState.users.unshift(newUser);
  scadaState.isAddUserModalOpen = false;
  renderApp();
}

function exportCsvHistory() {
  const headers = 'ID,Timestamp,Lote,Turno,OEE,Disponibilidade,Performance,Qualidade,Produzidas,Refugo,Status_CLP\n';
  const rows = scadaState.history
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
}

function handleTestPlc() {
  const btn = document.getElementById('btn-test-plc');
  const alertBox = document.getElementById('plc-test-alert');
  if (btn) btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> <span>Pingando CLP...</span>`;

  setTimeout(() => {
    if (btn) btn.innerHTML = `${ICONS.network} <span>Testar Comunicação</span>`;
    if (alertBox) {
      alertBox.classList.remove('hidden');
    }
  }, 600);
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const badge = form.badgeUser.value.trim();
  const btn = document.getElementById('btn-login-submit');
  if (btn) btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>`;

  setTimeout(() => {
    const matched = scadaState.users.find((u) => u.badge.toLowerCase() === badge.toLowerCase());
    if (matched) {
      scadaState.currentShift.operator = matched.name;
      scadaState.currentShift.operatorBadge = matched.badge.replace('OP-', '').replace('-SP', '');
      scadaState.currentShift.operatorRole = matched.role;
      scadaState.currentShift.operatorLevel = matched.level;
    }
    scadaState.currentScreen = 'oee';
    renderApp();
  }, 400);
}

function handlePresetLogin(badge) {
  const input = document.getElementById('input-badge-user');
  if (input) input.value = badge;
}

// ==========================================
// 5. RELÓGIOS EM TEMPO REAL E SIMULADOR CLP
// ==========================================
function startClocks() {
  setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');

    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');

    const localEl = document.getElementById('scada-local-time');
    const utcEl = document.getElementById('scada-utc-time');
    const lastReadingEl = document.getElementById('scada-last-reading');

    if (localEl) localEl.textContent = `${hours}:${mins}:${secs}.${ms}`;
    if (utcEl) utcEl.textContent = `${utcHours}:${utcMins}:${utcSecs}`;
    if (lastReadingEl && scadaState.isLive && scadaState.isOnline) {
      lastReadingEl.textContent = `${hours}:${mins}:${secs}.${ms}`;
    }
  }, 50);

  // Micro-oscilação realista do OEE e contadores de pacotes CLP
  setInterval(() => {
    if (!scadaState.isLive || !scadaState.isOnline) return;

    scadaState.telemetry.packetsTx += Math.floor(Math.random() * 8) + 4;
    scadaState.telemetry.packetsRx += Math.floor(Math.random() * 8) + 4;

    const delta = (Math.random() - 0.48) * 0.1;
    scadaState.metrics.oee = Math.min(99.9, Math.max(85.0, Number((scadaState.metrics.oee + delta).toFixed(1))));

    const oeeValEl = document.getElementById('scada-metric-oee-val');
    const txRxEl = document.getElementById('scada-packets-txrx');
    if (oeeValEl) oeeValEl.textContent = scadaState.metrics.oee.toFixed(1);
    if (txRxEl) txRxEl.textContent = `${scadaState.telemetry.packetsTx.toLocaleString('pt-BR')} / ${scadaState.telemetry.errors} ERROS`;
  }, 1500);
}

// ==========================================
// 6. GERADOR DE GAUGES CIRCULARES (DONUT SVG)
// ==========================================
function renderDonutGaugeSvg(value, color, iconHtml, size = 96, strokeWidth = 10) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return `
    <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
      <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke="#f1f5f9" stroke-width="${strokeWidth}" fill="none"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke="${color}" stroke-width="${strokeWidth}" fill="none"
          stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round"
          class="transition-all duration-700 ease-out"/>
      </svg>
      <div class="absolute flex items-center justify-center" style="color: ${color};">
        ${iconHtml}
      </div>
    </div>
  `;
}

// ==========================================
// 7. GERADOR DO GRÁFICO SVG INTERATIVO OEE
// ==========================================
function renderEvolutionChartSvg() {
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 60;
  const paddingY = 35;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  const minY = 70;
  const maxY = 100;
  const getY = (val) => chartHeight - paddingY - ((val - minY) / (maxY - minY)) * graphHeight;
  const getX = (idx) => paddingX + (idx / (scadaState.hourlyData.length - 1)) * graphWidth;

  const linePoints = scadaState.hourlyData.map((d, i) => `${getX(i)},${getY(d.oee)}`);
  const linePath = `M ${linePoints.join(' L ')}`;
  const areaPath = `M ${getX(0)},${chartHeight - paddingY} L ${linePoints.join(' L ')} L ${getX(scadaState.hourlyData.length - 1)},${chartHeight - paddingY} Z`;
  const targetY = getY(85.0);

  const pointsSvg = scadaState.hourlyData
    .map((d, i) => {
      const cx = getX(i);
      const cy = getY(d.oee);
      const isUnderTarget = d.oee < 85.0;
      const pointColor = isUnderTarget ? '#dc2626' : '#16a34a';

      return `
        <g class="cursor-pointer group" onclick="setSelectedHourlyPoint(${i})">
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${chartHeight - paddingY}" stroke="${isUnderTarget ? '#fecaca' : '#bbf7d0'}" stroke-width="1.5" stroke-dasharray="2 2" />
          <circle cx="${cx}" cy="${cy}" r="8" fill="white" stroke="${pointColor}" stroke-width="3" class="transition-transform hover:scale-125" />
          <circle cx="${cx}" cy="${cy}" r="3.5" fill="${pointColor}" />
          <foreignObject x="${cx - 32}" y="${cy - 36}" width="64" height="26" class="overflow-visible">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-center font-mono text-[11px] font-bold py-0.5 px-1 rounded-[3px] border shadow-xs transition-transform hover:-translate-y-1 ${
              d.isPeak ? 'bg-[#16a34a] text-white border-[#15803d]' : isUnderTarget ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' : 'bg-white text-[#0f172a] border-[#cbd5e1]'
            }">
              ${d.oee.toFixed(1)}%
            </div>
          </foreignObject>
        </g>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="w-full h-auto select-none">
      <defs>
        <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#16a34a" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#16a34a" stop-opacity="0.01" />
        </linearGradient>
      </defs>
      <!-- Diretrizes de grade -->
      <line x1="${paddingX}" y1="${getY(100)}" x2="${chartWidth - paddingX}" y2="${getY(100)}" stroke="#e2e8f0" stroke-width="1" />
      <line x1="${paddingX}" y1="${getY(90)}" x2="${chartWidth - paddingX}" y2="${getY(90)}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4" />
      <line x1="${paddingX}" y1="${targetY}" x2="${chartWidth - paddingX}" y2="${targetY}" stroke="#ea580c" stroke-width="2" stroke-dasharray="6 4" />
      <line x1="${paddingX}" y1="${getY(80)}" x2="${chartWidth - paddingX}" y2="${getY(80)}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4" />
      <line x1="${paddingX}" y1="${getY(70)}" x2="${chartWidth - paddingX}" y2="${getY(70)}" stroke="#cbd5e1" stroke-width="1" />

      <!-- Área sombreada -->
      <path d="${areaPath}" fill="url(#oeeGradient)" />
      <!-- Linha da curva -->
      <path d="${linePath}" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Pontos interativos -->
      ${pointsSvg}
    </svg>
  `;
}

// ==========================================
// 8. RENDERIZADORES DAS TELAS (COMPONENTS)
// ==========================================

// Header Superior
function renderHeader() {
  const shift = scadaState.currentShift;
  return `
    <header class="w-full bg-white border-b border-[#e2e8f0] px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none text-xs">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 cursor-pointer" onclick="navigateTo('home')">
          <div class="flex items-center gap-1.5">
            <span class="bg-[#ea580c] text-white font-extrabold px-1.5 py-0.5 tracking-tighter text-sm uppercase rounded-[2px] font-sans">
              Stanley
            </span>
            <div class="flex flex-col">
              <div class="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#64748b] uppercase leading-tight">
                Supervisório
              </div>
              <div class="text-xs font-black tracking-tight text-[#0f172a] uppercase leading-none">
                SCADA OS
              </div>
            </div>
          </div>
          <div class="ml-1 text-[#ea580c] flex items-center" title="Controlador Robótico SCADA RT-01">
            ${ICONS.robotArm}
          </div>
        </div>

        <div class="h-6 w-px bg-[#e2e8f0] hidden md:block"></div>

        <!-- Botão ONLINE/OFFLINE -->
        <button onclick="toggleOnline()" class="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-mono text-[11px] font-semibold transition-colors border ${
          scadaState.isOnline ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0] hover:bg-[#dcfce7]' : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca] hover:bg-[#fee2e2]'
        }">
          <span class="w-2 h-2 rounded-full ${scadaState.isOnline ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'}"></span>
          <span>${scadaState.isOnline ? 'ONLINE' : 'OFFLINE CLP'}</span>
        </button>

        <!-- Badge de Turno -->
        <div class="hidden lg:flex items-center gap-1.5 bg-[#fffbeb] text-[#b45309] border border-[#fde68a] px-2.5 py-1 rounded-[3px] font-mono text-[11px]">
          ${ICONS.clock}
          <span class="font-semibold uppercase tracking-tight">
            ${shift.name}: ${shift.code} [${shift.timeRange}]
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3 md:gap-4 ml-auto">
        <!-- Relógio SCADA em Tempo Real -->
        <div class="flex items-center gap-2 font-mono text-[11px] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded-[3px]">
          <div class="flex items-center gap-1">
            <span class="text-[#64748b] text-[10px] uppercase font-sans font-semibold">LOCAL</span>
            <span id="scada-local-time" class="font-bold text-[#0f172a] tabular-nums">14:00:00.000</span>
          </div>
          <div class="w-px h-3 bg-[#cbd5e1]"></div>
          <div class="flex items-center gap-1 text-[#64748b]">
            <span class="text-[10px] uppercase font-sans">UTC</span>
            <span id="scada-utc-time" class="tabular-nums">17:00:00</span>
          </div>
        </div>

        <!-- Badge do Operador -->
        <div class="flex items-center gap-1.5 bg-white border border-[#e2e8f0] px-2.5 py-1 rounded-[3px] text-[11px]">
          <span class="text-[#334155] font-medium hidden sm:inline">Operador ${shift.operatorRole}</span>
          <span class="bg-[#ea580c] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider">
            NÍVEL ${shift.operatorLevel}
          </span>
          <span class="font-mono text-[#64748b] text-[10px] hidden md:inline">Reg. ${shift.operatorBadge}</span>
        </div>

        <!-- Botão Links Imagens HTML -->
        <button onclick="openImageModal()" class="flex items-center gap-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] border border-[#cbdbf5] px-2.5 py-1 rounded-[3px] font-sans font-semibold text-[11px] transition-colors" title="Ver Links Diretos das Imagens / HTML">
          ${ICONS.image}
          <span class="hidden sm:inline">Links Imagens HTML</span>
        </button>

        <!-- Botão Trocar Usuário / Login -->
        <button onclick="navigateTo('login')" class="text-[#64748b] hover:text-[#0f172a] p-1 border border-[#e2e8f0] rounded-[3px] hover:bg-[#f1f5f9] transition-colors" title="Trocar Usuário / Login">
          ${ICONS.user}
        </button>
      </div>
    </header>
  `;
}

// Sidebar Lateral
function renderSidebar() {
  const current = scadaState.currentScreen;
  const items = [
    { id: 'home', label: 'Menu Principal / Home', icon: ICONS.home },
    { id: 'oee', label: 'Dashboards & OEE', icon: ICONS.barChart },
    { id: 'users', label: 'Gestão de Usuários', icon: ICONS.users },
    { id: 'history', label: 'Consulta BD / Histórico', icon: ICONS.database },
    { id: 'reports', label: 'Imprimir Relatórios', icon: ICONS.printer },
    { id: 'plc_config', label: 'Configurações CLP', icon: ICONS.sliders },
  ];

  const buttons = items
    .map((item) => {
      const isActive = current === item.id;
      return `
        <button onclick="navigateTo('${item.id}')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] text-xs font-medium transition-all text-left ${
        isActive ? 'bg-[#ea580c] text-white font-semibold shadow-sm' : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
      }">
          <span class="${isActive ? 'text-white' : 'text-[#64748b]'}">${item.icon}</span>
          <span class="truncate">${item.label}</span>
        </button>
      `;
    })
    .join('');

  return `
    <aside class="w-64 shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col justify-between select-none">
      <div>
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <span class="text-[11px] font-bold tracking-wider text-[#64748b] uppercase font-sans">
            Navegação Principal
          </span>
          <span class="font-mono text-[10px] font-semibold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-1.5 py-0.5 rounded-[2px]">
            RT-01
          </span>
        </div>
        <nav class="p-2 space-y-1">
          ${buttons}
        </nav>
      </div>

      <div class="p-3 border-t border-[#e2e8f0] space-y-2 bg-[#f8fafc]">
        <div class="flex items-center justify-between px-2 py-1.5 bg-white border border-[#e2e8f0] rounded-[3px] text-[11px]">
          <div class="flex items-center gap-1.5 text-[#64748b] font-sans">
            ${ICONS.shieldCheck}
            <span class="text-[10px] uppercase font-semibold">Interlock Host</span>
          </div>
          <span class="font-mono font-bold text-[10px] tracking-wider text-[#16a34a]">
            ${scadaState.isInterlockSecure ? 'SEGURO' : 'ALERTA'}
          </span>
        </div>

        <button onclick="navigateTo('login')" class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-[#fef2f2] text-[#64748b] hover:text-[#dc2626] border border-[#e2e8f0] hover:border-[#fecaca] rounded-[3px] text-xs font-semibold transition-colors">
          ${ICONS.logout}
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  `;
}

// Tela: Dashboards & OEE [TELA 4B]
function renderOeeScreen() {
  const m = scadaState.metrics;
  const t = scadaState.telemetry;

  return `
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      <!-- Header Banner -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm font-bold text-[#ea580c] tracking-tight">[TELA 4B]</span>
            <h1 class="text-lg md:text-xl font-black tracking-tight text-[#0f172a] uppercase">
              Dashboards Industriais - Acompanhamento OEE
            </h1>
          </div>
          <p class="text-xs text-[#64748b] mt-0.5 font-medium">
            Overall Equipment Effectiveness - Cálculo Integrado de Produtividade Stanley
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="openCustomFilter()" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#cbd5e1] rounded-[3px] text-xs font-semibold transition-colors">
            ${ICONS.sliders}
            <span>Personalizado</span>
          </button>

          <button onclick="toggleLive()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all ${
            scadaState.isLive ? 'bg-[#ea580c] text-white shadow-sm' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }">
            ${ICONS.trendingUp}
            <span>OEE</span>
            <span class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              scadaState.isLive ? 'bg-black/20 text-white' : 'bg-slate-400 text-white'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${scadaState.isLive ? 'bg-white animate-ping' : 'bg-white'}"></span>
              ${scadaState.isLive ? 'live' : 'pausado'}
            </span>
          </button>
        </div>
      </div>

      <!-- Barra de Filtros -->
      <div class="bg-white p-3.5 rounded-[4px] border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div class="flex flex-wrap items-center gap-3 md:gap-4">
          <div class="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-[3px]">
            ${ICONS.calendar}
            <span class="text-[11px] font-bold text-[#64748b] font-mono uppercase">DATA:</span>
            <input type="date" value="2026-09-24" class="font-mono text-xs font-bold text-[#0f172a] bg-transparent border-none focus:outline-none cursor-pointer" />
          </div>

          <div class="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-[3px]">
            ${ICONS.clock}
            <span class="text-[11px] font-bold text-[#64748b] font-mono uppercase">JANELA DE TEMPO:</span>
            <select class="font-mono text-xs font-bold text-[#0f172a] bg-transparent border-none focus:outline-none cursor-pointer">
              <option>08:00 - 14:00 (Turno Atual)</option>
              <option>06:00 - 14:00 (Turno A Completo)</option>
              <option>Últimas 4 Horas</option>
              <option>Tempo Real (Última Hora)</option>
            </select>
          </div>
        </div>

        <button onclick="applyFilters()" class="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ml-auto">
          <span id="filter-btn-icon">${ICONS.filter}</span>
          <span id="filter-btn-text">Aplicar Filtros</span>
        </button>
      </div>

      <!-- Grid dos 4 Cards Donut Gauges -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <!-- OEE ATUAL -->
        <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <h2 class="text-sm font-black tracking-tight text-[#0f172a] uppercase">OEE ATUAL</h2>
            <span class="flex items-center gap-1 text-[10px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
              DENTRO DA META
            </span>
          </div>
          <div class="flex items-center justify-between mt-3">
            ${renderDonutGaugeSvg(m.oee, '#16a34a', ICONS.gauge)}
            <div class="text-right">
              <span id="scada-metric-oee-val" class="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">${m.oee.toFixed(1)}</span>
              <span class="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div class="text-[10px] font-mono text-[#64748b] mt-1">Alvo Stanley: <span class="text-[#0f172a] font-bold">85.0%</span></div>
            </div>
          </div>
        </div>

        <!-- DISPONIBILIDADE -->
        <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <h2 class="text-sm font-black tracking-tight text-[#0f172a] uppercase">DISPONIBILIDADE</h2>
            <span class="flex items-center gap-1 text-[10px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
              DENTRO DA META
            </span>
          </div>
          <div class="flex items-center justify-between mt-3">
            ${renderDonutGaugeSvg(m.availability, '#10b981', ICONS.clock)}
            <div class="text-right">
              <span class="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">${m.availability.toFixed(1)}</span>
              <span class="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div class="text-[10px] font-mono text-[#64748b] mt-1">Operação: <span class="text-[#0f172a] font-bold">342 min / 360</span></div>
            </div>
          </div>
        </div>

        <!-- PERFORMANCE -->
        <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <h2 class="text-sm font-black tracking-tight text-[#0f172a] uppercase">PERFORMANCE</h2>
            <span class="flex items-center gap-1 text-[10px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
              DENTRO DA META
            </span>
          </div>
          <div class="flex items-center justify-between mt-3">
            ${renderDonutGaugeSvg(m.performance, '#0284c7', ICONS.zap)}
            <div class="text-right">
              <span class="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">${m.performance.toFixed(1)}</span>
              <span class="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div class="text-[10px] font-mono text-[#64748b] mt-1">Velocidade CLP: <span class="text-[#0f172a] font-bold">450 pç/h</span></div>
            </div>
          </div>
        </div>

        <!-- QUALIDADE -->
        <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <h2 class="text-sm font-black tracking-tight text-[#0f172a] uppercase">QUALIDADE</h2>
            <span class="flex items-center gap-1 text-[10px] font-mono font-bold text-[#d97706] bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded-[2px]">
              ${ICONS.alertTriangle}
              ATENÇÃO
            </span>
          </div>
          <div class="flex items-center justify-between mt-3">
            ${renderDonutGaugeSvg(m.quality, '#f59e0b', ICONS.checkCircle)}
            <div class="text-right">
              <span class="font-mono text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums">${m.quality.toFixed(1)}</span>
              <span class="text-sm font-mono font-bold text-[#64748b] ml-0.5">%</span>
              <div class="text-[10px] font-mono text-[#64748b] mt-1">Aprovadas: <span class="text-[#0f172a] font-bold">2.285 / 2.338</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Gráfico Evolução Hora a Hora -->
      <div class="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div class="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-start gap-2">
            <span class="text-[#ea580c] mt-0.5">${ICONS.trendingUp}</span>
            <div>
              <h2 class="text-base font-black tracking-tight text-[#0f172a] uppercase">Evolução Hora a Hora</h2>
              <p class="text-xs text-[#64748b] font-medium">Tendência temporal contínua e amostragem em tempo real (08:00 - 14:00)</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div class="flex items-center gap-1.5 text-[#ea580c] font-semibold">
              <span class="w-4 h-0 border-t-2 border-dashed border-[#ea580c]"></span>
              <span>META DE EFICIÊNCIA (85.0%)</span>
            </div>
            <div class="flex items-center gap-1.5 text-[#16a34a] font-semibold">
              <span class="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
              <span>OEE REALIZADO</span>
            </div>
            <div class="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-2 py-0.5 rounded-[2px] text-[11px] font-bold">
              6 INTERVALOS ATIVOS
            </div>
          </div>
        </div>

        <div class="p-4 bg-white overflow-x-auto">
          <div class="min-w-[760px] relative">
            <div class="flex items-center justify-between text-[11px] font-mono text-[#64748b] px-6 mb-1">
              <span>100% Capacidade Teórica</span>
              <span class="text-[#ea580c] font-bold">--- LINHA DE META OPERACIONAL (85.0%) ---</span>
              <span class="text-[#dc2626]">70% Limite Crítico</span>
            </div>

            <div class="relative border border-[#e2e8f0] rounded-[3px] bg-[#f8fafc]/50 p-2">
              ${renderEvolutionChartSvg()}

              <!-- Rótulos do Eixo X -->
              <div class="grid grid-cols-6 text-center text-xs font-mono pt-2 border-t border-[#e2e8f0]">
                ${scadaState.hourlyData
                  .map(
                    (d, i) => `
                    <div onclick="setSelectedHourlyPoint(${i})" class="cursor-pointer hover:bg-[#f1f5f9] py-1 rounded transition-colors">
                      <div class="font-bold text-[#0f172a]">${d.hour}</div>
                      <div class="text-[10px] uppercase font-semibold ${
                        d.status === 'alarm' ? 'text-[#dc2626]' : d.isPeak ? 'text-[#16a34a] font-bold' : 'text-[#64748b]'
                      }">
                        ${d.label}
                      </div>
                    </div>
                  `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Barra de Barramento CLP -->
        <div class="bg-[#f8fafc] border-t border-[#e2e8f0] px-4 py-2 text-[11px] font-mono flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div class="flex items-center gap-1.5 text-[#16a34a]">
            <span class="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
            <span class="text-[#64748b]">TAXA AMOSTRAGEM:</span>
            <span class="font-bold text-[#0f172a]">${t.sampleRate}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[#64748b]">COMM BUS:</span>
            <span class="font-bold text-[#16a34a]">${t.commBus}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[#64748b]">OPC-UA:</span>
            <span class="font-bold text-[#0284c7]">${t.opcUa}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[#64748b]">PACOTES TX/RX:</span>
            <span id="scada-packets-txrx" class="font-bold text-[#0f172a]">
              ${t.packetsTx.toLocaleString('pt-BR')} / ${t.errors} ERROS
            </span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[#64748b]">STANLEY SCADA OS:</span>
            <span class="font-bold text-[#ea580c]">${t.version}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[#64748b]">NÓ INDUSTRIAL:</span>
            <span class="font-bold text-[#0f172a]">${t.industrialNode}</span>
          </div>
        </div>

        <!-- Barra de Resumo de Eficiência -->
        <div class="bg-white border-t border-[#e2e8f0] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="text-[#16a34a]">${ICONS.trendingUp}</span>
            <span class="text-[#0f172a] font-semibold">
              Pico de Eficiência: <strong class="text-[#16a34a]">13:00 - 14:00 (OEE 91.3%)</strong>
            </span>
            <span class="text-[#cbd5e1]">|</span>
            <span class="text-[#64748b]">
              Desvio em Relação à Meta: <strong class="text-[#16a34a]">+6.3% acima do alvo</strong>
            </span>
          </div>
          <div class="flex items-center gap-2 text-[#64748b] text-[11px]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
            <span>Última leitura CLP:</span>
            <span id="scada-last-reading" class="font-bold text-[#0f172a] tabular-nums">${t.lastReading}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Tela: Menu Principal / Home
function renderHomeScreen() {
  const cards = scadaState.productionLines
    .map(
      (line) => `
      <div class="bg-white rounded-[4px] border border-[#e2e8f0] p-4 shadow-sm hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between pb-2 border-b border-[#e2e8f0]">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-xs text-[#ea580c]">[${line.id}]</span>
                <h2 class="font-bold text-sm text-[#0f172a]">${line.name}</h2>
              </div>
              <div class="text-[11px] font-mono text-[#64748b] mt-0.5">
                CLP: ${line.clpNode} · ${line.activeShift}
              </div>
            </div>
            <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] border" style="background-color: ${line.statusColor}15; border-color: ${line.statusColor}40; color: ${line.statusColor};">
              ● ${line.status}
            </span>
          </div>

          <div class="grid grid-cols-4 gap-2 py-3 text-center font-mono">
            <div class="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
              <div class="text-[10px] text-[#64748b]">OEE</div>
              <div class="font-bold text-sm text-[#0f172a]">${line.oee}%</div>
            </div>
            <div class="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
              <div class="text-[10px] text-[#64748b]">DISP.</div>
              <div class="font-bold text-sm text-[#16a34a]">${line.availability}%</div>
            </div>
            <div class="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
              <div class="text-[10px] text-[#64748b]">PERF.</div>
              <div class="font-bold text-sm text-[#0284c7]">${line.performance}%</div>
            </div>
            <div class="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
              <div class="text-[10px] text-[#64748b]">QUAL.</div>
              <div class="font-bold text-sm text-[#ea580c]">${line.quality}%</div>
            </div>
          </div>

          <div class="text-[11px] text-[#334155] space-y-1 pt-1 font-sans">
            <div class="flex justify-between">
              <span class="text-[#64748b]">Velocidade Atual vs Alvo:</span>
              <span class="font-mono font-bold text-[#0f172a]">${line.currentSpeed} / ${line.targetSpeed}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#64748b]">Operador Responsável:</span>
              <span class="font-mono font-medium text-[#0f172a]">${line.operator}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-[#e2e8f0] flex justify-end">
          <button onclick="navigateTo('oee')" class="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1 uppercase tracking-wider">
            <span>Ver Telemetria Detalhada</span>
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    `
    )
    .join('');

  return `
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold bg-[#eff6ff] text-[#0284c7] border border-[#bfdbfe] px-2 py-0.5 rounded-[2px]">
              PLANTA INDUSTRIAL BR-SP
            </span>
            <h1 class="text-lg font-black tracking-tight text-[#0f172a] uppercase">
              Menu Principal · Status Geral de Manufatura
            </h1>
          </div>
          <p class="text-xs text-[#64748b] mt-0.5">
            Supervisão centralizada de linhas automatizadas e telemetria de produção
          </p>
        </div>

        <button onclick="navigateTo('oee')" class="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
          <span>Acessar [TELA 4B] OEE</span>
          ${ICONS.arrowRight}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        ${cards}
      </div>
    </div>
  `;
}

// Tela: Gestão de Usuários
function renderUsersScreen() {
  const filtered = scadaState.users.filter((u) => {
    const s = scadaState.userSearchTerm.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.badge.toLowerCase().includes(s) || u.role.toLowerCase().includes(s);
  });

  const rows = filtered
    .map(
      (u) => `
      <tr class="hover:bg-[#f8fafc] transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-[#0f172a]">${u.badge}</td>
        <td class="py-3 px-4 font-medium text-[#0f172a]">${u.name}</td>
        <td class="py-3 px-4 text-[#334155]">${u.role}</td>
        <td class="py-3 px-4 text-center">
          <span class="bg-[#ea580c] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
            NÍVEL ${u.level}
          </span>
        </td>
        <td class="py-3 px-4 text-[#64748b] font-mono text-[11px]">${u.shift}</td>
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
            u.status === 'Ativo' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]' : u.status === 'Em Pausa' ? 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]' : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
          }">
            <span class="w-1.5 h-1.5 rounded-full ${u.status === 'Ativo' ? 'bg-[#16a34a]' : u.status === 'Em Pausa' ? 'bg-[#d97706]' : 'bg-[#94a3b8]'}"></span>
            ${u.status}
          </span>
        </td>
        <td class="py-3 px-4 font-mono text-[11px] text-[#64748b]">${u.lastAccess}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[#ea580c]">${ICONS.users}</span>
            <h1 class="text-lg font-black tracking-tight text-[#0f172a] uppercase">Gestão de Usuários & Crachás Operacionais</h1>
          </div>
          <p class="text-xs text-[#64748b] mt-0.5">Controle de acesso, credenciais e níveis de privilégio (ISA-101 RT-01)</p>
        </div>

        <button onclick="openAddUserModal()" class="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
          ${ICONS.plus}
          <span>Cadastrar Novo Crachá</span>
        </button>
      </div>

      <div class="bg-white p-3 rounded-[4px] border border-[#e2e8f0] shadow-sm flex items-center justify-between gap-3">
        <div class="relative flex items-center max-w-sm w-full">
          <span class="absolute left-3 text-[#64748b]">${ICONS.search}</span>
          <input type="text" oninput="handleUserSearch(this.value)" value="${scadaState.userSearchTerm}" placeholder="Buscar por nome, crachá ou cargo..." class="w-full pl-9 pr-3 py-1.5 border border-[#cbd5e1] rounded-[3px] text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#ea580c]" />
        </div>
        <div class="text-xs font-mono text-[#64748b]">
          Total: <strong class="text-[#0f172a]">${filtered.length}</strong> operadores registrados
        </div>
      </div>

      <div class="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th class="py-3 px-4">Crachá</th>
                <th class="py-3 px-4">Nome Completo</th>
                <th class="py-3 px-4">Cargo / Função</th>
                <th class="py-3 px-4 text-center">Nível SCADA</th>
                <th class="py-3 px-4">Turno</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4">Último Acesso</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e2e8f0]">
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function handleUserSearch(term) {
  scadaState.userSearchTerm = term;
  renderApp();
}

// Tela: Consulta BD / Histórico
function renderHistoryScreen() {
  const filtered = scadaState.history.filter((r) => {
    const s = scadaState.historySearchTerm.toLowerCase();
    return r.batchId.toLowerCase().includes(s) || r.timestamp.includes(s) || r.plcStatus.toLowerCase().includes(s);
  });

  const rows = filtered
    .map(
      (r) => `
      <tr class="hover:bg-[#f8fafc] transition-colors font-mono">
        <td class="py-3 px-4 font-bold text-[#0f172a]">${r.id}</td>
        <td class="py-3 px-4 text-[#64748b] text-[11px]">${r.timestamp}</td>
        <td class="py-3 px-4 text-[#006194] font-semibold">${r.batchId}</td>
        <td class="py-3 px-4 text-center">
          <span class="px-2 py-0.5 rounded-[2px] font-bold ${
            r.oee >= 85.0 ? 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]' : 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
          }">
            ${r.oee.toFixed(1)}%
          </span>
        </td>
        <td class="py-3 px-4 text-center text-[#16a34a]">${r.availability.toFixed(1)}%</td>
        <td class="py-3 px-4 text-center text-[#0284c7]">${r.performance.toFixed(1)}%</td>
        <td class="py-3 px-4 text-center text-[#ea580c]">${r.quality.toFixed(1)}%</td>
        <td class="py-3 px-4 text-right font-bold text-[#0f172a]">${r.productionCount} pçs</td>
        <td class="py-3 px-4 text-right text-[#dc2626] font-semibold">${r.scrapCount} pçs</td>
        <td class="py-3 px-4 text-center">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-[2px] ${r.plcStatus === 'NOMINAL_RUN' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#fffbeb] text-[#d97706]'}">
            ${r.plcStatus}
          </span>
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[#ea580c]">${ICONS.database}</span>
            <h1 class="text-lg font-black tracking-tight text-[#0f172a] uppercase">Consulta BD / Histórico Telemétrico OEE</h1>
          </div>
          <p class="text-xs text-[#64748b] mt-0.5">Registros de produtividade, telemetria de CLP e auditoria de bateladas</p>
        </div>

        <button onclick="exportCsvHistory()" class="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
          ${ICONS.download}
          <span>Exportar Dados (.CSV)</span>
        </button>
      </div>

      <div class="bg-white p-3 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div class="relative flex items-center max-w-sm w-full">
          <span class="absolute left-3 text-[#64748b]">${ICONS.search}</span>
          <input type="text" oninput="handleHistorySearch(this.value)" value="${scadaState.historySearchTerm}" placeholder="Buscar por lote, data ou status..." class="w-full pl-9 pr-3 py-1.5 border border-[#cbd5e1] rounded-[3px] text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#ea580c]" />
        </div>
        <div class="text-xs font-mono text-[#64748b]">
          Mostrando: <strong class="text-[#0f172a]">${filtered.length}</strong> amostragens registradas
        </div>
      </div>

      <div class="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th class="py-3 px-4">Registro</th>
                <th class="py-3 px-4">Data / Hora</th>
                <th class="py-3 px-4">Lote Batelada</th>
                <th class="py-3 px-4 text-center">OEE</th>
                <th class="py-3 px-4 text-center">Disp.</th>
                <th class="py-3 px-4 text-center">Perf.</th>
                <th class="py-3 px-4 text-center">Qual.</th>
                <th class="py-3 px-4 text-right">Produção</th>
                <th class="py-3 px-4 text-right">Refugo</th>
                <th class="py-3 px-4 text-center">Status CLP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e2e8f0]">
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function handleHistorySearch(term) {
  scadaState.historySearchTerm = term;
  renderApp();
}

// Tela: Imprimir Relatórios
function renderReportsScreen() {
  const shift = scadaState.currentShift;
  return `
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[#ea580c]">${ICONS.printer}</span>
            <h1 class="text-lg font-black tracking-tight text-[#0f172a] uppercase">Imprimir Relatórios & Laudos de OEE</h1>
          </div>
          <p class="text-xs text-[#64748b] mt-0.5">Geração de relatório consolidado para auditoria e gestão industrial Stanley</p>
        </div>

        <button onclick="window.print()" class="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
          ${ICONS.printer}
          <span>Imprimir Relatório (PDF)</span>
        </button>
      </div>

      <!-- Folha A4 do Relatório -->
      <div class="bg-white p-6 md:p-8 rounded-[4px] border border-[#cbd5e1] shadow-sm max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none">
        <div class="flex items-center justify-between pb-4 border-b-2 border-[#0f172a]">
          <div>
            <div class="flex items-center gap-2">
              <span class="bg-[#ea580c] text-white font-black px-2 py-0.5 text-sm uppercase rounded-[2px]">Stanley</span>
              <span class="font-mono text-sm font-black text-[#0f172a] tracking-wider uppercase">SCADA OS INDUSTRIAL</span>
            </div>
            <div class="text-xs text-[#64748b] mt-1 font-mono">Laudo Técnico de Produtividade & Cálculo Integrado OEE</div>
          </div>
          <div class="text-right font-mono text-xs">
            <div class="text-[10px] text-[#64748b] uppercase font-bold">Relatório Nº</div>
            <div class="font-bold text-[#0f172a]">STANLEY-OEE-2026-0924</div>
            <div class="text-[#64748b] text-[10px]">Data Emissão: 24/09/2026 14:00</div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded-[3px] border border-[#e2e8f0] font-mono text-xs">
          <div>
            <span class="text-[10px] text-[#64748b] block">LINHA DE PRODUÇÃO:</span>
            <strong class="text-[#0f172a]">Linha 01 Prensa & Estamp.</strong>
          </div>
          <div>
            <span class="text-[10px] text-[#64748b] block">TURNO ATIVO:</span>
            <strong class="text-[#0f172a]">${shift.code}</strong>
          </div>
          <div>
            <span class="text-[10px] text-[#64748b] block">OPERADOR RESPONSÁVEL:</span>
            <strong class="text-[#0f172a]">${shift.operator} (${shift.operatorBadge})</strong>
          </div>
          <div>
            <span class="text-[10px] text-[#64748b] block">INTERLOCK STATUS:</span>
            <strong class="text-[#16a34a]">SEGURO / HOMOLOGADO</strong>
          </div>
        </div>

        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-[#334155] mb-2 font-mono">Índices Globais de Eficiência (OEE)</h2>
          <table class="w-full text-left text-xs border border-[#e2e8f0]">
            <thead class="bg-[#f1f5f9] font-mono text-[11px] text-[#64748b]">
              <tr>
                <th class="p-2.5 border-b border-[#e2e8f0]">Indicador</th>
                <th class="p-2.5 border-b border-[#e2e8f0] text-center">Meta Contratual</th>
                <th class="p-2.5 border-b border-[#e2e8f0] text-center">Realizado</th>
                <th class="p-2.5 border-b border-[#e2e8f0] text-center">Desvio</th>
                <th class="p-2.5 border-b border-[#e2e8f0] text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e2e8f0] font-mono">
              <tr>
                <td class="p-2.5 font-bold text-[#0f172a]">Disponibilidade (A)</td>
                <td class="p-2.5 text-center">90.0%</td>
                <td class="p-2.5 text-center font-bold text-[#16a34a]">94.2%</td>
                <td class="p-2.5 text-center text-[#16a34a]">+4.2%</td>
                <td class="p-2.5 text-center text-[#16a34a] font-bold">CONFORME</td>
              </tr>
              <tr>
                <td class="p-2.5 font-bold text-[#0f172a]">Performance (P)</td>
                <td class="p-2.5 text-center">92.0%</td>
                <td class="p-2.5 text-center font-bold text-[#0284c7]">95.8%</td>
                <td class="p-2.5 text-center text-[#16a34a]">+3.8%</td>
                <td class="p-2.5 text-center text-[#16a34a] font-bold">CONFORME</td>
              </tr>
              <tr>
                <td class="p-2.5 font-bold text-[#0f172a]">Qualidade (Q)</td>
                <td class="p-2.5 text-center">98.0%</td>
                <td class="p-2.5 text-center font-bold text-[#d97706]">96.9%</td>
                <td class="p-2.5 text-center text-[#dc2626]">-1.1%</td>
                <td class="p-2.5 text-center text-[#d97706] font-bold">ADVERTÊNCIA</td>
              </tr>
              <tr class="bg-[#f8fafc] font-black text-sm">
                <td class="p-3 text-[#ea580c]">OEE TOTAL (A × P × Q)</td>
                <td class="p-3 text-center">85.0%</td>
                <td class="p-3 text-center text-[#16a34a] text-base">87.4%</td>
                <td class="p-3 text-center text-[#16a34a]">+2.4%</td>
                <td class="p-3 text-center text-[#16a34a]">APROVADO</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-3 gap-3 font-mono text-center">
          <div class="p-3 border border-[#e2e8f0] rounded-[3px]">
            <div class="text-[10px] text-[#64748b]">TOTAL PRODUZIDO</div>
            <div class="text-xl font-bold text-[#0f172a]">2.338 pçs</div>
          </div>
          <div class="p-3 border border-[#bbf7d0] bg-[#f0fdf4] rounded-[3px]">
            <div class="text-[10px] text-[#16a34a]">TOTAL APROVADO</div>
            <div class="text-xl font-bold text-[#16a34a]">2.285 pçs</div>
          </div>
          <div class="p-3 border border-[#fecaca] bg-[#fef2f2] rounded-[3px]">
            <div class="text-[10px] text-[#dc2626]">REFUGOS / SUCATA</div>
            <div class="text-xl font-bold text-[#dc2626]">53 pçs (2.2%)</div>
          </div>
        </div>

        <div class="pt-8 border-t border-[#cbd5e1] grid grid-cols-2 gap-8 text-center font-mono text-xs">
          <div>
            <div class="w-48 h-px bg-[#64748b] mx-auto mb-2"></div>
            <div class="font-bold text-[#0f172a]">${shift.operator}</div>
            <div class="text-[10px] text-[#64748b]">Operador Responsável · Reg. ${shift.operatorBadge}</div>
          </div>
          <div>
            <div class="w-48 h-px bg-[#64748b] mx-auto mb-2"></div>
            <div class="font-bold text-[#0f172a]">Engenharia de Processos Stanley</div>
            <div class="text-[10px] text-[#64748b]">Supervisão Industrial SCADA RT-01</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Tela: Configurações CLP
function renderPlcConfigScreen() {
  const t = scadaState.telemetry;
  const regRows = scadaState.plcRegisters
    .map(
      (reg) => `
      <tr class="hover:bg-[#f8fafc]">
        <td class="py-2.5 px-4 font-bold text-[#ea580c]">${reg.address}</td>
        <td class="py-2.5 px-4 text-[#0f172a] font-medium">${reg.name}</td>
        <td class="py-2.5 px-4 text-[#64748b]">${reg.type}</td>
        <td class="py-2.5 px-4 text-center">
          <span class="px-1.5 py-0.5 bg-[#f1f5f9] rounded text-[10px] text-[#334155] border">${reg.access}</span>
        </td>
        <td class="py-2.5 px-4 text-right font-bold text-[#0f172a]">${reg.value}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      <div class="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[#ea580c]">${ICONS.sliders}</span>
            <h1 class="text-lg font-black tracking-tight text-[#0f172a] uppercase">Configurações de Comunicação CLP & OPC-UA</h1>
          </div>
          <p class="text-xs text-[#64748b] mt-0.5">Parametrização de barramentos Modbus/TCP, Nós Industriais e Registradores</p>
        </div>

        <button id="btn-test-plc" onclick="handleTestPlc()" class="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
          ${ICONS.network}
          <span>Testar Comunicação</span>
        </button>
      </div>

      <div id="plc-test-alert" class="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[3px] flex items-center gap-2 text-xs text-[#16a34a] font-mono hidden">
        ${ICONS.check}
        <span>Handshake validado com sucesso! Latência CLP: 4.2ms · 0 Erros de CRC.</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-[4px] border border-[#e2e8f0] shadow-sm space-y-4 text-xs">
          <div class="flex items-center gap-2 pb-2 border-b border-[#e2e8f0]">
            <span class="text-[#ea580c]">${ICONS.network}</span>
            <h2 class="font-bold text-sm text-[#0f172a] uppercase">Parâmetros de Rede Industrial</h2>
          </div>

          <div class="space-y-3 font-mono">
            <div>
              <label class="block text-[#64748b] text-[11px] mb-1">ENDEREÇO IP DO CLP (MODBUS SERVER):</label>
              <input type="text" value="192.168.1.100" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[#64748b] text-[11px] mb-1">PORTA TCP:</label>
                <input type="text" value="502" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold" />
              </div>
              <div>
                <label class="block text-[#64748b] text-[11px] mb-1">NÓ INDUSTRIAL:</label>
                <input type="text" value="BR-SP-04" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold" />
              </div>
            </div>

            <div>
              <label class="block text-[#64748b] text-[11px] mb-1">ENDPOINT DO SERVIDOR OPC-UA:</label>
              <input type="text" value="opc.tcp://192.168.1.100:4840" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold text-xs" />
            </div>

            <div>
              <label class="block text-[#64748b] text-[11px] mb-1">TAXA DE POLING / AMOSTRAGEM:</label>
              <select class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] text-[#0f172a] font-bold text-xs">
                <option value="100ms">100ms (10Hz - Alta Precisão)</option>
                <option value="250ms">250ms (4Hz - Padrão)</option>
                <option value="500ms">500ms (2Hz - Econômico)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-[4px] border border-[#e2e8f0] shadow-sm space-y-4 text-xs font-mono">
          <div class="flex items-center gap-2 pb-2 border-b border-[#e2e8f0]">
            <span class="text-[#ea580c]">${ICONS.cpu}</span>
            <h2 class="font-bold text-sm text-[#0f172a] uppercase font-sans">Diagnóstico de Barramento SCADA</h2>
          </div>

          <div class="space-y-2.5">
            <div class="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span class="text-[#64748b]">Total de Pacotes Transmitidos (TX):</span>
              <strong class="text-[#0f172a]">${t.packetsTx.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span class="text-[#64748b]">Total de Pacotes Recebidos (RX):</span>
              <strong class="text-[#0f172a]">${t.packetsRx.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="flex justify-between p-2 bg-[#f0fdf4] rounded border border-[#bbf7d0]">
              <span class="text-[#16a34a]">Erros de Timeout / Paridade:</span>
              <strong class="text-[#16a34a]">${t.errors}</strong>
            </div>
            <div class="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span class="text-[#64748b]">Versão do Firmware Supervisório:</span>
              <strong class="text-[#ea580c]">${t.version}</strong>
            </div>
            <div class="flex justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span class="text-[#64748b]">Interlock de Segurança RT-01:</span>
              <strong class="text-[#16a34a]">SEGURO (Conexão Criptografada)</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div class="p-3 bg-[#f8fafc] border-b border-[#e2e8f0] font-mono text-xs font-bold text-[#334155] uppercase">
          Mapeamento de Registradores Holding (Modbus 40001 - 40008)
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[#f1f5f9] text-[#64748b] text-[10px]">
              <tr>
                <th class="py-2.5 px-4">Endereço CLP</th>
                <th class="py-2.5 px-4">Nome da Tag / Variável</th>
                <th class="py-2.5 px-4">Tipo de Dado</th>
                <th class="py-2.5 px-4 text-center">Acesso</th>
                <th class="py-2.5 px-4 text-right">Valor em Tempo Real</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e2e8f0]">
              ${regRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Tela: Login do Operador
function renderLoginScreen() {
  return `
    <div class="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center justify-center p-4 select-none font-sans relative">
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="bg-[#ea580c] text-white font-black px-2 py-0.5 text-xs uppercase tracking-tighter rounded-[2px]">Stanley</span>
          <span class="font-mono text-xs font-bold text-[#64748b] tracking-wider uppercase">SCADA OS · RT-01</span>
        </div>
        <button onclick="openImageModal()" class="text-xs font-semibold text-[#006194] bg-white border border-[#cbd5e1] hover:bg-[#eff4ff] px-3 py-1.5 rounded-[3px] transition-colors">
          Ver Telas & Links HTML
        </button>
      </div>

      <div class="w-full max-w-[390px] bg-white border border-[#cbd5e1] rounded-[4px] p-7 shadow-xs">
        <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1.5 font-sans">Usuário / Crachá</label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-[#64748b]">${ICONS.user}</span>
              <input id="input-badge-user" name="badgeUser" type="text" value="OP-77492-SP" placeholder="Ex: OP-77492-SP" class="w-full pl-9 pr-3 py-2 border border-[#94a3b8] rounded-[3px] text-xs font-mono font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all bg-white" required />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1.5 font-sans">Senha</label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-[#64748b]">${ICONS.lock}</span>
              <input id="input-password" name="password" type="password" value="123456" placeholder="Senha de acesso" class="w-full pl-9 pr-9 py-2 border border-[#94a3b8] rounded-[3px] text-xs font-mono font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all bg-white" required />
              <button type="button" onclick="togglePasswordVisibility()" class="absolute right-3 text-[#64748b] hover:text-[#0f172a] focus:outline-none">
                <span id="password-eye-icon">${ICONS.eye}</span>
              </button>
            </div>
          </div>

          <button id="btn-login-submit" type="submit" class="w-full bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] text-white py-2.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs mt-2 flex items-center justify-center gap-2">
            <span>Entrar no Sistema</span>
          </button>
        </form>

        <div class="mt-5 pt-4 border-t border-[#e2e8f0]">
          <div class="text-[10px] font-bold uppercase text-[#64748b] mb-2 font-mono">Acesso Rápido de Teste (Crachás)</div>
          <div class="space-y-1.5">
            <button onclick="handlePresetLogin('OP-77492-SP')" class="w-full flex items-center justify-between px-2 py-1.5 rounded-[3px] text-[11px] font-mono border bg-[#eff6ff] border-[#93c5fd] text-[#1e40af] hover:bg-[#dbeafe] transition-colors">
              <span class="font-bold">OP-77492-SP</span>
              <span class="text-[10px] text-[#64748b] font-sans">Matheus Vitorino (Admin Nível 4)</span>
            </button>
            <button onclick="handlePresetLogin('OP-33921-SP')" class="w-full flex items-center justify-between px-2 py-1.5 rounded-[3px] text-[11px] font-mono border bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] transition-colors">
              <span class="font-bold">OP-33921-SP</span>
              <span class="text-[10px] text-[#64748b] font-sans">Carlos Mendes (Engenheiro Nível 3)</span>
            </button>
            <button onclick="handlePresetLogin('OP-11844-SP')" class="w-full flex items-center justify-between px-2 py-1.5 rounded-[3px] text-[11px] font-mono border bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] transition-colors">
              <span class="font-bold">OP-11844-SP</span>
              <span class="text-[10px] text-[#64748b] font-sans">Lucas Ferreira (Técnico Nível 2)</span>
            </button>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748b]">
          <span class="text-[#16a34a]">${ICONS.shieldCheck}</span>
          <span>Interlock Local Ativo · Nível 4 SHA-256</span>
        </div>
      </div>
    </div>
  `;
}

function togglePasswordVisibility() {
  const input = document.getElementById('input-password');
  const icon = document.getElementById('password-eye-icon');
  if (input && icon) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.innerHTML = ICONS.eyeOff;
    } else {
      input.type = 'password';
      icon.innerHTML = ICONS.eye;
    }
  }
}

function applyFilters() {
  const icon = document.getElementById('filter-btn-icon');
  const text = document.getElementById('filter-btn-text');
  if (icon && text) {
    icon.innerHTML = ICONS.check;
    text.textContent = 'Filtros Aplicados';
    setTimeout(() => {
      icon.innerHTML = ICONS.filter;
      text.textContent = 'Aplicar Filtros';
    }, 1200);
  }
}

// ==========================================
// 9. MODAIS (DETALHES, LINKS E CADASTRO)
// ==========================================
function renderModals() {
  let modalHtml = '';

  // Modal 1: Detalhes da Amostragem Horária
  if (scadaState.selectedPoint) {
    const pt = scadaState.selectedPoint;
    modalHtml += `
      <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-[4px] border border-[#cbd5e1] max-w-md w-full p-5 shadow-xl font-sans">
          <div class="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
            <div class="flex items-center gap-2">
              <span class="text-[#ea580c]">${ICONS.gauge}</span>
              <h3 class="font-bold text-sm text-[#0f172a] uppercase">Amostragem ${pt.hour} - ${pt.tag}</h3>
            </div>
            <button onclick="setSelectedHourlyPoint(null)" class="text-[#64748b] hover:text-[#0f172a] text-sm font-bold p-1">✕</button>
          </div>

          <div class="py-4 space-y-3 font-mono text-xs">
            <div class="flex items-center justify-between p-2.5 bg-[#f8fafc] rounded-[3px] border border-[#e2e8f0]">
              <span class="text-[#64748b]">OEE CALCULADO:</span>
              <span class="font-bold text-lg text-[#0f172a]">${pt.oee.toFixed(1)}%</span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[3px]">
                <div class="text-[10px] text-[#64748b]">DISP.</div>
                <div class="font-bold text-[#16a34a]">${pt.availability}%</div>
              </div>
              <div class="p-2 bg-[#eff6ff] border border-[#bfdbfe] rounded-[3px]">
                <div class="text-[10px] text-[#64748b]">PERF.</div>
                <div class="font-bold text-[#0284c7]">${pt.performance}%</div>
              </div>
              <div class="p-2 bg-[#fffbeb] border border-[#fde68a] rounded-[3px]">
                <div class="text-[10px] text-[#64748b]">QUAL.</div>
                <div class="font-bold text-[#d97706]">${pt.quality}%</div>
              </div>
            </div>

            <div class="space-y-1.5 pt-2 text-[#334155]">
              <div class="flex justify-between">
                <span>Peças Produzidas:</span>
                <span class="font-bold text-[#0f172a]">${pt.piecesProduced} unid.</span>
              </div>
              <div class="flex justify-between">
                <span>Refugos / Defeitos:</span>
                <span class="font-bold text-[#dc2626]">${pt.scrapPieces} unid.</span>
              </div>
              <div class="flex justify-between">
                <span>Parada de Linha:</span>
                <span class="font-bold text-[#0f172a]">${pt.downtimeMinutes} min</span>
              </div>
            </div>
          </div>

          <button onclick="setSelectedHourlyPoint(null)" class="w-full mt-2 bg-[#ea580c] text-white py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider hover:bg-[#c2410c] transition-colors">
            Fechar Detalhes
          </button>
        </div>
      </div>
    `;
  }

  // Modal 2: Filtro Personalizado
  if (scadaState.customFilterModal) {
    modalHtml += `
      <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-[4px] border border-[#cbd5e1] max-w-lg w-full p-5 shadow-xl font-sans">
          <div class="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
            <div class="flex items-center gap-2">
              <span class="text-[#ea580c]">${ICONS.sliders}</span>
              <h3 class="font-bold text-sm text-[#0f172a] uppercase">Parâmetros de Amostragem SCADA</h3>
            </div>
            <button onclick="closeCustomFilter()" class="text-[#64748b] hover:text-[#0f172a] text-sm font-bold p-1">✕</button>
          </div>

          <div class="py-4 space-y-4 text-xs">
            <div>
              <label class="block font-bold text-[#334155] mb-1">Linha de Produção:</label>
              <select class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] font-mono text-xs">
                <option>Linha 01 - Prensa & Estampagem Stanley</option>
                <option>Linha 02 - Célula Robótica de Solda</option>
                <option>Linha 03 - Centro de Usinagem CNC</option>
                <option>Linha 04 - Montagem & Interlock Final</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#334155] mb-1">Meta Operacional OEE (%):</label>
              <input type="number" value="85" step="0.5" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-white font-mono text-xs" />
            </div>

            <div>
              <label class="block font-bold text-[#334155] mb-1">Amostragem de Taxa de CLP:</label>
              <select class="w-full border border-[#cbd5e1] rounded-[3px] p-2 bg-[#f8fafc] font-mono text-xs">
                <option>100ms (10Hz) - Tempo Real Ultra-rápido</option>
                <option>500ms (2Hz) - Padrão de Rede</option>
                <option>1000ms (1Hz) - Economia de Banda</option>
              </select>
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick="closeCustomFilter()" class="flex-1 bg-[#ea580c] text-white py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider hover:bg-[#c2410c] transition-colors">
              Salvar Configuração
            </button>
            <button onclick="closeCustomFilter()" class="px-4 py-2 border border-[#cbd5e1] rounded-[3px] text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9]">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Modal 3: Imagens e Links HTML
  if (scadaState.isImageLinksModalOpen) {
    modalHtml += `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-[4px] border border-[#cbd5e1] max-w-2xl w-full p-6 shadow-2xl font-sans max-h-[90vh] flex flex-col">
          <div class="flex items-start justify-between pb-3 border-b border-[#e2e8f0]">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-[3px] bg-[#ea580c] flex items-center justify-center text-white">
                ${ICONS.image}
              </div>
              <div>
                <h2 class="font-bold text-base text-[#0f172a] uppercase">Links Diretos para Imagens em HTML</h2>
                <p class="text-xs text-[#64748b]">Como referenciar e integrar as telas do SCADA OS no HTML</p>
              </div>
            </div>
            <button onclick="closeImageModal()" class="text-[#64748b] hover:text-[#0f172a] p-1.5 rounded hover:bg-[#f1f5f9] text-base font-bold">✕</button>
          </div>

          <div class="py-4 space-y-4 overflow-y-auto pr-1 text-xs">
            <div class="p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[3px] space-y-1.5">
              <div class="flex items-center gap-1.5 text-[#16a34a] font-bold text-xs uppercase">
                ${ICONS.check}
                <span>Execução 100% Nativa em HTML / CSS / JS</span>
              </div>
              <p class="text-[#166534] leading-relaxed">
                Este projeto foi estruturado com arquivos padronizados de HTML, CSS e JavaScript que você pode abrir diretamente em qualquer navegador com duplo clique no <code>index.html</code>, sem depender de servidor Node.js ou bundlers externos.
              </p>
            </div>

            <div class="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
              <div class="text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-2 font-mono">
                Navegar Diretamente Entre as Telas:
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button onclick="navigateTo('oee'); closeImageModal();" class="flex items-center justify-between p-2.5 bg-white border border-[#cbd5e1] hover:border-[#ea580c] rounded-[3px] text-left transition-all hover:shadow-xs group">
                  <div>
                    <div class="font-bold text-[#0f172a] group-hover:text-[#ea580c] transition-colors">[TELA 4B] Dashboard OEE</div>
                    <div class="text-[10px] text-[#64748b]">Gauges, gráfico horário, telemetria CLP</div>
                  </div>
                  <span class="text-[#ea580c]">${ICONS.arrowRight}</span>
                </button>

                <button onclick="navigateTo('login'); closeImageModal();" class="flex items-center justify-between p-2.5 bg-white border border-[#cbd5e1] hover:border-[#ea580c] rounded-[3px] text-left transition-all hover:shadow-xs group">
                  <div>
                    <div class="font-bold text-[#0f172a] group-hover:text-[#ea580c] transition-colors">Tela de Login / Autenticação</div>
                    <div class="text-[10px] text-[#64748b]">Crachá do operador e senha industrial</div>
                  </div>
                  <span class="text-[#ea580c]">${ICONS.arrowRight}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-[#e2e8f0] flex justify-end">
            <button onclick="closeImageModal()" class="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs">
              Entendido / Fechar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Modal 4: Cadastro de Novo Usuário
  if (scadaState.isAddUserModalOpen) {
    modalHtml += `
      <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-[4px] border border-[#cbd5e1] max-w-md w-full p-5 shadow-xl font-sans">
          <div class="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
            <h3 class="font-bold text-sm text-[#0f172a] uppercase">Cadastrar Novo Crachá de Operador</h3>
            <button onclick="closeAddUserModal()" class="text-[#64748b] hover:text-[#0f172a] text-sm font-bold">✕</button>
          </div>

          <form onsubmit="handleAddUserSubmit(event)" class="py-4 space-y-3 text-xs">
            <div>
              <label class="block font-bold text-[#334155] mb-1">Código do Crachá:</label>
              <input name="badge" type="text" placeholder="Ex: OP-66291-SP" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 font-mono text-xs" required />
            </div>

            <div>
              <label class="block font-bold text-[#334155] mb-1">Nome Completo:</label>
              <input name="name" type="text" placeholder="Nome do operador" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 text-xs" required />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold text-[#334155] mb-1">Função:</label>
                <select name="role" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 text-xs">
                  <option value="Operador de Máquina">Operador de Máquina</option>
                  <option value="Técnico de Linha">Técnico de Linha</option>
                  <option value="Engenheiro de Automação">Engenheiro de Automação</option>
                  <option value="Líder de Turno">Líder de Turno</option>
                  <option value="Operador Admin">Operador Admin</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-[#334155] mb-1">Nível de Acesso:</label>
                <select name="level" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 font-mono text-xs">
                  <option value="1">Nível 1 (Visualização)</option>
                  <option value="2" selected>Nível 2 (Operação Normal)</option>
                  <option value="3">Nível 3 (Engenharia)</option>
                  <option value="4">Nível 4 (Admin Master)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-[#334155] mb-1">Turno Designado:</label>
              <select name="shift" class="w-full border border-[#cbd5e1] rounded-[3px] p-2 text-xs">
                <option value="Turno A - Manhã [06:00 - 14:00]">Turno A - Manhã [06:00 - 14:00]</option>
                <option value="Turno B - Tarde [14:00 - 22:00]">Turno B - Tarde [14:00 - 22:00]</option>
                <option value="Turno C - Noite [22:00 - 06:00]">Turno C - Noite [22:00 - 06:00]</option>
              </select>
            </div>

            <div class="flex gap-2 pt-2">
              <button type="submit" class="flex-1 bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors">
                Salvar Crachá
              </button>
              <button type="button" onclick="closeAddUserModal()" class="px-4 py-2 border border-[#cbd5e1] rounded-[3px] text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  return modalHtml;
}

// ==========================================
// 10. RENDERIZADOR PRINCIPAL DO APLICATIVO
// ==========================================
function renderApp() {
  const root = document.getElementById('root');
  if (!root) return;

  // Se a tela for 'login', renderiza em tela cheia centralizada
  if (scadaState.currentScreen === 'login') {
    root.innerHTML = `
      ${renderLoginScreen()}
      ${renderModals()}
    `;
    return;
  }

  // Telas internas com layout industrial SCADA (Header + Sidebar + Viewport)
  let screenContent = '';
  switch (scadaState.currentScreen) {
    case 'home':
      screenContent = renderHomeScreen();
      break;
    case 'users':
      screenContent = renderUsersScreen();
      break;
    case 'history':
      screenContent = renderHistoryScreen();
      break;
    case 'reports':
      screenContent = renderReportsScreen();
      break;
    case 'plc_config':
      screenContent = renderPlcConfigScreen();
      break;
    case 'oee':
    default:
      screenContent = renderOeeScreen();
      break;
  }

  root.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0f172a] font-sans antialiased">
      ${renderHeader()}
      <div class="flex-1 flex overflow-hidden">
        ${renderSidebar()}
        <main class="flex-1 flex flex-col overflow-hidden bg-[#f8f9ff]">
          ${screenContent}
        </main>
      </div>
      ${renderModals()}
    </div>
  `;
}

// Inicialização imediata ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  startClocks();
});
