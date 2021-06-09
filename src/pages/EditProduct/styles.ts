import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  .content {
    margin: 2rem;

    & > h1 {
      letter-spacing: 1px;
      margin-bottom: 1rem;
    }

    form {
      margin-top: 1rem;

      legend {
        font-size: 1.25rem;
        letter-spacing: 0.8px;
        margin-bottom: 0.5rem;
      }

      .input-block {
        margin-bottom: 1rem;
        display: flex;
        /* align-items: center; */
        flex-direction: column;
        align-items: flex-start;

        input {
          border: 1px solid #008b8b;
          /* margin-left: 1rem; */
          height: 3rem;
          width: 100%;
          max-width: 100rem;
          padding: 0.25rem 0.5rem;
          color: #076;
          border-radius: 0.25rem;
        }
      }
      .number-input {
        padding-left: 0;
      }

      @media (max-width: 670px) {
        .input-block:nth-child(4) {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .quantity-alert {
        margin-top: 0;
        margin-bottom: 2rem;
        color: red;
        display: grid;
        width: 600px;
        grid-template-columns: 1fr;
        background-color: yellow;

        @media (max-width: 650px) {
          & {
            width: 400px;
          }
        }
      }

      .inactive {
        margin: 0;
      }

      .select-block {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        select {
          border: 1px solid #008b8b;
          background: #fff;
          height: 3rem;
          width: 100%;
          max-width: 100rem;
          padding: 0.25rem 0.5rem;
          color: #076;
          border-radius: 0.25rem;
        }
      }

      .text-area-block {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        textarea {
          border: 1px solid #008b8b;
          padding: 0.25rem 0.5rem;
          color: #076;
          width: 100%;
          max-width: 100rem;
          border-radius: 0.25rem;
        }

        @media (max-width: 700px) {
          & > textarea {
            width: 400px;
          }
        }
      }

      .photos-block {
        .images-container {
          display: flex;
          flex-wrap: wrap;
          div {
            margin-right: 2rem;
            position: relative;
            img {
              width: 150px;
              height: 150px;
              border-radius: 0.5rem;
            }

            button {
              position: absolute;
              font-family: 'Arial', sans-serif;
              font-weight: bold;
              font-size: 75px;
              padding: 0.25rem;
              color: #008b8b;
              background: transparent;
              height: 150px;
              width: 150px;

              border-radius: 0.5rem;

              left: 0;
              top: 0;

              &:hover {
                background: #ffffff99;
                color: ${darken(0.4, '#008b8b')};
              }
            }
          }

          .new-image {
            height: 150px;
            width: 150px;
            background: #f5f8fa;
            border: 1px dashed #96d2f0;
            border-radius: 0.5rem;
            cursor: pointer;

            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
              background: ${darken(0.2, '#f5f8fa')};
            }
          }
        }

        & > input[type='file'] {
          visibility: hidden;
        }
      }

      .buttons-edit {
        display: flex;
        width: 400px;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 4rem;

        .confirm-button {
          background: #09f;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #eee;

          &:hover {
            background: ${darken(0.1, '#09f')};
          }
        }

        .false-button {
          background: #888;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #eee;
          cursor: none;
        }

        .delete-button {
          background: #f50;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #eee;

          &:hover {
            background: ${darken(0.1, '#f50')};
          }
        }

        .removing {
          h3 {
            margin-bottom: 1rem;
          }

          .remove-commands {
            display: flex;
            align-items: center;
            width: 400px;
            justify-content: space-between;

            .confirm-delete-button {
              background: #f50;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              color: #fff;

              &:hover {
                background: ${darken(0.1, '#f20')};
              }
            }

            .cancel-button {
              background: seagreen;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              color: #fff;

              &:hover {
                background: ${darken(0.1, 'seagreen')};
              }
            }
          }
        }
      }
    }
  }
`;
