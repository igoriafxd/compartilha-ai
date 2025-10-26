export default function PersonCard({ pessoa, totais }) {
  // Encontra os detalhes de totais para esta pessoa específica
  const detalhesPessoa = totais?.pessoas.find(p => p.nome === pessoa.nome);

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-64 flex-shrink-0">
      <h3 className="text-xl font-bold text-white truncate">{pessoa.nome}</h3>
      <div className="mt-4 space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
        {detalhesPessoa?.itens.map((item, index) => (
          <div key={index} className="flex justify-between text-gray-300">
            <span className="truncate max-w-[120px]">{item.nome} (x{item.quantidade})</span>
            <span>R$ {item.valor.toFixed(2)}</span>
          </div>
        ))}
        {(!detalhesPessoa || detalhesPessoa.itens.length === 0) && (
          <p className="text-gray-500 text-center py-4">Nenhum item atribuído.</p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>R$ {detalhesPessoa?.subtotal.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Taxa de Serviço</span>
          <span>+ R$ {detalhesPessoa?.taxa.toFixed(2) || '0.00'}</span>
        </div>
        {/* --- NOVA LINHA PARA EXIBIR O DESCONTO --- */}
        {detalhesPessoa?.desconto > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Desconto</span>
            <span>- R$ {detalhesPessoa?.desconto.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-white font-bold text-lg mt-2">
          <span>TOTAL</span>
          <span>R$ {detalhesPessoa?.total.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    </div>
  );
}
