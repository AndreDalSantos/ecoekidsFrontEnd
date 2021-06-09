import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  margin: 2rem;

  form {
    margin-top: 1rem;

    legend {
      font-size: 1.25rem;
      letter-spacing: 0.8px;
      margin-bottom: 0.5rem;
    }

    .photo-block {
      .image-container {
        display: flex;
        flex-wrap: wrap;
        div {
          position: relative;
          img {
            /* max-height: 150px;
            max-width: 150px;
            height: auto;
            width: auto; */

            height: 150px;
            width: 150px;
            object-fit: contain;
            border-radius: 0.5rem;
          }

          & > label {
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

            left: 0px;
            top: 0px;

            &:hover {
              background: #ffffff99;
              color: ${darken(0.4, '#008b8b')};
            }
          }
        }

        & > input[type='file'] {
          visibility: hidden;
        }
      }
    }

    .button-edit {
      margin-top: 0.5rem;
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
    }
  }
`;
