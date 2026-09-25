import React, { useState } from 'react';
import {
  ExternalLink,
  Download,
  Code,
  Check,
  Copy,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ScreenId } from '../types/scada';

interface ImageLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ImageLinksModal: React.FC<ImageLinksModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const codeSnippets = [
    {
      title: '1. Link Direto para abrir a imagem em nova aba:',
      code: `<a href="/assets/dashboard_scada_oee.png" target="_blank" rel="noopener noreferrer" class="btn-link">
  Ver Imagem do Supervisório OEE
</a>`,
    },
    {
      title: '2. Link Direto com Download automático da Imagem:',
      code: `<a href="/assets/scada_login.png" download="Stanley_SCADA_Login.png">
  Baixar Imagem da Tela de Acesso
</a>`,
    },
    {
      title: '3. Exibição direta em HTML com tag <img> e Fallback:',
      code: `<img 
  src="/assets/dashboard_scada_oee.png" 
  alt="Supervisório SCADA OS - Acompanhamento OEE [TELA 4B]" 
  width="1280" 
  height="720"
  referrerpolicy="no-referrer"
  class="border border-slate-300 rounded"
/>`,
    },
    {
      title: '4. Miniatura Clicável com visualizador Modal / Lightbox:',
      code: `<a href="#preview" onclick="openImageModal('/assets/dashboard_scada_oee.png')">
  <img src="/assets/dashboard_thumb.png" alt="Miniatura OEE" />
  <span>Clique para expandir</span>
</a>`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[4px] border border-[#cbd5e1] max-w-2xl w-full p-6 shadow-2xl font-sans max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[3px] bg-[#ea580c] flex items-center justify-center text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#0f172a] uppercase">
                Links Diretos para Imagens em HTML
              </h2>
              <p className="text-xs text-[#64748b]">
                Como vincular, referenciar e integrar as telas do SCADA OS no HTML
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#0f172a] p-1.5 rounded hover:bg-[#f1f5f9] text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto pr-1 text-xs">
          {/* Direct Answer Box */}
          <div className="p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[3px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#16a34a] font-bold text-xs uppercase">
              <Check className="w-4 h-4" />
              <span>Sim, é perfeitamente possível e nativo em HTML!</span>
            </div>
            <p className="text-[#166534] leading-relaxed">
              No HTML, você pode adicionar links diretos para qualquer imagem usando a tag{' '}
              <code className="bg-white px-1 py-0.5 rounded border border-[#bbf7d0] font-mono text-[11px]">
                &lt;a href="..." target="_blank"&gt;
              </code>
              , adicionar o atributo{' '}
              <code className="bg-white px-1 py-0.5 rounded border border-[#bbf7d0] font-mono text-[11px]">
                download
              </code>{' '}
              para salvar no computador, ou incorporar via{' '}
              <code className="bg-white px-1 py-0.5 rounded border border-[#bbf7d0] font-mono text-[11px]">
                &lt;img src="..."&gt;
              </code>
              .
            </p>
          </div>

          {/* Quick Navigation Between the Two Screens */}
          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-2 font-mono">
              Navegar Imediatamente Entre as Telas Criadas:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate('oee');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 bg-white border border-[#cbd5e1] hover:border-[#ea580c] rounded-[3px] text-left transition-all hover:shadow-xs group"
              >
                <div>
                  <div className="font-bold text-[#0f172a] group-hover:text-[#ea580c] transition-colors">
                    [TELA 4B] Dashboard OEE
                  </div>
                  <div className="text-[10px] text-[#64748b]">
                    Gauges, gráfico horário, telemetria CLP
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ea580c]" />
              </button>

              <button
                onClick={() => {
                  onNavigate('login');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 bg-white border border-[#cbd5e1] hover:border-[#ea580c] rounded-[3px] text-left transition-all hover:shadow-xs group"
              >
                <div>
                  <div className="font-bold text-[#0f172a] group-hover:text-[#ea580c] transition-colors">
                    Tela de Login / Autenticação
                  </div>
                  <div className="text-[10px] text-[#64748b]">
                    Crachá do operador e senha industrial
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ea580c]" />
              </button>
            </div>
          </div>

          {/* Code Snippets Section */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#334155] font-mono">
              Exemplos de Código HTML para Copiar:
            </div>

            {codeSnippets.map((snippet, idx) => (
              <div
                key={idx}
                className="border border-[#e2e8f0] rounded-[3px] bg-[#f8fafc] overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#f1f5f9] border-b border-[#e2e8f0]">
                  <span className="font-semibold text-[#334155] text-[11px]">
                    {snippet.title}
                  </span>
                  <button
                    onClick={() => handleCopy(snippet.code, idx)}
                    className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#006194] hover:text-[#004b73] px-2 py-0.5 bg-white rounded border border-[#cbd5e1] transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-[#16a34a]" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar HTML</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 font-mono text-[11px] text-[#0f172a] overflow-x-auto whitespace-pre leading-relaxed bg-[#fbfcfe]">
                  {snippet.code}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#e2e8f0] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            Entendido / Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
