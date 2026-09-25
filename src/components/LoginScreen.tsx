import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { ShiftInfo } from '../types/scada';

interface LoginScreenProps {
  onLoginSuccess: (user: ShiftInfo) => void;
  onOpenImageLinks: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onOpenImageLinks,
}) => {
  const [badgeUser, setBadgeUser] = useState('OP-77492-SP');
  const [password, setPassword] = useState('••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quick preset accounts
  const demoAccounts: { badge: string; name: string; role: string; level: number }[] = [
    {
      badge: 'OP-77492-SP',
      name: 'Matheus Vitorino',
      role: 'Admin',
      level: 4,
    },
    {
      badge: 'OP-33921-SP',
      name: 'Carlos Mendes',
      role: 'Engenheiro de Automação',
      level: 3,
    },
    {
      badge: 'OP-11844-SP',
      name: 'Lucas Ferreira',
      role: 'Técnico de Linha',
      level: 2,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeUser.trim()) {
      setErrorMessage('Por favor informe o crachá do operador.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      const matched = demoAccounts.find((a) => a.badge === badgeUser.trim()) || {
        badge: badgeUser.trim(),
        name: 'Operador Fabril',
        role: 'Operador',
        level: 3,
      };

      onLoginSuccess({
        id: 'shift-1',
        name: 'TURNO',
        code: 'TURNO A - MANHÃ',
        timeRange: '06:00 - 14:00',
        operator: matched.name,
        operatorBadge: matched.badge.replace('OP-', '').replace('-SP', '') || '84920',
        operatorRole: matched.role,
        operatorLevel: matched.level,
      });
    }, 400);
  };

  const handleSelectPreset = (account: typeof demoAccounts[0]) => {
    setBadgeUser(account.badge);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center justify-center p-4 select-none font-sans">
      {/* Top Bar with Brand & Image Link */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-[#ea580c] text-white font-black px-2 py-0.5 text-xs uppercase tracking-tighter rounded-[2px]">
            Stanley
          </span>
          <span className="font-mono text-xs font-bold text-[#64748b] tracking-wider uppercase">
            SCADA OS · RT-01
          </span>
        </div>

        <button
          onClick={onOpenImageLinks}
          className="text-xs font-semibold text-[#006194] bg-white border border-[#cbd5e1] hover:bg-[#eff4ff] px-3 py-1.5 rounded-[3px] transition-colors"
        >
          Ver Telas & Links HTML
        </button>
      </div>

      {/* Main Login Box matching Image 2 */}
      <div className="w-full max-w-[390px] bg-white border border-[#cbd5e1] rounded-[4px] p-7 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Usuário / Crachá */}
          <div>
            <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1.5 font-sans">
              Usuário / Crachá
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#64748b]">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={badgeUser}
                onChange={(e) => setBadgeUser(e.target.value)}
                placeholder="Ex: OP-77492-SP"
                className="w-full pl-9 pr-3 py-2 border border-[#94a3b8] rounded-[3px] text-xs font-mono font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all bg-white"
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1.5 font-sans">
              Senha
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#64748b]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full pl-9 pr-9 py-2 border border-[#94a3b8] rounded-[3px] text-xs font-mono font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#64748b] hover:text-[#0f172a] focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-[11px] font-medium text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] p-2 rounded-[3px]">
              {errorMessage}
            </div>
          )}

          {/* Botão Entrar no Sistema */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] text-white py-2.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Entrar no Sistema</span>
            )}
          </button>
        </form>

        {/* Quick select presets for rapid testing */}
        <div className="mt-5 pt-4 border-t border-[#e2e8f0]">
          <div className="text-[10px] font-bold uppercase text-[#64748b] mb-2 font-mono">
            Acesso Rápido de Teste (Crachás)
          </div>
          <div className="space-y-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.badge}
                onClick={() => handleSelectPreset(acc)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[3px] text-[11px] font-mono border transition-colors ${
                  badgeUser === acc.badge
                    ? 'bg-[#eff6ff] border-[#93c5fd] text-[#1e40af]'
                    : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9]'
                }`}
              >
                <span className="font-bold">{acc.badge}</span>
                <span className="text-[10px] text-[#64748b] font-sans">
                  {acc.name} ({acc.role})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748b]">
          <ShieldCheck className="w-3 h-3 text-[#16a34a]" />
          <span>Interlock Local Ativo · Nível 4 SHA-256</span>
        </div>
      </div>
    </div>
  );
};
