import React, { useEffect, useRef, useState } from 'react';
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
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const addTodo = async (e: AddTodoEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedText = text.trim();

      if (!trimmedText) {
        setError('Title should not be empty');
        setTimeout(() => setError(null), 3000);

        return;
      }

      const title = trimmedText.slice(0, 100);

      setText(title);

      const newTodo = {
        id: 0,
        title: title,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsSubmitting(true);

      try {
        const createdTodo = await addTodos({
          title,
          completed: false,
          userId: USER_ID,
        });

        setTodos(prev => [...prev, createdTodo]);
        setText('');
        setTempTodo(null);
      } catch (err) {
        setError('Unable to add a todo');
        setText(title);
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Функция для удаления задачи
  const deleteTodose = async (id: number) => {
    setLoading(true);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          loading={loading}
          addTodo={addTodo}
          text={text}
          setText={setText}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />
        <TodoList todos={visibleGoods} deleteTodo={deleteTodose} />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      {/* Error Notification */}
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
        {error}
      </div>

      {tempTodo && (
        <div className="todo-item">
          <div className="todo-item__content">
            <div className="todo-item__title">{tempTodo.title}</div>
            <div className="todo-item__loader">Загрузка...</div>
          </div>
        </div>
      )}
    </div>
  );
};
