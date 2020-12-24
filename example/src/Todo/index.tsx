import React from "react";
import classnames from "classnames";
import { Todo as ITodo, TodoProvider, useTodoContainer } from "./container";
import styles from "./styles.css";

export const TodoApp: React.FC = () => {
  return (
    <TodoProvider>
      <div className={styles.root}>
        <AddTodo />
        <Todos />
      </div>
    </TodoProvider>
  );
};

const AddTodo: React.FC = () => {
  const add = useTodoContainer(container => container.add);
  const [content, setContent] = React.useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content) {
      add(content);
      setContent("");
    }
  };

  return (
    <form className={styles.addForm} onSubmit={submit}>
      <input
        className={styles.addInput}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="input your todo..."
      />
      <button className={styles.addButton} type="submit">
        Add
      </button>
    </form>
  );
};

const Todos: React.FC = () => {
  const todos = useTodoContainer(container => container.todos);

  return (
    <div className={styles.todos}>
      {todos.map(todo => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

const Todo: React.FC<{ todo: ITodo }> = React.memo(({ todo }) => {
  const changeComplete = useTodoContainer(container => container.changeComplete);
  const remove = useTodoContainer(container => container.remove);

  return (
    <div className={classnames(styles.todo, todo.complete && styles.todoDone)}>
      <input
        className={styles.todoComplete}
        type="checkbox"
        checked={todo.complete}
        onChange={e => changeComplete(todo.id, e.target.checked)}
      />
      <p className={styles.todoContent}>{todo.content}</p>
      <button className={styles.todoRemove} onClick={() => remove(todo.id)}>
        ×
      </button>
    </div>
  );
});
