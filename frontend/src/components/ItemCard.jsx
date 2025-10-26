// Adicionamos os callbacks onEditClick e onDeleteClick
export default function ItemCard({ item, onDistributeClick, onEditClick, onDeleteClick }) {
  const totalAtribuido = Object.values(item.atribuido_a || {}).reduce((sum, qty) => sum + qty, 0);
  const restante = item.quantidade - totalAtribuido;
  const isCompleto = restante <= 0;

  return (
    <div className={`p-3 rounded-lg bg-gray-700 border ${isCompleto ? 'border-green-500/50' : 'border-gray-600'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-white">{item.nome}</p>
          <p className="text-sm text-gray-400">
            {item.quantidade} un. x R$ {item.valor_unitario.toFixed(2)}
          </p>
        </div>
        <p className="font-semibold text-lg text-white">
          R$ {(item.quantidade * item.valor_unitario).toFixed(2)}
        </p>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {isCompleto ? (
            <span className="text-green-400 font-semibold">Distribuído!</span>
          ) : (
            <span>Restante: {restante}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* --- NOVOS BOTÕES DE AÇÃO --- */}
          <button onClick={() => onEditClick(item)} title="Editar item" className="text-gray-400 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          </button>
          <button onClick={() => onDeleteClick(item.id)} title="Excluir item" className="text-gray-400 hover:text-danger">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => onDistributeClick(item)}
            className="px-3 py-1 text-sm font-semibold bg-secondary text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Distribuir
          </button>
        </div>
      </div>
    </div>
  );
}
