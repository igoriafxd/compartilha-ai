import { useState } from 'react';
import api from './services/api'; // 1. Importa o novo serviço de API
import UploadScreen from './components/UploadScreen';
import NomesDialog from './components/NomesDialog';
import DistributionScreen from './components/DistributionScreen';
import SummaryScreen from './components/SummaryScreen';

function App() {
  // --- ESTADOS GLOBAIS DA APLICAÇÃO ---
  const [scannedItems, setScannedItems] = useState(null);
  const [showNomesDialog, setShowNomesDialog] = useState(false);
  const [divisionData, setDivisionData] = useState(null);
  const [finalTotals, setFinalTotals] = useState(null);

  // --- FUNÇÕES DE CONTROLE DE FLUXO ---

  const handleScanComplete = (items) => {
    setScannedItems(items);
    setShowNomesDialog(true);
  };

  const handleCreateDivision = async (nomes) => {
    if (!scannedItems) return;
    setShowNomesDialog(false);
    try {
      // 2. Substitui o `fetch` pelo `api.post`
      const response = await api.post('/api/criar-divisao', {
        itens: scannedItems,
        nomes_pessoas: nomes,
      });
      // Com axios, os dados já vêm em `response.data`
      setDivisionData(response.data);
    } catch (error) {
      console.error("Erro ao criar divisão:", error);
      alert("Não foi possível criar a divisão. Verifique se o backend está rodando.");
      handleReset();
    }
  };

  const handleFinalize = (totais) => {
    setFinalTotals(totais);
  };

  const handleReset = () => {
    setScannedItems(null);
    setShowNomesDialog(false);
    setDivisionData(null);
    setFinalTotals(null);
  };


  // --- LÓGICA DE RENDERIZAÇÃO ---

  if (finalTotals) {
    return <SummaryScreen totais={finalTotals} onReset={handleReset} />;
  }

  if (divisionData) {
    return (
      <DistributionScreen
        initialDivisionData={divisionData}
        onGoBack={handleReset}
        onFinalize={handleFinalize}
      />
    );
  }

  if (scannedItems) {
    return (
      <>
        <UploadScreen onScanComplete={() => {}} />
        {showNomesDialog && <NomesDialog onConfirm={handleCreateDivision} onCancel={handleReset} />}
      </>
    );
  }

  return <UploadScreen onScanComplete={handleScanComplete} />;
}

export default App;
