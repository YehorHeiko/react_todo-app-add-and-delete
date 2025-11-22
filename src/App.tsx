/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import Footer from './components/Footer/Footer';
import { addTodos, deleteTodo, getTodos, USER_ID } from './api/todos';

enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
export interface AddTodoEvent extends React.KeyboardEvent<HTMLInputElement> {}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [filter, setFilter] = useState<SortType | string>('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todoses = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    todoses();
  }, [todos]);

  const closeError = () => {
    setError(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  let visibleGoods = [...todos];

  if (filter === SortType.Active) {
    visibleGoods = visibleGoods.filter(good => !good.completed);
  }

  if (filter === SortType.Completed) {
    visibleGoods = visibleGoods.filter(good => good.completed);
  }

  function addTodo(e: AddTodoEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (text.trim()) {
        addTodos({
          title: text,
          completed: false,
        });
        setText('');
      }
    }
  }

  function deleteTodose(id: number) {
    deleteTodo(id);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          loading={loading}
          addTodo={addTodo}
          text={text}
          setText={setText}
        />
        <TodoList todos={visibleGoods} deleteTodo={deleteTodose} />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
