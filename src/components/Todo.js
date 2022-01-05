import React from 'react';
import { connect } from 'react-redux';
import { actionsCreators } from '../store';

function Todo({ text, onClick }) {
  return (
    <li>
      {text}
      <button onClick={onClick}>Del</button>
    </li>
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(actionsCreators.delTodo(ownProps.id)),
  };
}
export default connect(null, mapDispatchToProps)(Todo);
