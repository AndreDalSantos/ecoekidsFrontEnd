import { darken } from 'polished';
import styled from 'styled-components';

export const ProfileContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;

  .content {
    display: grid;
    grid-template-columns: 1fr;

    .edit-buttons {
      width: 100%;
      max-width: 800px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;

      div.edit-link-container {
        & button {
          padding: 0.25rem 0.5rem;
          background-color: #09f;
          color: #eee;
          border-radius: 0.25rem;

          &:hover {
            background-color: ${darken(0.1, '#09f')};
          }

          &:first-child {
            margin-left: 2rem;
          }

          &:last-child {
            margin-right: 2rem;
          }
        }

        & button.address {
          background-color: #0f9;
          color: #444;

          &:hover {
            background-color: ${darken(0.1, '#0f9')};
            color: ${darken(0.1, '#444')};
          }
        }

        & button.avatar {
          background-color: #f90;
          color: #eee;

          &:hover {
            background-color: ${darken(0.1, '#f90')};
            color: ${darken(0.1, '#eee')};
          }
        }
      }
    }
  }
`;

export const BlockProfile = styled.div`
  padding: 2rem;
  width: 100%;
  max-width: 800px;

  p,
  img,
  h3,
  div {
    margin-bottom: 1rem;
  }

  h3 {
    border-bottom: 1px solid #008b8b;
  }

  .address {
    margin-bottom: 0;
  }

  & > img {
    max-height: 150px;
    max-width: 150px;
    height: auto;
    width: auto;
    border: 1px solid #008b8b;
    border-radius: 0.25rem;
  }

  .reputation-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 300px;

    & > p {
      margin-bottom: 0;
    }

    .reputation-value-container {
      display: grid;
      width: 12rem;
      grid-template-columns: repeat(5, 1fr);
      margin-bottom: 0;

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
        margin-bottom: 0;
      }

      .active-reputation-value {
        background-color: #09f;
        color: #eee;
        font-weight: bold;
      }
    }
  }
`;
