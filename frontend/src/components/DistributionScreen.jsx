import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';
import ItemCard from './ItemCard';
import PersonCard from './PersonCard';
import ModalDistribuir from './ModalDistribuir';
import ModalGerenciarItem from './ModalGerenciarItem';
import ModalAdicionarPessoa from './ModalAdicionarPessoa';

export default function DistributionScreen({ divisionData, onDivisionUpdate, onGoBack, onFinalize }) {
  const [totais, setTotais] = useState(null);
  const [isLoadingTotals, setIsLoadingTotals] = useState(true);
  const [itemParaDistribuir, setItemParaDistribuir] = useState(null);
  const [taxaServico, setTaxaServico] = useState(divisionData.taxa_servico_percentual);
  const [desconto, setDesconto] = useState(divisionData.desconto_valor);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [isPessoaModalOpen, setIsPessoaModalOpen] = useState(false);

  const fetchTotals = useCallback(async () => {
    setIsLoadingTotals(true);
    try {
      const response = await api.get(`/api/calcular-totais/${divisionData.id}`);
      setTotais(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTotals(false);
    }
  }, [divisionData.id]);

  useEffect(() => {
    fetchTotals();
  }, [divisionData, fetchTotals]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const taxaAtual = parseFloat(taxaServico) || 0;
      const descontoAtual = parseFloat(desconto) || 0;
      if (taxaAtual !== divisionData.taxa_servico_percentual || descontoAtual !== divisionData.desconto_valor) {
        try {
          const response = await api.put(`/api/divisao/${divisionData.id}/config`, {
            taxa_servico_percentual: taxaAtual,
            desconto_valor: descontoAtual,
          });
          onDivisionUpdate(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [taxaServico, desconto, divisionData, onDivisionUpdate]);

  const handleApiCall = async (apiPromise) => {
    try {
      const response = await apiPromise;
      onDivisionUpdate(response.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleConfirmDistribuicao = async (itemId, distribuicao) => {
    if (await handleApiCall(api.post(`/api/distribuir-item/${divisionData.id}`, { item_id: itemId, distribuicao }))) {
      setItemParaDistribuir(null);
    }
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm("Tem certeza?")) {
      handleApiCall(api.delete(`/api/divisao/${divisionData.id}/item/${itemId}`));
    }
  };

  const handleConfirmGerenciarItem = async (itemData) => {
    const isEditing = !!itemParaEditar;
    const promise = isEditing
      ? api.put(`/api/divisao/${divisionData.id}/item/${itemParaEditar.id}`, itemData)
      : api.post(`/api/divisao/${divisionData.id}/item`, itemData);
    if (await handleApiCall(promise)) {
      setIsItemModalOpen(false);
    }
  };

  const handleAddPessoa = async (pessoaData) => {
    if (await handleApiCall(api.post(`/api/divisao/${divisionData.id}/pessoa`, pessoaData))) {
      setIsPessoaModalOpen(false);
    }
  };

  const subtotalGeral = divisionData.itens.reduce((sum, item) => sum + (item.valor_unitario * item.quantidade), 0);
  const valorAposDesconto = subtotalGeral - (parseFloat(desconto) || 0);
  const taxaTotal = valorAposDesconto * ((parseFloat(taxaServico) || 0) / 100);
  const totalGeral = valorAposDesconto + taxaTotal;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 font-sans p-4 sm:p-6 lg:p-8">
        <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-semibold text-neutral-800">Divisão da Conta</h1>
            {totais?.progresso && (
              <div className="mt-2">
                <p className="text-sm text-neutral-500">
                  {totais.progresso.percentual_distribuido.toFixed(0)}% distribuído ({totais.progresso.itens_restantes} itens restantes)
                </p>
                <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totais.progresso.percentual_distribuido}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <button onClick={onGoBack} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors">
            <ArrowLeft size={16} />
            Começar de novo
          </button>
        </header>

        <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white shadow-soft rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl font-semibold text-neutral-800">Itens da Conta</h2>
                <button onClick={() => { setItemParaEditar(null); setIsItemModalOpen(true); }} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-600 font-semibold px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors">
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                {divisionData.itens.map(item => (
                  <ItemCard key={item.id} item={item} onDistributeClick={setItemParaDistribuir} onEditClick={(itemToEdit) => { setItemParaEditar(itemToEdit); setIsItemModalOpen(true); }} onDeleteClick={handleDeleteItem} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100 text-right font-sans text-sm">
                <p className="text-neutral-500">Subtotal: <span className="font-medium text-neutral-700">R$ {subtotalGeral.toFixed(2)}</span></p>
                <p className="text-success">Desconto: <span className="font-medium">- R$ {(parseFloat(desconto) || 0).toFixed(2)}</span></p>
                <p className="text-neutral-500">Taxa ({taxaServico}%): <span className="font-medium text-neutral-700">+ R$ {taxaTotal.toFixed(2)}</span></p>
                <p className="text-xl font-bold text-neutral-800 mt-2">Total: R$ {totalGeral.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white shadow-soft rounded-2xl p-6 mb-8">
              <h2 className="font-display text-xl font-semibold text-neutral-800 mb-4">Configurações Gerais</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="taxa" className="block text-sm font-medium text-neutral-600">Taxa de Serviço (%)</label>
                  <input type="number" id="taxa" value={taxaServico} onChange={(e) => setTaxaServico(e.target.value)} className="w-full mt-1 border-neutral-200 rounded-xl shadow-sm transition-colors focus:border-primary-500 focus:ring-0" />
                </div>
                <div>
                  <label htmlFor="desconto" className="block text-sm font-medium text-neutral-600">Desconto (R$)</label>
                  <input type="number" id="desconto" value={desconto} onChange={(e) => setDesconto(e.target.value)} className="w-full mt-1 border-neutral-200 rounded-xl shadow-sm transition-colors focus:border-primary-500 focus:ring-0" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-semibold text-neutral-800">Pessoas</h2>
              <button onClick={() => setIsPessoaModalOpen(true)} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-600 font-semibold px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors">
                <Plus size={16} /> Adicionar
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {divisionData.pessoas.map((pessoa, index) => (
                <PersonCard key={pessoa.id} pessoa={pessoa} totais={totais} index={index} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <button onClick={() => onFinalize(totais)} disabled={!totais || totais.progresso.itens_restantes > 0} className="px-8 py-4 bg-primary-500 text-white font-bold text-lg rounded-xl hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto">
                <CheckCircle />
                {totais?.progresso.itens_restantes > 0 ? `${totais.progresso.itens_restantes} Iten(s) Restante(s)` : 'Finalizar e Ver Resumo'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {itemParaDistribuir && <ModalDistribuir item={itemParaDistribuir} pessoas={divisionData.pessoas} onConfirm={handleConfirmDistribuicao} onCancel={() => setItemParaDistribuir(null)} />}
      {isItemModalOpen && <ModalGerenciarItem item={itemParaEditar} onConfirm={handleConfirmGerenciarItem} onCancel={() => setIsItemModalOpen(false)} />}
      {isPessoaModalOpen && <ModalAdicionarPessoa onConfirm={handleAddPessoa} onCancel={() => setIsPessoaModalOpen(false)} />}
    </>
  );
}