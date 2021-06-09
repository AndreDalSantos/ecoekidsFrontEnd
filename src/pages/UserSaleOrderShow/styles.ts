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

      .reputation-line {
        display: flex;
        align-items: flex-end;

        & > strong {
          margin-right: 1rem;
          letter-spacing: 0.75px;
          font-family: 'Arial', sans-serif;
          font-weight: bold;
        }
      }

      .reputation-value-container {
        display: grid;
        width: 12rem;
        grid-template-columns: repeat(5, 1fr);

        .reputation-number {
          font-size: 1rem;
          height: 1.5rem;
          width: 1.5rem;
          border: 1px solid #09f;
          color: #09f;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.25rem;
        }

        .active-reputation-value {
          background-color: #09f;
          color: #eee;
          font-weight: bold;
        }
      }

      .avatar {
        margin-bottom: 1rem;
        margin-top: 1rem;
        img {
          height: 150px;
          width: 150px;
          border-radius: 0.25rem;
        }
      }

      .product-images {
        height: 100%;
        width: 550px;

        p {
          border: none;
        }

        img {
          height: 460px;
          width: 460px;
          border-radius: 0.5rem;

          @media (max-width: 600px) {
            & {
              width: 350px;
              height: 350px;
              padding: 0 auto;
            }
          }
        }

        .images {
          width: 460px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 5px;

          @media (max-width: 600px) {
            & {
              width: 350px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 5px;
            }
          }

          button img {
            height: 150px;
            width: 150px;
            border: 0;

            opacity: 0.6;
          }

          button.active img {
            opacity: 1;
          }
        }
      }

      .link-chat {
        background-color: transparent;
        color: #09f;

        &:hover {
          letter-spacing: 1px;
          color: #07f;
        }
      }
    }

    .status-order-content {
      h3 {
        margin-bottom: 1rem;
      }

      h4 {
        margin-bottom: 0.5rem;
      }

      button {
        padding: 0.25rem 0.5rem;
        margin-bottom: 1rem;

        background-color: #0f9;
        border: 1px solid #0f5;
        border-radius: 0.25rem;

        &:hover {
          background-color: ${darken(0.1, '#0f9')};
        }
      }

      & p {
        color: #444b;
        border: 0;
        margin-top: 0;
      }
    }
  }
`;
