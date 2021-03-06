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

## Setup React

- `npm i react-redux react-router-dom`

- On `/public/index.html`

  - ```html
    <body>
      <div id="root"></div>
    </body>
    ```

- Create `/src/routes/Home.js`

  - `export default () => 'Home';`

- Create `/src/routes/Detail.js`

  - `export default () => 'Detail';`

* Create `/src/components/App.js`

  - ```jsx
    import React from 'react';
    import { HashRouter as Router, Routes, Route } from 'react-router-dom';
    import Home from '../routes/Home';
    import Detail from '../routes/Detail';

    function App() {
      return (
        <Router>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/:id' element={<Detail />}></Route>
          </Routes>
        </Router>
      );
    }

    export default App;
    ```

* On `/src/index.js`

  - ```jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './components/App';

    ReactDOM.render(<App />, document.getElementById('root'));
    ```

## React Redux

### Provider

- The `<Provider>` component makes the Redux `store` available to any nested components that need to access the Redux store.

- Since any React component in a React Redux app can be connected to the store, most applications will render a `<Provider>` at the top level, with the entire app's component tree inside of it.

- On `index.js`

  - ```jsx
    import { Provider } from 'react-redux';
    import store from './store';

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
    ```

### Connect: Extracting Data with `mapStateToProps`

- As the first argument passed in to `connect`, `mapStateToProps` is used for selecting the part of the data from the store that the connected component needs. It's frequently referred to as just `mapState` for short.

  - It is called every time the store state changes.

    - If you do not wish to subscribe to the store, pass `null` or `undefined` to `connect` in place of `mapStateToProps`.

  - It receives the entire store state, and should return an object of data this component needs.

- `function mapStateToProps(state, ownProps?)`

  - It should take a first argument called `state`, optionally a second argument called `ownProps`, and return a plain object containing the data that the connected component needs.

  - The first argument to a `mapStateToProps` function is the entire Redux store state (the same value returned by a call to `store.getState()`).

  - You may define the function with a second argument, `ownProps`, if your component needs the data from its own props to retrieve data from the store. This argument will contain all of the props given to the wrapper component that was generated by `connect`.

  - Your `mapStateToProps` function should return a plain object that contains the data the component needs:

    - Each field in the object will become a prop for your actual component.

    - The values in the fields will be used to determine if your component needs to re-render.

### Connect: Dispatching Actions with `mapDispatchToProps`

- As the second argument passed in to `connect`, `mapDispatchToProps` is used for dispatching actions to the store.

- React Redux gives you two ways to let components dispatch actions:

  - By default, a connected component receives `props.dispatch` and can dispatch actions itself.

  - `connect` can accept an argument called `mapDispatchToProps`, which lets you create functions that dispatch when called, and pass those functions as props to your component.

- `function mapDispatchToProps(dispatch, ownProps?)`

  - The `mapDispatchToProps` function will be called with `dispatch` as the first argument. You will normally make use of this by returning new functions that call `dispatch()` inside themselves, and either pass in a plain action object directly or pass in the result of an action creator.

    - ```js
      const mapDispatchToProps = (dispatch) => {
        return {
          // dispatching plain actions
          increment: () => dispatch({ type: 'INCREMENT' }),
          decrement: () => dispatch({ type: 'DECREMENT' }),
          reset: () => dispatch({ type: 'RESET' }),

          // explicitly forwarding arguments
          onClick: (event) => dispatch(trackClick(event)),

          // implicitly forwarding arguments
          onReceiveImpressions: (...impressions) =>
            dispatch(trackImpressions(impressions)),
        };
      };
      ```

  - The `ownProps` passed to the connected component as the second parameter, and will be re-invoked whenever the connected component receives new props.

  - This means, instead of re-binding new `props` to action dispatchers upon component re-rendering, you may do so when your component's `props` change.

    - ```js
      // Binds on component mount
      render() {
        return <button onClick={() => this.props.toggleTodo(this.props.todoId)} />
      }

      const mapDispatchToProps = dispatch => {
        return {
          toggleTodo: todoId => dispatch(toggleTodo(todoId))
        }
      }

      // Binds on `props` changes
      render() {
        return <button onClick={() => this.props.toggleTodo()} />
      }

      const mapDispatchToProps = (dispatch, ownProps) => {
        return {
          toggleTodo: () => dispatch(toggleTodo(ownProps.todoId))
        }
      }
      ```

  - Your `mapDispatchToProps` function should return a plain object:

    - Each field in the object will become a separate prop for your own component, and the value should normally be a function that dispatches an action when called.

    - If you use action creators (as oppose to plain object actions) inside `dispatch`, it is a convention to simply name the field key the same as the action creator.

    - The return will be merged to you connected component as props. You may call them directly to dispatch its action.

