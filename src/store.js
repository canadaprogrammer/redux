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
