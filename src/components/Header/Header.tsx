import { AddTodoEvent } from '../../App';

type Props = {
  loading: boolean;
  setText: (value: string) => void;
  addTodo: (e: AddTodoEvent) => void;
  text: string;
};

function Header({ loading, addTodo, text, setText }: Props) {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled={loading}
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          onKeyDown={addTodo}
        />
      </form>
    </header>
  );
}

export default Header;
