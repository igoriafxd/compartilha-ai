import { useState } from 'react';

// Modal simples para adicionar uma nova pessoa à divisão.
export default function ModalAdicionarPessoa({ onConfirm, onCancel }) {
  const [nome, setNome] = useState('');

  const handleSubmit = () => {
    const nomeValido = nome.trim();
    if (!nomeValido) {
      alert('O nome não pode estar em branco.');
      return;
    }
    onConfirm(nomeValido);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-4">Adicionar Pessoa</h2>
        <div>
          <label htmlFor="nome-pessoa" className="block text-sm font-medium text-gray-400">Nome</label>
          <input
            type="text"
            id="nome-pessoa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
            placeholder="Digite o nome"
            autoFocus // Foca no campo de texto automaticamente
          />
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
