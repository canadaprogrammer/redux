import { createStore } from 'redux';
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

const saveToLocalStorage = (todos) => {
  try {
    localStorage.setItem('toDos', JSON.stringify(todos));
  } catch (e) {
    console.warn(e);
  }
};

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

export const actionsCreators = {
  addTodo,
  delTodo,
};
export default store;
