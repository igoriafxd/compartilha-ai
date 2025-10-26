import { useState } from 'react';

export default function NomesDialog({ onConfirm, onCancel }) {
  const [nomes, setNomes] = useState(['', '']); // Começa com dois campos

  const handleNomeChange = (index, value) => {
    const novosNomes = [...nomes];
    novosNomes[index] = value;
    setNomes(novosNomes);
  };

  const adicionarPessoa = () => {
    setNomes([...nomes, '']);
  };

  const removerPessoa = (index) => {
    const novosNomes = nomes.filter((_, i) => i !== index);
    setNomes(novosNomes);
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Quem vai dividir a conta?</h2>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {nomes.map((nome, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Pessoa ${index + 1}`}
                value={nome}
                onChange={(e) => handleNomeChange(index, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => removerPessoa(index)}
                className="text-gray-400 hover:text-danger transition-colors"
                disabled={nomes.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={adicionarPessoa}
          className="w-full mt-4 text-sm text-primary hover:text-blue-400"
        >
          + Adicionar outra pessoa
        </button>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
