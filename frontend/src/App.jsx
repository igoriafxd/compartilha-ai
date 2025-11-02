import { useState } from 'react';
import api from './services/api';
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

  const handleManualStart = () => {
    setScannedItems([]); // Inicia com uma lista de itens vazia
    setShowNomesDialog(true);
  };

  const handleCreateDivision = async (nomes) => {
    if (!scannedItems) return;
    setShowNomesDialog(false);
    try {
      const response = await api.post('/api/criar-divisao', {
        itens: scannedItems,
        nomes_pessoas: nomes,
      });
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

  // Função para atualizar o estado da divisão a partir do filho
  const handleDivisionUpdate = (updatedDivisionData) => {
    setDivisionData(updatedDivisionData);
  };

  const handleGoBackToDivision = () => {
    setFinalTotals(null);
  };

  const handleReset = () => {
    setScannedItems(null);
    setShowNomesDialog(false);
    setDivisionData(null);
    setFinalTotals(null);
  };


  // --- LÓGICA DE RENDERIZAÇÃO ---

  if (finalTotals) {
    return <SummaryScreen 
              totais={finalTotals} 
              divisionData={divisionData}
              onReset={handleReset} 
              onGoBack={handleGoBackToDivision} 
            />;
  }

  if (divisionData) {
    return (
      <DistributionScreen
        divisionData={divisionData}
        onDivisionUpdate={handleDivisionUpdate}
        onGoBack={handleReset}
        onFinalize={handleFinalize}
      />
    );
  }

  if (scannedItems !== null) {
    return (
      <>
        {/* Passamos uma função vazia para onScanComplete para desabilitá-la visualmente */}
        <UploadScreen onScanComplete={() => {}} onManualStart={() => {}} />
        {showNomesDialog && <NomesDialog onConfirm={handleCreateDivision} onCancel={handleReset} />}
      </>
    );
  }

  return <UploadScreen onScanComplete={handleScanComplete} onManualStart={handleManualStart} />;
}

export default App;