# Learning Vanilla Redux and React Redux

## Initialization

- `npx create-react-app vanilla-redux`

- Remove files on `src` except `index.js`

- Use empty `index.js` for Vanilla JS

## Vanilla Counter

- `/public/index.html`

  - ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>Vanilla Redux</title>
      </head>
      <body>
        <button id="plus">Plus</button>
        <span>0</span>
        <button id="minus">Minus</button>
      </body>
    </html>
    ```

- `/src/index.js`

  - ```js
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
    ```
