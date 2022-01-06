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
function saveToLocalStorage(state) {
  try {
    const localState = JSON.stringify(state);
    localStorage.setItem('persistantState', localState);
  } catch (e) {
    console.warn(e);
  }
}
function loadFromLocalStorage() {
  try {
    const localState = localStorage.getItem('persistantState');
    if (localState === null) {
      return undefined;
    }
    return JSON.parse(localState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}
const store = createStore(reducer, loadFromLocalStorage());

store.subscribe(() => saveToLocalStorage(store.getState()));

export const actionsCreators = {
  addTodo,
  delTodo,
};
export default store;
