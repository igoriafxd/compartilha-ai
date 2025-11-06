import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

export default function ModalAdicionarPessoa({ onConfirm, onCancel }) {
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome não pode estar em branco.');
      return;
    }
    onConfirm({ nome });
  };

  return (
    <div className="fixed inset-0 bg-neutral-800/60 flex items-center justify-center p-4 z-50 font-sans animate-fade-in">
      <div className="bg-white rounded-2xl shadow-soft p-6 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <h2 className="font-display text-2xl font-semibold text-neutral-800 mb-6">
            Adicionar Nova Pessoa
          </h2>
          
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-neutral-600 mb-1">
              Nome da Pessoa
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setError('');
              }}
              className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
              placeholder="Ex: João"
              autoFocus
            />
          </div>

          {error && <p className="text-danger text-sm mt-2">{error}</p>}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-xl text-neutral-600 font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2"
            >
              <X size={18} /> Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all flex items-center gap-2"
            >
              <UserPlus size={18} /> Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
