import React from "react";
import { v4 as uuid } from "uuid";
import unreduxed from "unreduxed";

export type Todo = {
  id: string;
  content: string;
  complete: boolean;
};

const getId = () => uuid();

const useTodo = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const add = React.useCallback((content: string) => {
    const id = getId();
    setTodos(prev => [...prev, { id, content, complete: false }]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const changeComplete = React.useCallback((id: string, complete: boolean) => {
    setTodos(todos =>
      todos.map(todo => {
        if (todo.id === id) return { ...todo, complete };
        else return todo;
      }),
    );
  }, []);

  React.useEffect(() => {
    const todosStr = localStorage.getItem("todos");

    if (!todosStr) return;

    setTodos(JSON.parse(todosStr));
  }, []);

  React.useEffect(() => {
    const todosStr = JSON.stringify(todos);
    localStorage.setItem("todos", todosStr);
  }, [todos]);

  return { todos, add, remove, changeComplete };
};

export const [TodoProvider, useTodoContainer] = unreduxed(useTodo);
