import { useState } from 'react';
import { UploadCloud, FileScan, ArrowRight, LoaderCircle } from 'lucide-react';
import api from '../services/api';

export default function UploadScreen({ onScanComplete, onManualStart }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Arquivo muito grande (máx 10MB).');
        return;
      }
      setSelectedFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Selecione um arquivo para escanear.");
      return;
    }
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/api/scan-comanda', formData);
      const data = response.data;

      if (data.success && data.itens.length > 0) {
        onScanComplete(data.itens);
      } else {
        setError('Não foi possível extrair itens. Tente uma imagem mais nítida.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erro ao escanear:", err);
      setError('Ocorreu um erro ao processar. Tente novamente ou inicie a divisão manualmente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 p-6 font-sans">
      <header className="max-w-2xl text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-neutral-800 mb-4">
          Compartilha <span className="text-primary-500">AI</span>
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Divida contas de forma inteligente. Tire uma foto da comanda ou comece manualmente.
        </p>
      </header>

      <main className="w-full max-w-lg">
        <div className="bg-white shadow-soft rounded-2xl p-6 transition hover:shadow-lg">
          <label
            htmlFor="file-upload"
            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Pré-visualização" className="object-contain h-full w-full rounded-lg p-2" />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-12 h-12 mb-4 text-primary-400" />
                <p className="mb-2 font-semibold text-neutral-800">Clique para enviar a comanda</p>
                <p className="text-sm text-neutral-500">PNG, JPG, WEBP (MAX. 10MB)</p>
              </div>
            )}
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
          </label>

          {error && <p className="mt-4 text-center text-sm text-danger">{error}</p>}

          <button
            onClick={handleScan}
            disabled={!selectedFile || isLoading}
            className="w-full mt-6 px-6 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:bg-primary-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <FileScan />
                Processar com IA
              </>
            )}
          </button>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink mx-4 text-sm text-neutral-400">OU</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        <button
          onClick={onManualStart}
          className="w-full px-6 py-4 bg-white text-neutral-700 font-semibold border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-all duration-300 ease-out flex items-center justify-center gap-2 shadow-soft"
        >
          <ArrowRight />
          Iniciar Divisão Manualmente
        </button>
      </main>
    </div>
  );
}