## React Redux Todo

- On `store.js`

  - ```jsx
    import { createStore } from 'redux';

    const ADD = 'ADD';
    const DEL = 'DEL';

    const addTodo = (text) => {
      return { type: ADD, text };
    };
    const delTodo = (id) => {
      return { type: DEL, id: parseInt(id) };
    };
    const reducer = (state = [], action) => {
      switch (action.type) {
        case ADD:
          return [{ text: action.text, id: Date.now() }, ...state];
        case DEL:
          return state.filter((s) => s.id !== action.id);
        default:
          return state;
      }
    };

    const store = createStore(reducer);

    export const actionsCreators = {
      addTodo,
      delTodo,
    };
    export default store;
    ```

- On `Home.js`

  - ```jsx
    import React, { useState } from 'react';
    import { connect } from 'react-redux';
    import { actionsCreators } from '../store';
    import Todo from '../components/Todo';

    function Home({ toDos, addTodo }) {
      const [text, setText] = useState('');
      function onChange(e) {
        setText(e.target.value);
      }
      function onSubmit(e) {
        e.preventDefault();
        addTodo(text);
        setText('');
      }
      return (
        <>
          <h1>To Do</h1>
          <form onSubmit={onSubmit}>
            <input type='text' value={text} onChange={onChange} />
            <button>Add</button>
          </form>
          <ul>
            {toDos.map((todo) => (
              <Todo {...todo} key={todo.id} />
            ))}
          </ul>
        </>
      );
    }

    function mapStateToProps(state) {
      return { toDos: state };
    }
    function mapDispatchToProps(dispatch) {
      return {
        addTodo: (text) => dispatch(actionsCreators.addTodo(text)),
      };
    }
    export default connect(mapStateToProps, mapDispatchToProps)(Home);
    ```

- On `Todo.js`

  - ```jsx
    import React from 'react';
    import { connect } from 'react-redux';
    import { actionsCreators } from '../store';

    function Todo({ text, onClick }) {
      return (
        <>
          <li>
            <button onClick={onClick}>Del</button>
          </li>
          <style jsx='true'>
            {`
              button {
                margin-left: 1rem;
              }
            `}
          </style>
        </>
      );
    }

    function mapDispatchToProps(dispatch, ownProps) {
      return {
        onClick: () => dispatch(actionsCreators.delTodo(ownProps.id)),
      };
    }
    export default connect(null, mapDispatchToProps)(Todo);
    ```

### Detail Page

- On `Todo.js`

  - ```jsx
    import { Link } from 'react-router-dom';

    function Todo({ text, onClick, id }) {
      return (
        <li>
          <Link to={`/${id}`}>{text}</Link>
    ```

- On `Detail.js`

  - ```jsx
    import React from 'react';
    import { connect } from 'react-redux';
    import { useParams } from 'react-router-dom';

    function Detail({ todos }) {
      const todo = todos?.find((toDo) => toDo.id === parseInt(params.id));
      return (
        <>
          <h1>{todo?.text}</h1>
          <h3>Created At: {new Date(todo?.id).toUTCString()}</h3>
        </>
      );
    }

    function mapStateToProps(state) {
      return {
        todos: state,
      };
    }
    export default connect(mapStateToProps)(Detail);
    ```

