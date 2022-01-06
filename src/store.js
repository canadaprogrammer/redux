import { createStore } from 'redux';

const ADD = 'ADD';
const DEL = 'DEL';

const addTodo = (text) => {
  return { type: ADD, text };
};
const delTodo = (id) => {
  return { type: DEL, id: parseInt(id) };
};

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

export const actionsCreators = {
  addTodo,
  delTodo,
};
export default store;
