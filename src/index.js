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
