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