## LocalStorage

- On `store.js`

  - ```jsx
    const saveToLocalStorage = (todos) => {
      try {
        localStorage.setItem('toDos', JSON.stringify(todos));
      } catch (e) {
        console.warn(e);
      }
    };

    const reducer = (state = [], action) => {
      switch (action.type) {
        case ADD:
          const addTodos = [{ text: action.text, id: Date.now() }, ...state];
          saveToLocalStorage(addTodos);
          return addTodos;
        case DEL:
          const delTodos = state.filter((s) => s.id !== action.id);
          saveToLocalStorage(delTodos);
          return delTodos;
        default:
          return state;
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const localState = localStorage.getItem('toDos');
        if (localState === null) {
          return undefined;
        }
        return JSON.parse(localState);
      } catch (e) {
        console.warn(e);
        return undefined;
      }
    };

    const store = createStore(reducer, loadFromLocalStorage());
    ```

## Redux Toolkit

- `npm i @reduxjs/toolkit`

### `createAction()`

- It generates an action creator function for the given action type string. The function itself has `toString()` defined, so that it can be used in place of the type constant.

- `function crateAction(type, prepareAction?)`

- ```js
  const counter = createAction('counter');
  let action = counter(); // { type: 'counter' }
  action = counter(3); // { type: 'counter', payload: 3 }
  ```

- Because of their `toString()` override, action creators returned by `createAction()` can be used directly as keys for the case reducers passed to `createReducer()`.

- By default, the generated action creators accept a single argument, which becomes `action.payload`. This requires the caller to construct the entire payload correctly and pass it in.

- An optional second argument: a `prepareAction` that will be used to construct the payload value.

  - ```js
    import { createAction, nanoid } from '@reduxjs/toolkit';

    const addTodo = createAction('todos/add', function prepare(text) {
      return {
        payload: {
          text,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        },
      };
    });

    console.log(addTodo('Write more docs'));
    /**
     * {
     *   type: 'todos/add',
     *   payload: {
     *     text: 'Write more docs',
     *     id: '4AJvwMSWEHCchcWYga3dj',
     *     createdAt: '2019-10-03T07:53:36.581Z'
     *   }
     * }
     **/
    ```

- On `store.js`

  - ```jsx
    import { createAction } from '@reduxjs/toolkit';

    // const ADD = 'ADD';
    // const DEL = 'DEL';

    // const addTodo = (text) => {
    //   return { type: ADD, text };
    // };
    // const delTodo = (id) => {
    //   return { type: DEL, id: parseInt(id) };
    // };

    const addTodo = createAction('ADD');
    const delTodo = createAction('DEL');

    const reducer = (state = [], action) => {
      switch (action.type) {
        // case ADD:
        case addTodo.type:
          // const addTodos = [{ text: action.text, id: Date.now() }, ...state];
          const addTodos = [{ text: action.payload, id: Date.now() }, ...state];
          saveToLocalStorage(addTodos);
          return addTodos;
        case delTodo.type:
          // const delTodos = state.filter((s) => s.id !== action.id);
          const delTodos = state.filter((s) => s.id !== action.payload);
    ```

### `createReducer()`

- It uses `Immer` internally to drastically simplify immutable update logic by writing "mutative" code in your reducers, and supports directly mapping specific action types to case reducer functions that will update the state when that action is dispatched.

- Writing "mutating" reducers simplifies the code. However, the use of Immer does add some "magic", and Immer has its own nuances in behavior. Most importantly, **you need to ensure that your either mutate the `state` argument or return a new state, but not both.**

