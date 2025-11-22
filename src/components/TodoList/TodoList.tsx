import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
};

const TodoList: React.FC<Props> = ({ todos, deleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(e => (
        <TodoItem
          key={e.id}
          data-cy="Todo"
          visibleGoods={e}
          deleteTodo={deleteTodo}
        />
      ))}
    </section>
  );
};

export default TodoList;
