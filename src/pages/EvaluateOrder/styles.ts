import { darken } from 'polished';
import styled from 'styled-components';

export const OrderContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 30px 25px;

  justify-content: center;

  .seller-block {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    border: 1px solid #008b8b;
    border-radius: 0.5rem;

    .seller-block-content {
      padding: 1rem;
      p {
        font-family: 'Arial', sans-serif;
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }

        strong {
          font-weight: bold;
        }
      }
    }
  }

  form {
    border: 1px solid #008b8b;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 2rem;
    /* width: 30rem; */
    max-width: 600px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .check-buttons-evaluate {
      & > button {
        border: 1px solid #008b8b;
        border-radius: 0.25rem;
        width: 50px;
        margin-left: 10px;
      }

      .not-selected {
        cursor: pointer;
        background-color: gray;
        color: white;
      }

      .free {
        cursor: pointer;
        background-color: white;
      }

      .selected {
        cursor: pointer;
        background-color: blue;
        color: white;
      }
    }

    .submit-button {
      padding: 0.25rem 0.5rem;
      background-color: #09f;
      color: #eee;
      border: 1px solid #07f;
      border-radius: 0.25rem;

      &:hover {
        background-color: ${darken(0.1, '#09f')};
      }
    }

    .false-button {
      cursor: not-allowed;
      padding: 0.25rem 0.5rem;
      background-color: #0099ff66;
      color: #eee;
      border: 1px solid #07f;
      border-radius: 0.25rem;
    }

    @media (max-width: 600px) {
      width: 400px;

      .submit-button,
      .false-button {
        margin-top: 1rem;
        width: 100%;
      }
    }
  }
`;
