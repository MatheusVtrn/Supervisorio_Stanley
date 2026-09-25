import React, { useState } from 'react';
import { Users, UserCheck, Shield, Plus, Search, Trash2, Key } from 'lucide-react';
import { UserRecord } from '../types/scada';

export const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([
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
  ]);

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Operador de Máquina');
  const [newLevel, setNewLevel] = useState(2);
  const [newShift, setNewShift] = useState('Turno A - Manhã');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.badge.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadge || !newName) return;

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      badge: newBadge.toUpperCase(),
      name: newName,
      role: newRole,
      level: newLevel,
      shift: newShift,
      status: 'Desconectado',
      lastAccess: 'Nunca',
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewBadge('');
    setNewName('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans bg-[#f8f9ff]">
      {/* Header */}
      <div className="bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ea580c]" />
            <h1 className="text-lg font-black tracking-tight text-[#0f172a] uppercase">
              Gestão de Usuários & Crachás Operacionais
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Controle de acesso, credenciais e níveis de privilégio (ISA-101 RT-01)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Crachá</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-3 rounded-[4px] border border-[#e2e8f0] shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex items-center max-w-sm w-full">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, crachá ou cargo..."
            className="w-full pl-9 pr-3 py-1.5 border border-[#cbd5e1] rounded-[3px] text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="text-xs font-mono text-[#64748b]">
          Total: <strong className="text-[#0f172a]">{filteredUsers.length}</strong> operadores registrados
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[4px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Crachá</th>
                <th className="py-3 px-4">Nome Completo</th>
                <th className="py-3 px-4">Cargo / Função</th>
                <th className="py-3 px-4 text-center">Nível SCADA</th>
                <th className="py-3 px-4">Turno</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Último Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#0f172a]">
                    {user.badge}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0f172a]">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-[#ea580c] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                      NÍVEL {user.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748b] font-mono text-[11px]">
                    {user.shift}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
                        user.status === 'Ativo'
                          ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                          : user.status === 'Em Pausa'
                          ? 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'
                          : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Ativo'
                            ? 'bg-[#16a34a]'
                            : user.status === 'Em Pausa'
                            ? 'bg-[#d97706]'
                            : 'bg-[#94a3b8]'
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#64748b]">
                    {user.lastAccess}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-[#cbd5e1] max-w-md w-full p-5 shadow-xl font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-sm text-[#0f172a] uppercase">
                Cadastrar Novo Crachá de Operador
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#64748b] hover:text-[#0f172a] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#334155] mb-1">Código do Crachá:</label>
                <input
                  type="text"
                  placeholder="Ex: OP-66291-SP"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-[3px] p-2 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">Nome Completo:</label>
                <input
                  type="text"
                  placeholder="Nome do operador"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-[3px] p-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#334155] mb-1">Função:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border border-[#cbd5e1] rounded-[3px] p-2 text-xs"
                  >
                    <option value="Operador de Máquina">Operador de Máquina</option>
                    <option value="Técnico de Linha">Técnico de Linha</option>
                    <option value="Engenheiro de Automação">Engenheiro de Automação</option>
                    <option value="Líder de Turno">Líder de Turno</option>
                    <option value="Operador Admin">Operador Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Nível de Acesso:</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full border border-[#cbd5e1] rounded-[3px] p-2 font-mono text-xs"
                  >
                    <option value={1}>Nível 1 (Visualização)</option>
                    <option value={2}>Nível 2 (Operação Normal)</option>
                    <option value={3}>Nível 3 (Engenharia)</option>
                    <option value={4}>Nível 4 (Admin Master)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">Turno Designado:</label>
                <select
                  value={newShift}
                  onChange={(e) => setNewShift(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-[3px] p-2 text-xs"
                >
                  <option value="Turno A - Manhã [06:00 - 14:00]">Turno A - Manhã [06:00 - 14:00]</option>
                  <option value="Turno B - Tarde [14:00 - 22:00]">Turno B - Tarde [14:00 - 22:00]</option>
                  <option value="Turno C - Noite [22:00 - 06:00]">Turno C - Noite [22:00 - 06:00]</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Salvar Crachá
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#cbd5e1] rounded-[3px] text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
