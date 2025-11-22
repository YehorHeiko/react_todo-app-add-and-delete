import { Todo } from '../../types/Todo';

type Props = {
  visibleGoods: Todo;
  deleteTodo: (id: number) => void;
};

const TodoItem: React.FC<Props> = ({ visibleGoods, deleteTodo }) => {
  return (
    <div
      data-cy="Todo"
      key={visibleGoods.id}
      className={`todo ${visibleGoods.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label" htmlFor={`todo-${visibleGoods.id}`}>
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={visibleGoods.completed}
          disabled
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {visibleGoods.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(visibleGoods.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
