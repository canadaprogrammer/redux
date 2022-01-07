import React, { useState } from 'react';
import { connect } from 'react-redux';
import { actionsCreators } from '../store';
import Todo from '../components/Todo';

function Home({ toDos, addTodo }) {
  console.log(toDos);
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
        {toDos?.map((todo) => (
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
