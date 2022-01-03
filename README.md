# Learning Vanilla Redux and React Redux

## Introduction Redux

- Redux is a pattern and library for managing and updating application state, using events called "actions." It serves as a centralized store for state that needs to be used across your entire application, with rules ensuring that the state can only be updated in a predictable fashion.

- Redux helps you manage "global" state - state that is needed across many parts of your application.

- Redux is more useful when:

  - You have large amounts of application state that are needed in many places in the app.

  - The app state is updated frequently over time.

  - The logic to update that state may be complex.

  - The app has a medium or large-sized codebase, and might be worked on by many people.

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

- `yarn add redux`

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
