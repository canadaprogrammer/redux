import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

function Detail({ todos }) {
  const params = useParams();
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
