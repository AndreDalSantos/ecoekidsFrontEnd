import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    border: none;
    list-style-type: none;
    outline: 0;
  }

  body {
    background: #f9f9f9;
    /* background: #40e0d0; */
    color: #008B8B;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  body, input, button {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }

  /* #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 20px;
  } */
`;
