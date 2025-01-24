import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #212529;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyles;
