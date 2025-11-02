export default function PersonCard({ pessoa, totais }) {
  const detalhesPessoa = totais?.pessoas.find(p => p.nome === pessoa.nome);

  return (
    <div className="bg-white shadow-soft rounded-2xl p-5 w-72 flex-shrink-0 transition hover:shadow-lg">
      <h3 className="font-display text-xl font-semibold text-neutral-800 truncate">{pessoa.nome}</h3>
      
      <div className="mt-4 space-y-2 text-sm max-h-40 overflow-y-auto pr-2 font-sans">
        {detalhesPessoa?.itens.map((item, index) => (
          <div key={index} className="flex justify-between text-neutral-600">
            <span className="truncate max-w-[140px]">{item.nome} (x{item.quantidade})</span>
            <span className="font-medium">R$ {item.valor.toFixed(2)}</span>
          </div>
        ))}
        {(!detalhesPessoa || detalhesPessoa.itens.length === 0) && (
          <p className="text-neutral-400 text-center py-4">Nenhum item.</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 font-sans">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span>R$ {detalhesPessoa?.subtotal.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Taxa</span>
          <span>+ R$ {detalhesPessoa?.taxa.toFixed(2) || '0.00'}</span>
        </div>
        {detalhesPessoa?.desconto > 0 && (
          <div className="flex justify-between text-success">
            <span>Desconto</span>
            <span>- R$ {detalhesPessoa?.desconto.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-neutral-800 font-bold text-lg mt-2">
          <span>TOTAL</span>
          <span>R$ {detalhesPessoa?.total.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    </div>
  );
}