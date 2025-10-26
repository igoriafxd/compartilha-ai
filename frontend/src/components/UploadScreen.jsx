import { useState } from 'react';
import api from '../services/api'; // 1. Importa o serviço de API

export default function UploadScreen({ onScanComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('O arquivo é muito grande. O limite é de 10MB.');
        return;
      }
      setSelectedFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Por favor, selecione um arquivo primeiro.");
      return;
    }
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 2. Substitui o `fetch` pelo `api.post`
      // O axios vai configurar o `Content-Type` para `multipart/form-data` automaticamente.
      const response = await api.post('/api/scan-comanda', formData);
      const data = response.data;

      if (data.success && data.itens.length > 0) {
        setTimeout(() => {
          onScanComplete(data.itens);
        }, 1000);
      } else {
        setError('A IA não conseguiu extrair itens da imagem. Tente uma imagem mais nítida.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erro ao escanear:", err);
      setError('Ocorreu um erro ao conectar com a API. Verifique o console para mais detalhes.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">Compartilha AI</h1>
        </div>
        <p className="text-xl text-gray-300">Divida contas em segundos</p>
      </div>

      <div className="w-full max-w-lg">
        <label
          htmlFor="file-upload"
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-500 rounded-xl cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:border-primary"
        >
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="object-contain h-full w-full rounded-lg p-2" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-lg text-gray-400"><span className="font-semibold text-gray-300">Clique para escolher um arquivo</span></p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP (MAX. 10MB)</p>
            </div>
          )}
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        </label>

        {error && <p className="mt-3 text-md text-danger">{error}</p>}

        <button
          onClick={handleScan}
          disabled={!selectedFile || isLoading}
          className="w-full mt-6 px-4 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando com IA...
            </>
          ) : (
            'Processar Comanda'
          )}
        </button>
      </div>

      <div className="text-center mt-10">
        <p className="text-md text-gray-500">💡 Dica: Funciona com comandas de bar, restaurante e cupons fiscais.</p>
      </div>
    </div>
  );
}
