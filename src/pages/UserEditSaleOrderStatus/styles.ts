import { darken } from 'polished';
import styled from 'styled-components';

export const OrderContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 30px 25px;

  justify-content: center;

  .order-block {
    border: 1px solid #008b8b;
    border-radius: 0.5rem;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }

    .block-content {
      padding: 1rem;

      h2 {
        font-family: 'Arial', sans-serif;
        letter-spacing: 1px;
        font-weight: bold;
        margin-bottom: 1rem;
      }

      .order-evaluate {
        color: #07f;
      }

      p {
        font-family: 'Arial', sans-serif;
        margin-bottom: 0.5rem;
        letter-spacing: 0.75px;
        font-style: italic;
        border-bottom: 1px dotted #008b8b;

        list-style: inside;

        &:last-child {
          margin-bottom: 0;
          border-bottom: 0;

          margin-top: 0.5rem;
        }

        strong {
          font-style: normal;
          font-weight: bold;
        }
      }

      .change-status-block {
        h4 {
          letter-spacing: 1px;

          & strong {
            font-weight: bold;
          }
        }
        .change-status-buttons {
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 600px;

          @media (max-width: 600px) {
            width: 400px;
          }

          & button {
            padding: 0.25rem 0.5rem;
            background-color: red;
            color: #eee;
            border-radius: 0.25rem;
            letter-spacing: 1px;
            border: 1px solid #555;

            &:first-child {
              background-color: #0f7;
              color: #555;

              &:hover {
                background-color: ${darken(0.1, '#0f7')};
                font-weight: bold;
              }
            }

            &:nth-child(2) {
              background-color: #f70;
              color: #eee;

              &:hover {
                background-color: ${darken(0.1, '#f70')};
                font-weight: bold;
              }
            }
          }
        }

        & p {
          margin-top: 1rem;
        }
      }
    }
  }
`;
