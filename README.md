# Learning Vanilla Redux and React Redux

## Introduction Redux

- Redux is a pattern and library for managing and updating application state, using events called "actions." It serves as a centralized store for state that needs to be used across your entire application, with rules ensuring that the state can only be updated in a predictable fashion.

- Redux helps you manage "global" state - state that is needed across many parts of your application.

- Redux is more useful when:

  - You have large amounts of application state that are needed in many places in the app.

  - The app state is updated frequently over time.

  - The logic to update that state may be complex.

  - The app has a medium or large-sized codebase, and might be worked on by many people.

### Three Principles

- Single source of truth

  - The global state of your application is stored in an object tree within a single store.

- State is read-only

  - The only way to change the state is to emit an action, an object describing what happened.

- Changes are made with pure functions.

  - To specify how the state tree is transformed by actions, you write pure reducers.

  - Remember to return new state objects, instead of mutating the previous state.

## Initialization

- `npx create-react-app vanilla-redux`

- Remove files on `src` except `index.js`

- Use empty `index.js` for Vanilla JS

## Vanilla Counter

- `/public/index.html`

  - ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>Vanilla Redux</title>
      </head>
      <body>
        <button id="plus">Plus</button>
        <span>0</span>
        <button id="minus">Minus</button>
      </body>
    </html>
    ```

- `/src/index.js`

  - ```js
    const plus = document.querySelector('#plus');
    const minus = document.querySelector('#minus');
    const number = document.querySelector('span');

    let count = 0;

    const updateText = () => {
      number.innerText = count;
    };

    plus.addEventListener('click', () => {
      count++;
      updateText();
    });
    minus.addEventListener('click', () => {
      count--;
      updateText();
    });
    ```

## Pure Redux Counter

- `npm i redux`

### `createStore(reducer, [preloadedState], [enhancer])`

- Creates a Redux store that holds the complete state tree of you app. There should only be a single store in your app.

- **Arguments**

  - `reducer` (function): A reducing function that returns the next state tree, given the current state tree and an action to handle. It modifies the data.

    - `reducer = (state: S, action: A) => S`

  - `preloadedState` (any): The initial state. You may optionally specify it to hydrate the state from the server in universal apps, or to restore a previously serialized user session. If you produced `reducer` with `combineReducers`, this must be a plain object with the same shape as the keys passed to it. Otherwise, you are free to pass anything that your `reducer` can understand.

    - The `combineReducers(reducers)` helper function turns an object whose values are different reducing functions into a single reducing function you can pass to `createStore`.

  - `enhancer` (function): The store enhancer. You may optionally specify it to enhance the store with third-party capabilities such as middleware, time travel, persistence, etc. The only store enhancer that ships with Redux is `applyMiddleware(...middleware)`.

    - Middleware is the suggested way to extend Redux with custom functionality. Middleware lets you wrap the store's `dispatch` method for fun and profit.

- **Returns**

  - (Store): An object that holds the complete state of your app. The only way to change its state is by dispatching actions. You may also subscribe to the changes to its state to update the UI.

    - `dispatch({type: '', [payload: '']})`: It dispatches an action.

      - The only way to update the state is to call `store.dispatch()` and pass in an action object. The store will run its reducer function and save the new state value inside, and we can call `getState()` to retrieve the updated value.

      - The action object should have `type`.

    - `getStore()`: It returns the updated state.

    - `subscribe(fn)`: When the store is changed, the function will be executed.

- `index.js`

  - ```js
    import { createStore } from 'redux';

    const plus = document.querySelector('#plus');
    const minus = document.querySelector('#minus');
    const number = document.querySelector('span');

    number.innerText = 0;

    const PLUS = 'PLUS';
    const MINUS = 'MINUS';

    const countModifier = (count = 0, action) => {
      switch (action.type) {
        case PLUS:
          return count + 1;
        case MINUS:
          return count - 1;
        default:
          return count;
      }
    };

    const countStore = createStore(countModifier);

    const updateCount = () => {
      number.innerText = countStore.getState();
    };

    countStore.subscribe(updateCount);

    plus.addEventListener('click', () => {
      countStore.dispatch({ type: PLUS });
      // updateCount();
    });

    minus.addEventListener('click', () => {
      countStore.dispatch({ type: MINUS });
      // updateCount();
    });
    ```

## Vanilla Todos

- ```js
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const ul = document.querySelector('ul');

  const todos = [];

  const updateTodos = () => {
    ul.innerHTML = '';
    todos.forEach((todo) => {
      const list = document.createElement('li');
      const button = document.createElement('button');
      button.addEventListener('click', () => deleteTodo(todo.id));
      button.innerText = 'Del';
      list.id = todo.id;
      list.innerText = todo.text;
      list.append(button);
      ul.append(list);
    });
  };
  const deleteTodo = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
    updateTodos();
  };
  const createTodo = (toDo) => {
    const todo = { text: toDo, id: Date.now() };
    todos.unshift(todo);
    updateTodos();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value !== '') {
      const todo = input.value;
      input.value = '';
      input.focus();
      createTodo(todo);
    }
  });

  window.addEventListener('load', () => {
    todos.forEach((todo) => {
      const list = document.createElement('li');
      list.innerText = todo;
      ul.append(list);
    });
  });
  ```

## Pure Redux Todos

- ```js
  import { createStore } from 'redux';

  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const ul = document.querySelector('ul');

  const ADD = 'ADD';
  const DELETE = 'DELETE';

  const addTodo = (text) => ({
    type: ADD,
    text,
  });

  const delTodo = (id) => ({
    type: DELETE,
    id,
  });

  const reducer = (state = [], action) => {
    switch (action.type) {
      case ADD:
        const newTodo = { text: action.text, id: Date.now() };
        return [newTodo, ...state];
      case DELETE:
        // let todos = [...state];
        // const index = todos.findIndex((todo) => todo.id === action.id);
        // if (index !== -1) {
        //   todos.splice(index, 1);
        // }
        // return todos;
        return state.filter((todo) => todo.id !== action.id);
      default:
        return state;
    }
  };

  const store = createStore(reducer);

  const dispatchAddTodo = (text) => store.dispatch(addTodo(text));
  const dispatchDelTodo = (id) => store.dispatch(delTodo(id));

  const updateList = () => {
    const todos = store.getState();
    ul.innerHTML = '';
    todos.forEach((todo) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.innerText = 'Del';
      btn.addEventListener('click', () => dispatchDelTodo(todo.id));
      li.id = todo.id;
      li.innerText = todo.text;
      li.appendChild(btn);
      ul.appendChild(li);
    });
  };
  store.subscribe(updateList);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value && input.value !== '') {
      const todo = input.value;
      input.value = '';
      input.focus();
      dispatchAddTodo(todo);
    }
  });
  ```

## Notes

### `Element.append()` vs `Node.appendChild()`

- The `Element.append()` method inserts a set of `Node` objects or `DOMString` objects after the last child of the Element. DOMString objects are inserted as equivalent Text nodes.

- The `Node.appendChild()` method adds a `Node` object to the end of the list of children of a specified parent node. If the given child is a reference to an existing node in the document, `appendChild() moves it from its current position to the new position.

- Differences

  - `Element.append()` allows you to also append `DOMString` objects, whereas `Node.appendChild()` only accepts `Node` objects.

    - ```js
      ul.append('text'); // 'text'
      ul.appendChild('text'); // Error: parameter is not of type 'Node'
      ```

  - `Element.append()` has no return value, whereas `Node.appendChild()` returns the appended `Node` object.

    - ```js
      console.log(ul.append(A)); // undefined
      console.log(ul.appendChild(A)); // Node A
      ```

  - `Element.append()` can append several nodes and strings, whereas `Node.appendChild()` can only append one node.

    - ```js
      ul.append(A, B); // appended both
      ul.appendChild(A, B); // appended only A
      ```
