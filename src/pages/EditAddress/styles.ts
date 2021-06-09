import { darken } from 'polished';
import styled from 'styled-components';

export const ProfileContainer = styled.div`
  width: 100%;
  margin: 0 auto;

  justify-content: center;
`;

export const BlockProfile = styled.div`
  margin: 25px 25px;

  button {
    background-color: #09f;
    color: #eee;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;

    border: 1px solid #555;

    &:hover {
      background-color: ${darken(0.1, '#09f')};
    }
  }

  .cep-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > button:first-child {
      background-color: #1fb;
      color: #555;

      &:hover {
        background-color: ${darken(0.1, '#1fb')};
      }
    }

    & > a {
      &:hover {
        color: ${darken(0.1, '#eee')};
        text-decoration: underline;
      }
    }

    /* & > button:nth-child(2) {
      background-color: #fb1;
      color: #eee;

      &:hover {
        background-color: ${darken(0.1, '#fb1')};
      }
    } */
  }
`;
