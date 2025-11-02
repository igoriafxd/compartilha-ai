import { Edit, Trash2, Share2 } from 'lucide-react';

export default function ItemCard({ item, onDistributeClick, onEditClick, onDeleteClick }) {
  const totalAtribuido = Object.values(item.atribuido_a || {}).reduce((sum, qty) => sum + qty, 0);
  const restante = item.quantidade - totalAtribuido;
  const isCompleto = restante <= 0;

  return (
    <div className={`p-4 rounded-xl transition-all duration-300 ${isCompleto ? 'bg-success/10 border border-success/20' : 'bg-white border border-neutral-200/80'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold font-sans text-neutral-800">{item.nome}</p>
          <p className="text-sm text-neutral-500">
            {item.quantidade} un. x R$ {item.valor_unitario.toFixed(2)}
          </p>
        </div>
        <p className="font-semibold text-lg text-neutral-800">
          R$ {(item.quantidade * item.valor_unitario).toFixed(2)}
        </p>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs font-medium">
          {isCompleto ? (
            <span className="text-success">Distribuído!</span>
          ) : (
            <span className="text-neutral-500">Restante: {restante}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEditClick(item)} title="Editar item" className="text-neutral-400 hover:text-primary-500 transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDeleteClick(item.id)} title="Excluir item" className="text-neutral-400 hover:text-danger transition-colors">
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => onDistributeClick(item)}
            className="px-3 py-1 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}