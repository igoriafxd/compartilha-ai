import { Edit, Trash2, Share2 } from 'lucide-react';

export default function ItemCard({ item, onDistributeClick, onEditClick, onDeleteClick }) {
  const totalAtribuido = Object.values(item.atribuido_a || {}).reduce((sum, qty) => sum + qty, 0);
  const restante = item.quantidade - totalAtribuido;
  const isCompleto = restante <= 1e-9;

  // Funções para parar a propagação do evento de clique,
  // para que clicar nos botões de editar/excluir não acione o clique do card.
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditClick(item);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteClick(item.id);
  };

  // Classes do card que mudam com base no estado 'isCompleto'
  // Adicionamos 'group' para que o hover no card possa afetar os filhos (o ícone)
  const cardClasses = `group p-4 rounded-xl transition-all duration-300 cursor-pointer ${
    isCompleto
      ? 'bg-success/10 border border-success/20 hover:border-primary-400/50' // Completo, mas ainda clicável
      : 'bg-white border border-neutral-200/80 hover:border-primary-400 hover:shadow-md' // Pendente
  }`;

  return (
    <div
      className={cardClasses}
      onClick={() => onDistributeClick(item)} // O card inteiro é o botão
      role="button"
      tabIndex="0"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDistributeClick(item); }}
    >
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
            <span className="text-neutral-500">Restante: {restante.toLocaleString('pt-BR')}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleEditClick} title="Editar item" className="text-neutral-400 hover:text-amber-500 transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={handleDeleteClick} title="Excluir item" className="text-neutral-400 hover:text-danger transition-colors">
            <Trash2 size={18} />
          </button>
          {/* O ícone muda de cor com o hover do 'group' (o card) */}
          <Share2 size={18} className="text-neutral-400 transition-colors group-hover:text-primary-500" />
        </div>
      </div>
    </div>
  );
}
