const plus = document.querySelector('#plus');
const minus = document.querySelector('#minus');
const number = document.querySelector('span');

let count = 0;

const updateText = () => {
  number.innerText = count;
};

plus.addEventListener('click', () => {
  count++;
  updateText();
});
minus.addEventListener('click', () => {
  count--;
  updateText();
});
