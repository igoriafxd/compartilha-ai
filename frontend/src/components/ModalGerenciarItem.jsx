import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function ModalGerenciarItem({ item, onConfirm, onCancel }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState('');

  useEffect(() => {
    if (item) {
      setNome(item.nome);
      setQuantidade(item.quantidade);
      setValorUnitario(item.valor_unitario);
    } else {
      setNome('');
      setQuantidade(1);
      setValorUnitario('');
    }
  }, [item]);

  const handleSubmit = () => {
    if (!nome || !quantidade || !valorUnitario) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const itemData = {
      nome,
      quantidade: parseInt(quantidade, 10),
      valor_unitario: parseFloat(valorUnitario),
    };
    onConfirm(itemData);
  };

  return (
    <div className="fixed inset-0 bg-neutral-800/60 flex items-center justify-center p-4 z-50 font-sans animate-fade-in">
      <div className="bg-white rounded-2xl shadow-soft p-6 w-full max-w-md">
        <h2 className="font-display text-2xl font-semibold text-neutral-800 mb-6">
          {item ? 'Editar Item' : 'Adicionar Novo Item'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-neutral-600 mb-1">
              Nome do Item
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
              placeholder="Ex: Couvert Artístico"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="quantidade" className="block text-sm font-medium text-neutral-600 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
                min="1"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="valor" className="block text-sm font-medium text-neutral-600 mb-1">
                Valor Unitário (R$)
              </label>
              <input
                type="number"
                id="valor"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
                placeholder="Ex: 15.00"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl text-neutral-600 font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2">
            <X size={18} /> Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all flex items-center gap-2"
          >
            <Check size={18} /> {item ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
