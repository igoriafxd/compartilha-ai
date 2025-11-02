// src/components/ModalAdicionarPessoa.jsx
import { useState } from 'react';

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md m-4">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-white mb-6">Adicionar Nova Pessoa</h2>
          
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-400 mb-2">
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary"
              placeholder="Ex: João"
              autoFocus
            />
          </div>

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white bg-primary hover:bg-blue-700"
            >
              Adicionar Pessoa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
