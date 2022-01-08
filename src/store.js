import { createStore } from 'redux';
import { createAction, createReducer, configureStore } from '@reduxjs/toolkit';

const addTodo = createAction('ADD');
const delTodo = createAction('DEL');

const saveToLocalStorage = (todos) => {
  try {
    localStorage.setItem('toDos', JSON.stringify(todos));
  } catch (e) {
    console.warn(e);
    return null;
  }
};

const reducer = createReducer([], {
  [addTodo]: (state, action) => {
    state.unshift({ text: action.payload, id: Date.now() });
    saveToLocalStorage(state);
  },
  [delTodo]: (state, action) => {
    const newState = state.filter((s) => s.id !== action.payload);
    saveToLocalStorage(newState);
    return newState;
  },
});

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
// const store = createStore(reducer, loadFromLocalStorage());
const store = configureStore({ reducer, loadFromLocalStorage });

export const actionsCreators = {
  addTodo,
  delTodo,
};
export default store;