- On `store.js`

  - ```jsx
    // const reducer = (state = [], action) => {
    //   switch (action.type) {
    //     case addTodo.type:
    //       const addTodos = [{ text: action.payload, id: Date.now() }, ...state];
    //       saveToLocalStorage(addTodos);
    //       return addTodos;
    //     case delTodo.type:
    //       const delTodos = state.filter((s) => s.id !== action.payload);
    //       saveToLocalStorage(delTodos);
    //       return delTodos;
    //     default:
    //       return state;
    //   }
    // };

    const reducer = createReducer([], {
      // When the state is mutated, it shouldn't be returned.
      // unshift doesn't return anything.
      // Use `() => {}`, `not () => ` because the second one means "return the value."
      [addTodo]: (state, action) => {
        state.unshift({ text: action.payload, id: Date.now() });
        saveToLocalStorage(state);
      },
      // When the state is not mutated, the new state should be returned.
      // Use `() => ` or `() => { return }`.
      [delTodo]: (state, action) => {
        const newState = state.filter((s) => s.id !== action.payload);
        saveToLocalStorage(newState);
        return newState;
      },
    });
    ```

### `configureStore()`

- A friendly abstraction over the standard Redux `createStore` function that adds good defaults to the store setup for a better development experience.

- `configureStore` accepts a single configuration object parameter, with the following options:

  - `reducer`

  - `middleware`: An optional array of Redux middleware functions

  - `devTools`

    - If this is boolean, it will be used to indicate whether supporting for the Redux DevTools browser extension. Defaults to `true`.

    - If it's an object, the options object will be passed to `composeWithDevtools()`.

  - `preloadedState`: An optional initial state value to be passed to the Redux `createStore` function.

  - `enhancers`: An optional array of Redux store enhancers, or a callback function to customize the array of enhancers.

- ```jsx
  import {
    createAction,
    createReducer,
    configureStore,
  } from '@reduxjs/toolkit';

  // const store = createStore(reducer, loadFromLocalStorage());
  const store = configureStore({
    reducer,
    preloadedState: loadFromLocalStorage(),
  });
  ```

### `createSlice()`

- A function that accepts an initial state, an object of reducer functions, and a "slice name", and automatically generates action creators and action types that correspond to the reducers and state.

- On `store.js`

  - ```jsx
    import {..., createSlice } from '@reduxjs/toolkit';

    // const addTodo = createAction('ADD');
    // const delTodo = createAction('DEL');

    // const reducer = createReducer([], {
    //   [addTodo]: (state, action) => {
    //     state.unshift({ text: action.payload, id: Date.now() });
    //     saveToLocalStorage(state);
    //   },
    //   [delTodo]: (state, action) => {
    //     const newState = state.filter((s) => s.id !== action.payload);
    //     saveToLocalStorage(newState);
    //     return newState;
    //   },
    // });

    const todoSlice = createSlice({
      name: 'todoReducer',
      initialState: [],
      reducers: {
        add: (state, action) => {
          state.unshift({ text: action.payload, id: Date.now() });
          saveToLocalStorage(state);
        },
        del: (state, action) => {
          const newState = state.filter((s) => s.id !== action.payload);
          saveToLocalStorage(newState);
          return newState;
        },
      },
    });

    // const store = configureStore({
    //   reducer,
    //   preloadedState: loadFromLocalStorage(),
    // });
    const store = configureStore({
      reducer: todoSlice.reducer,
      preloadedState: loadFromLocalStorage(),
    });

    // export const actionsCreators = {
    //   addTodo,
    //   delTodo,
    // };
    export const { add, del } = todoSlice.actions;
    ```

- Change `actionsCreators` to `add` or `del` on `Home.js` and `Todo.js`

  - ```jsx
    // import { actionsCreators } from '../store';
    import { add } from '../store';

    function mapDispatchToProps(dispatch) {
      return {
        // addTodo: (text) => dispatch(actionsCreators.addTodo(text)),
        addTodo: (text) => dispatch(add(text)),
      };
    }
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

### Solution: react-scripts: v4.0.3, process is not defined

- On `package.json`, add `"react-error-overlay": "6.0.9"`

  - ```json
    "resolutions": {
      "react-error-overlay": "6.0.9"
    }
    ```

- Remove `node_modules` and `package-lock.json`

- `npm install`
