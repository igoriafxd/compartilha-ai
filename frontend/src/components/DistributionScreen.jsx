import { useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Importa a instância do axios
import ItemCard from './ItemCard';
import PersonCard from './PersonCard';
import ModalDistribuir from './ModalDistribuir';
import ModalGerenciarItem from './ModalGerenciarItem'; // Importa o novo modal

export default function DistributionScreen({ initialDivisionData, onGoBack, onFinalize }) {
  // --- ESTADOS ---
  const [divisionData, setDivisionData] = useState(initialDivisionData);
  const [totais, setTotais] = useState(null);
  const [isLoadingTotals, setIsLoadingTotals] = useState(true);
  const [itemParaDistribuir, setItemParaDistribuir] = useState(null);
  const [taxaServico, setTaxaServico] = useState(initialDivisionData.taxa_servico_percentual);
  const [desconto, setDesconto] = useState(initialDivisionData.desconto_valor);

  // --- NOVOS ESTADOS PARA GERENCIAR ITENS ---
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [isPessoaModalOpen, setIsPessoaModalOpen] = useState(false);


  // --- FUNÇÕES DE COMUNICAÇÃO COM A API ---

  const fetchTotals = useCallback(async () => {
    setIsLoadingTotals(true);
    try {
      const response = await api.get(`/api/calcular-totais/${divisionData.id}`);
      if (response.status !== 200) throw new Error("Falha ao buscar totais");
      const data = response.data;
      setTotais(data);
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
      // CORREÇÃO DO BUG: Convertemos os valores dos inputs para número ANTES de comparar.
      const taxaAtual = parseFloat(taxaServico) || 0;
      const descontoAtual = parseFloat(desconto) || 0;

      if (taxaAtual !== divisionData.taxa_servico_percentual || descontoAtual !== divisionData.desconto_valor) {
        try {
          const response = await api.put(`/api/divisao/${divisionData.id}/config`, {
            taxa_servico_percentual: taxaAtual,
            desconto_valor: descontoAtual,
          });
          if (response.status !== 200) throw new Error("Falha ao atualizar configuração");
          const updatedDivision = response.data;
          setDivisionData(updatedDivision);
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [taxaServico, desconto, divisionData]);


  const handleConfirmDistribuicao = async (itemId, distribuicao) => {
    try {
      const response = await api.post(`/api/distribuir-item/${divisionData.id}`, {
        item_id: itemId,
        distribuicao,
      });
      if (response.status !== 200) throw new Error("Falha ao distribuir item");
      const updatedDivision = response.data;
      setDivisionData(updatedDivision);
      setItemParaDistribuir(null);
    } catch (error) {
      console.error(error);
    }
  };

  // --- NOVAS FUNÇÕES PARA GERENCIAR ITENS ---

  const handleOpenAddItemModal = () => {
    setItemParaEditar(null); // Garante que estamos no modo "adicionar"
    setIsItemModalOpen(true);
  };

  const handleOpenEditItemModal = (item) => {
    setItemParaEditar(item); // Passa o item a ser editado
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        const response = await api.delete(`/api/divisao/${divisionData.id}/item/${itemId}`);
        if (response.status !== 200) throw new Error("Falha ao excluir item");
        const updatedDivision = response.data;
        setDivisionData(updatedDivision);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleConfirmGerenciarItem = async (itemData) => {
    const isEditing = !!itemParaEditar;
    const url = isEditing
      ? `/api/divisao/${divisionData.id}/item/${itemParaEditar.id}` // URL para Editar
      : `/api/divisao/${divisionData.id}/item`; // URL para Adicionar

    const method = isEditing ? 'put' : 'post';

    try {
      const response = await api[method](url, itemData);
      if (response.status !== 200) throw new Error(`Falha ao ${isEditing ? 'editar' : 'adicionar'} item`);
      
      const updatedDivision = response.data;
      setDivisionData(updatedDivision);
      setIsItemModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error(error);
    }
  };


  // --- CÁLCULOS PARA EXIBIÇÃO ---
  const subtotalGeral = divisionData.itens.reduce((sum, item) => sum + (item.valor_unitario * item.quantidade), 0);
  const valorAposDesconto = subtotalGeral - (parseFloat(desconto) || 0);
  const taxaTotal = valorAposDesconto * ((parseFloat(taxaServico) || 0) / 100);
  const totalGeral = valorAposDesconto + taxaTotal;


  // --- RENDERIZAÇÃO ---
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Divisão da Conta</h1>
            {totais?.progresso && (
              <div className="mt-2">
                <p className="text-gray-400">
                  {totais.progresso.percentual_distribuido.toFixed(0)}% distribuído
                  ({totais.progresso.itens_restantes} itens restantes)
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${totais.progresso.percentual_distribuido}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <button onClick={onGoBack} className="text-sm text-gray-400 hover:text-white">
            &larr; Voltar e escanear outra
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna da Conta Completa */}
          <div className="lg:w-1/3 space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Conta Completa</h2>
                <button onClick={handleOpenAddItemModal} className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-blue-700">
                  + Adicionar
                </button>
              </div>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {divisionData.itens.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDistributeClick={setItemParaDistribuir}
                    onEditClick={handleOpenEditItemModal}
                    onDeleteClick={handleDeleteItem}
                  />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-right">
                  <p>Subtotal: R$ {subtotalGeral.toFixed(2)}</p>
                  <p className="text-green-400">Desconto: - R$ {(parseFloat(desconto) || 0).toFixed(2)}</p>
                  <p>Taxa ({taxaServico}%): R$ {taxaTotal.toFixed(2)}</p>
                  <p className="text-xl font-bold">Total: R$ {totalGeral.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Coluna das Pessoas e Configurações */}
          <div className="lg:w-2/3">
            <div className="bg-gray-800 rounded-lg p-4 mb-8">
              <h2 className="text-xl font-bold mb-4">Configurações</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="taxa" className="block text-sm font-medium text-gray-400">Taxa de Serviço (%)</label>
                  <input
                    type="number"
                    id="taxa"
                    value={taxaServico}
                    onChange={(e) => setTaxaServico(e.target.value)}
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="desconto" className="block text-sm font-medium text-gray-400">Desconto (R$)</label>
                  <input
                    type="number"
                    id="desconto"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Pessoas</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {divisionData.pessoas.map(pessoa => (
                <PersonCard key={pessoa.id} pessoa={pessoa} totais={totais} />
              ))}
            </div>

            {/* --- BOTÃO DE FINALIZAR --- */}
            <div className="mt-8 text-center">
              <button
                onClick={() => onFinalize(totais)}
                disabled={!totais || totais.progresso.itens_restantes > 0}
                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {totais?.progresso.itens_restantes > 0
                  ? `${totais.progresso.itens_restantes} Iten(s) Restante(s)`
                  : 'Finalizar e Ver Resumo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {itemParaDistribuir && (
        <ModalDistribuir
          item={itemParaDistribuir}
          pessoas={divisionData.pessoas}
          onConfirm={handleConfirmDistribuicao}
          onCancel={() => setItemParaDistribuir(null)}
        />
      )}

      {/* --- RENDERIZAÇÃO DO NOVO MODAL --- */}
      {isItemModalOpen && (
        <ModalGerenciarItem
          item={itemParaEditar}
          onConfirm={handleConfirmGerenciarItem}
          onCancel={() => setIsItemModalOpen(false)}
        />
      )}

      {isPessoaModalOpen && (
        <ModalAdicionarPessoa
          onConfirm={handleAddPessoa}
          onCancel={() => setIsPessoaModalOpen(false)}
        />
      )}
    </>
  );
}
