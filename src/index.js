import { createStore } from 'redux';

const plus = document.querySelector('#plus');
const minus = document.querySelector('#minus');
const number = document.querySelector('span');

number.innerText = 0;

const PLUS = 'PLUS';
const MINUS = 'MINUS';

const countModifier = (count = 0, action) => {
  switch (action.type) {
    case PLUS:
      return count + 1;
    case MINUS:
      return count - 1;
    default:
      return count;
  }
};

const countStore = createStore(countModifier);

const updateCount = () => {
  number.innerText = countStore.getState();
};

countStore.subscribe(updateCount);

plus.addEventListener('click', () => {
  countStore.dispatch({ type: PLUS });
  // updateCount();
});

minus.addEventListener('click', () => {
  countStore.dispatch({ type: MINUS });
  // updateCount();
});
