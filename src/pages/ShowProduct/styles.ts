import styled from 'styled-components';
import { darken, shade } from 'polished';

export const ProductContainer = styled.div`
  width: 100%;
  /* max-width: 1280px; */
  margin: 0 auto;
  padding: 40px 0;
  padding: 0;
  /* margin-top: --140px; */

  justify-content: center;

  header.header-container {
    background-color: ${shade(-0.4, '#ffb84d')};
    height: 200px;
    margin-top: 0;

    div.header-container-2 {
      max-width: 1536px;
      margin: auto;

      display: grid;

      grid-template-columns: 250px 4fr 100px 100px 100px;
      grid-gap: 32px;

      align-items: center;

      form.form-search-container {
        display: grid;
        grid-template-columns: 4fr 1fr;
        grid-gap: 8px;

        align-items: center;

        button {
          margin: 0;
        }
      }

      div.login-link-container {
        text-align: center;

        a {
          text-decoration: none;
          text-transform: uppercase;
          color: #8000ff;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 1px;
        }
      }
    }
  }

  .general-product {
    width: 100%;
    max-width: 1280px;
    margin: 3rem auto;
    padding: 0 2rem;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;

    .product-images {
      height: 100%;
      width: 100%;
      max-width: 550px;

      img {
        height: 460px;
        width: 460px;
        border-radius: 0.5rem;
      }

      @media (max-width: 500px) {
        & {
          & > img {
            height: 350px;
            width: 350px;
          }
        }
      }
      .images {
        width: 350px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 5px;

        button img {
          height: 150px;
          width: 150px;
          border: 0;

          opacity: 0.6;
        }

        button.active img {
          opacity: 1;
        }

        @media (max-width: 500px) {
          & {
            width: 350px;
            height: 350px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 5px;
          }
        }
      }
    }

    .product-details {
      & h1 {
        padding: 10px 10px 10px 0;
      }

      & h2 {
        padding: 0px 10px 10px 0;
      }

      & h3 {
        padding: 0px 10px 10px 0;
      }

      & p {
        padding: 0px 10px 10px 0;
      }

      button {
        margin-top: 15px;

        background-color: #00ff00;
        color: #008080;
        padding: 7px;
        font-size: 20px;
        font-weight: bold;

        border-radius: 8px;

        transition: background-color 0.2s;

        &:hover {
          background-color: ${shade(0.2, '#00ff00')};
        }
      }

      .reputation-line {
        display: flex;
        /* flex-direction: column; */

        & > strong {
          margin-right: 1rem;
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

      .link-edit-product,
      .link-buy-product,
      .link-list-chats,
      .link-talk-seller,
      .not-available-product {
        background-color: #09f;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12rem;
        border: 1px solid #06f;
        border-radius: 0.25rem;
        font-weight: bold;

        & > p {
          padding: 0.5rem;
          color: #eee;
          letter-spacing: 1px;
        }

        &:hover {
          background-color: ${darken(0.1, '#09f')};
          color: ${darken(0.1, '#eee')};
        }
      }

      .link-buy-product {
        width: 7rem;
        background: #0f9;
        border: 1px solid #0f4;

        & > P {
          color: #555;
        }

        &:hover {
          background-color: ${darken(0.1, '#0f9')};
          color: ${darken(0.1, '#555')};
        }
      }

      .link-list-chats,
      .link-talk-seller {
        width: 14rem;
        background: #ffa500;
        border: 1px solid #ffa100;
        margin-bottom: 0.5rem;

        & > P {
          color: #555;
        }

        &:hover {
          background-color: ${darken(0.1, '#ffa500')};
          color: ${darken(0.1, '#555')};
        }
      }

      .link-list-chats {
        width: 18rem;
      }

      .not-available-product {
        background: transparent;
        justify-content: flex-start;
        border: 1px solid #f30;

        & > P {
          color: #f30;
        }

        &:hover {
          background-color: transparent;
        }
      }
    }
  }

  @media (max-width: 900px) {
    .general-product {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 10px;

      padding: 0 auto;
    }
  }

  .comments {
    width: 100%;
    max-width: 1280px;
    margin: 3rem auto;

    padding-right: 2rem;
    padding-left: 2rem;

    .create-comment {
      & > button {
        background-color: #09f;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14rem;
        border: 1px solid #06f;
        border-radius: 0.25rem;
        font-weight: bold;

        padding: 0.5rem;
        color: #eee;
        letter-spacing: 1px;

        &:hover {
          background-color: ${darken(0.1, '#09f')};
          color: ${darken(0.1, '#eee')};
        }
      }

      .insert-comment {
        & > form {
          & > div {
            & > textarea {
              border: 1px solid #008080;
              padding: 1rem;

              border-radius: 0.25rem;
            }
          }

          & div:nth-child(2) {
            width: 410px;
            display: flex;
            justify-content: space-between;

            margin-top: 1rem;
            margin-bottom: 2rem;

            & button {
              background: #ff6000;
              padding: 0.5rem;
              color: #eee;
              border: 1px solid #000;
              border-radius: 0.25rem;

              &:hover {
                background: ${darken(0.1, '#ff6000')};
              }
            }

            .save-comment-button {
              margin-right: 0;
              background: #09f;

              &:hover {
                background: ${darken(0.1, '#09f')};
              }
            }
          }
        }
      }
    }

    .all-comments {
      display: grid;
      grid-template-columns: 1fr;

      .comment-container {
        background-color: #cff;
        color: #444;
        margin-top: 10px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #008080;

        .comment-header {
          padding-bottom: 0.25rem;
        }

        & > p.comment-created-date {
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #777;
        }
      }

      .comment-container:first-child {
        margin-top: 25px;
      }

      .comment-container:last-child {
        margin-bottom: 25px;
      }
    }
  }
`;
