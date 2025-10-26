import { useState, useEffect } from 'react';

export default function ModalDistribuir({ item, pessoas, onConfirm, onCancel }) {
  const [distribuicao, setDistribuicao] = useState({});

  useEffect(() => {
    // Inicializa o estado com a distribuição atual do item.
    // A correção do bug está aqui: garantimos que `item.atribuido_a` exista
    // antes de tentar acessá-lo. Se for nulo ou indefinido, usamos um objeto vazio `{}`.
    const atribuicoesAtuais = item.atribuido_a || {};
    const inicial = pessoas.reduce((acc, pessoa) => {
      acc[pessoa.id] = atribuicoesAtuais[pessoa.id] || 0;
      return acc;
    }, {});
    setDistribuicao(inicial);
  }, [item, pessoas]);

  const handleQuantidadeChange = (pessoaId, delta) => {
    setDistribuicao(prev => {
      const atual = prev[pessoaId] || 0;
      const novo = Math.max(0, atual + delta); // Não permite negativo
      const totalDistribuido = Object.values(prev).reduce((sum, val) => sum + val, 0) - atual + novo;
      // Não permite distribuir mais que o total
      if (totalDistribuido > item.quantidade) return prev;
      return { ...prev, [pessoaId]: novo };
    });
  };

  const totalAtual = Object.values(distribuicao).reduce((sum, val) => sum + val, 0);
  const restante = item.quantidade - totalAtual;

  const handleSubmit = () => {
    // Formata os dados para a API
    const distribuicaoFinal = Object.entries(distribuicao)
      .filter(([, quantidade]) => quantidade > 0)
      .map(([pessoa_id, quantidade]) => ({ pessoa_id, quantidade }));

    onConfirm(item.id, distribuicaoFinal);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white truncate">{item.nome}</h2>
        <p className="text-gray-400">
          Total: {item.quantidade} un. | Restante: <span className={restante !== 0 ? 'text-warning' : 'text-success'}>{restante}</span>
        </p>

        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
          {pessoas.map(pessoa => (
            <div key={pessoa.id} className="flex items-center justify-between">
              <span className="text-white">{pessoa.nome}</span>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleQuantidadeChange(pessoa.id, -1)} className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600">-</button>
                <span className="w-8 text-center font-semibold">{distribuicao[pessoa.id] || 0}</span>
                <button onClick={() => handleQuantidadeChange(pessoa.id, 1)} className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-blue-700 disabled:bg-gray-500"
            disabled={restante < 0} // Não pode confirmar se distribuiu a mais
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
