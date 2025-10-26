import { useState, useEffect } from 'react';

// Este componente é um modal (pop-up) que serve a dois propósitos:
// 1. Adicionar um novo item à conta.
// 2. Editar um item existente.
// Ele recebe um `item` (que pode ser `null` se for para adicionar) e funções de callback.

export default function ModalGerenciarItem({ item, onConfirm, onCancel }) {
  // --- ESTADOS ---
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState('');

  // `useEffect` para preencher o formulário quando um item é passado para edição.
  useEffect(() => {
    if (item) {
      // Se `item` existe, estamos no modo "Editar".
      setNome(item.nome);
      setQuantidade(item.quantidade);
      setValorUnitario(item.valor_unitario);
    } else {
      // Se `item` é nulo, estamos no modo "Adicionar". Limpa o formulário.
      setNome('');
      setQuantidade(1);
      setValorUnitario('');
    }
  }, [item]); // Roda sempre que o `item` mudar.

  // --- FUNÇÕES ---
  const handleSubmit = () => {
    // Validação simples dos campos.
    if (!nome || !quantidade || !valorUnitario) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    // Monta o objeto de dados no formato que a API espera (ItemPayload).
    const itemData = {
      nome,
      quantidade: parseInt(quantidade, 10),
      valor_unitario: parseFloat(valorUnitario),
    };
    // Chama a função `onConfirm` que foi passada pelo componente pai,
    // enviando os dados do formulário.
    onConfirm(itemData);
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {item ? 'Editar Item' : 'Adicionar Novo Item'}
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-400">Nome do Item</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              placeholder="Ex: Couvert Artístico"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-400">Quantidade</label>
              <input
                type="number"
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                min="1"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="valor" className="block text-sm font-medium text-gray-400">Valor Unitário (R$)</label>
              <input
                type="number"
                id="valor"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                placeholder="Ex: 15.00"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-blue-700"
          >
            {item ? 'Salvar Alterações' : 'Adicionar Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
