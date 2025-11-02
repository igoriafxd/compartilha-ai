import { useState } from 'react';
import { UserPlus, Trash2, ArrowRight } from 'lucide-react';

export default function NomesDialog({ onConfirm, onCancel }) {
  const [nomes, setNomes] = useState(['', '']);

  const handleNomeChange = (index, value) => {
    const novosNomes = [...nomes];
    novosNomes[index] = value;
    setNomes(novosNomes);
  };

  const adicionarPessoa = () => {
    setNomes([...nomes, '']);
  };

  const removerPessoa = (index) => {
    if (nomes.length > 1) {
      const novosNomes = nomes.filter((_, i) => i !== index);
      setNomes(novosNomes);
    }
  };

  const handleSubmit = () => {
    const nomesValidos = nomes.map(n => n.trim()).filter(n => n);
    if (nomesValidos.length < 1) {
      alert("Adicione pelo menos uma pessoa.");
      return;
    }
    onConfirm(nomesValidos);
  };

  return (
    <div className="fixed inset-0 bg-neutral-800/60 flex items-center justify-center p-4 z-50 font-sans animate-fade-in">
      <div className="bg-white rounded-2xl shadow-soft p-6 w-full max-w-md">
        <h2 className="font-display text-2xl font-semibold text-neutral-800 mb-4">Quem vai dividir a conta?</h2>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {nomes.map((nome, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Pessoa ${index + 1}`}
                value={nome}
                onChange={(e) => handleNomeChange(index, e.target.value)}
                className="w-full border-neutral-200 rounded-xl shadow-sm transition-colors focus:border-primary-500 focus:ring-0"
              />
              <button
                onClick={() => removerPessoa(index)}
                className="text-neutral-400 hover:text-danger transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={nomes.length <= 1}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={adicionarPessoa}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          <UserPlus size={16} />
          Adicionar outra pessoa
        </button>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl text-neutral-600 font-semibold hover:bg-neutral-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all duration-300 ease-out flex items-center gap-2"
          >
            Confirmar e Iniciar
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}