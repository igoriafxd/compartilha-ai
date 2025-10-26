import React from 'react';

// Este componente é a tela final, mostrando o resumo da conta.
// Ele recebe os `totais` calculados e uma função `onReset` para voltar ao início.

export default function SummaryScreen({ totais, onReset }) {

  // Função para copiar o resumo para a área de transferência.
  const handleShare = () => {
    // Monta uma string de texto simples com os resultados.
    const shareText = totais.pessoas.map(pessoa =>
      `${pessoa.nome}: R$ ${pessoa.total.toFixed(2)}`
    ).join('\n'); // Junta cada pessoa com uma quebra de linha.

    // Usa a API do navegador para copiar o texto.
    navigator.clipboard.writeText(shareText)
      .then(() => {
        alert('Resumo copiado para a área de transferência!');
      })
      .catch(err => {
        console.error('Erro ao copiar texto: ', err);
        alert('Não foi possível copiar o texto.');
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-bold mb-2">Conta Finalizada!</h1>
        <p className="text-lg text-gray-400 mb-8">Aqui está o resumo de quanto cada um deve pagar.</p>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          {totais.pessoas.map((pessoa, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-xl p-4 bg-gray-700 rounded-lg"
            >
              <span className="font-medium">{pessoa.nome}</span>
              <span className="font-bold text-primary">R$ {pessoa.total.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleShare}
            className="w-full px-4 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
          >
            Copiar e Compartilhar
          </button>
          <button
            onClick={onReset}
            className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all"
          >
            Iniciar Nova Divisão
          </button>
        </div>
      </div>
    </div>
  );
}