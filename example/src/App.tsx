import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { Counter } from "./Counter";
import { ReduxLike } from "./ReduxLike";
import { TodoApp } from "./Todo";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link className={styles.headerLink} to="/counter">
          counter
        </Link>
        <Link className={styles.headerLink} to="/redux-like">
          redux-like
        </Link>
        <Link className={styles.headerLink} to="/todos">
          todo app
        </Link>
      </header>
      <main className={styles.main}>
        <Switch>
          <Route path="/counter">
            <Counter />
          </Route>
          <Route path="/todos">
            <TodoApp />
          </Route>
          <Route path="/redux-like">
            <ReduxLike />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
