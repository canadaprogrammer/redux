import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { del } from '../store';

function Todo({ text, onClick, id }) {
  return (
    <>
      <li>
        <Link to={`/${id}`}>{text}</Link>
        <button onClick={onClick}>Del</button>
      </li>
      <style jsx='true'>
        {`
          button {
            margin-left: 1rem;
          }
        `}
      </style>
    </>
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(del(ownProps.id)),
  };
}
export default connect(null, mapDispatchToProps)(Todo);
