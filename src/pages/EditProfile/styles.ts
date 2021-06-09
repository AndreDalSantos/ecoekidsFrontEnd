import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.div``;

export const BlockProfile = styled.div`
  margin: 2rem;

  form {
    .input-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 600px;

      margin-bottom: 1rem;

      @media (max-width: 600px) {
        & {
          width: 400px;
        }
      }

      p {
        margin-right: 1rem;
      }
    }

    & > button {
      background-color: #09f;
      color: #eee;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;

      &:hover {
        background-color: ${darken(0.1, '#09f')};
        color: ${darken(0.1, '#eee')};
      }
    }
  }
`;
