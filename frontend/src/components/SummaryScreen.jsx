import { useState } from 'react';
import { Share2, ArrowLeft, RotateCw, X } from 'lucide-react';

// Componente do Modal de Compartilhamento
function ShareModal({ onShare, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-sm p-6 text-center">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-neutral-800">Escolha o formato</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => onShare('resumo')}
            className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all"
          >
            Compartilhar Resumo
          </button>
          <button
            onClick={() => onShare('detalhado')}
            className="w-full px-6 py-4 bg-neutral-700 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-all"
          >
            Compartilhar Detalhado
          </button>
        </div>
      </div>
    </div>
  );
}


export default function SummaryScreen({ totais, divisionData, onReset, onGoBack }) {
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const rankedPessoas = [...totais.pessoas].sort((a, b) => b.total - a.total);
  const totalDaConta = totais.pessoas.reduce((sum, p) => sum + p.total, 0);

  const createShareText = (type = 'resumo') => {
    if (type === 'detalhado') {
      return createDetailedShareText();
    }
    return createSimpleShareText();
  };

  const createSimpleShareText = () => {
    let text = `=== RESUMO DA CONTA ===\n\n`;
    text += rankedPessoas.map(pessoa => {
      const nome = pessoa.nome;
      const valor = `R$ ${pessoa.total.toFixed(2)}`;
      const padding = '.'.repeat(Math.max(0, 20 - nome.length));
      return `> ${nome} ${padding} ${valor}`;
    }).join('\n');
    text += `\n\n>>> TOTAL: R$ ${totalDaConta.toFixed(2)} <<<`;
    text += `\n\n--- Dividido com Compartilha AI ---`;
    return text;
  };

  const createDetailedShareText = () => {
    if (!divisionData || !divisionData.pessoas || !divisionData.itens) {
      alert("Não foi possível gerar o relatório detalhado pois os dados da divisão estão incompletos.");
      return "Erro: Dados detalhados não disponíveis.";
    }

    let text = `=== DETALHES DA CONTA ===\n\n`;
    const divider = '-'.repeat(25);

    divisionData.pessoas.forEach(pessoa => {
      text += `👤 *${pessoa.nome.toUpperCase()}*\n`;
      
      let itensDaPessoa = 0;
      divisionData.itens.forEach(item => {
        if (item.atribuido_a && item.atribuido_a[pessoa.id]) {
          itensDaPessoa++;
          const quantidadeConsumida = item.atribuido_a[pessoa.id];
          const valorPago = quantidadeConsumida * item.valor_unitario;

          const itemName = item.nome;
          const itemValue = `R$ ${valorPago.toFixed(2)}`;
          const padding = '.'.repeat(Math.max(0, 20 - itemName.length));
          text += `  • ${itemName} ${padding} ${itemValue}\n`;
        }
      });

      if (itensDaPessoa === 0) {
        text += `  (Nenhum item individual registrado)\n`;
      }

      const pessoaTotal = totais.pessoas.find(p => p.nome === pessoa.nome);
      if (pessoaTotal) {
        const totalPessoaStr = `R$ ${pessoaTotal.total.toFixed(2)}`;
        text += `  *Total ${pessoa.nome}: ${totalPessoaStr}*\n\n`;
      }
    });

    text += `${divider}\n`;
    text += `>>> TOTAL GERAL: R$ ${totalDaConta.toFixed(2)} <<<\n`;
    text += `${divider}\n\n`;
    text += `--- Dividido com Compartilha AI ---`;
    return text;
  };

  const handleShare = (type) => {
    setShareModalOpen(false);
    const shareText = createShareText(type);
    
    if (navigator.share) {
      navigator.share({
        title: 'Resumo da Conta',
        text: shareText,
      }).catch(console.error);
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '💸';
  };

  return (
    <>
      {isShareModalOpen && <ShareModal onShare={handleShare} onClose={() => setShareModalOpen(false)} />}
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 p-6 font-sans">
        <header className="max-w-2xl text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-neutral-800 mb-4">
            Conta Finalizada!
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Confira o resumo abaixo. Agora é só acertar as contas.
          </p>
        </header>

        <main className="w-full max-w-md">
          <div className="bg-white shadow-soft rounded-2xl p-6 space-y-4">
            <div className="text-center border-b border-neutral-100 pb-4 mb-4">
              <p className="text-neutral-500">Valor Total da Conta</p>
              <p className="text-4xl font-bold text-primary-600">R$ {totalDaConta.toFixed(2)}</p>
            </div>

            {rankedPessoas.map((pessoa, index) => (
              <div key={index} className="flex justify-between items-center text-xl p-4 bg-neutral-50 rounded-xl">
                <span className="font-medium flex items-center text-neutral-700">
                  <span className="text-2xl mr-3">{getRankEmoji(index)}</span>
                  {pessoa.nome}
                </span>
                <span className="font-bold text-neutral-800">R$ {pessoa.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setShareModalOpen(true)}
              className="w-full px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 ease-out flex items-center justify-center gap-2 shadow-soft"
            >
              <Share2 /> Compartilhar
            </button>
            <button
              onClick={onGoBack}
              className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 ease-out flex items-center justify-center gap-2 shadow-soft"
            >
              <ArrowLeft /> Voltar e Editar
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={onReset}
              className="w-full px-6 py-3 text-neutral-600 font-semibold rounded-xl hover:bg-neutral-200 transition-all"
            >
              <RotateCw className="inline mr-2" size={16} />
              Iniciar Nova Divisão
            </button>
          </div>
        </main>
      </div>
    </>
  );
}