import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0;

  .total-products-advertise {
    margin-top: 1rem;
    text-align: center;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
  }
`;

export const HeaderHome = styled.header`
  div.header-external {
    width: 100%;
    background-color: #c4d8f9;
    border-bottom: 1px solid #666;

    div.header-internal {
      height: 8rem;
      margin: 0 auto;

      padding: 1rem 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h1 {
        font-size: 2rem;
      }
      h2 {
        font-size: 1.5rem;
      }
      span p textarea {
        font-size: 1rem;
      }

      & > a {
        margin-right: 1rem;
        h1 {
          color: #07f;
          font-weight: bold;
        }

        h2 {
          color: #09f;
        }
      }

      form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 60rem;

        & > div:first-child {
          display: grid;
          grid-template-columns: 1fr 65px;
          height: 3rem;

          & > input {
            border: 1px solid #07f;
            border-radius: 0.5rem 0 0 0.5rem;
            padding-left: 32px;
            color: #07f;
          }

          & > input::placeholder {
            color: #0af;
          }

          & > button {
            background-color: #09f;
            color: #444;
            border-radius: 0 0.5rem 0.5rem 0;
          }

          & > button:hover {
            background-color: ${darken(0.1, '#09f')};
            color: #eee;
          }
        }

        & > div:nth-child(2) {
          margin-top: 1rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;

          & > select {
            width: 10rem;
            display: grid;
            grid-template-columns: 1fr;
            border: 1px solid #09f;
            padding: 0.3rem;
            border-radius: 0.4rem;
            background-color: #0ef;
            color: #07f;
          }
        }

        @media (max-width: 1000px) {
          & > div:nth-child(2) {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;

            & > select {
              margin-top: 0.5rem;
            }
          }
        }
      }

      nav.primary > ul {
        margin-left: 1rem;
        display: flex;
        justify-content: space-between;
      }

      nav.primary ul > li {
        margin-right: 2rem;
      }

      nav.primary > ul > li > a {
        display: flex;
        align-items: center;
        height: 3rem;
        color: #07f;
      }

      nav.primary > ul > li > a:hover {
        color: ${darken(0.1, '#07f')};
        transition: 200ms;
      }

      nav.primary > ul > li > a > i {
        margin-right: 8px;
      }

      .dropdown-container {
        position: relative;
      }

      .dropdown-container:hover .dropdown {
        top: 2.5rem;
        opacity: 1;
        visibility: initial;
      }

      ul.dropdown {
        position: absolute;
        top: 2rem;
        left: 0;

        margin-top: 0.25rem;
        padding: 0.5rem 0;

        width: 10.75rem;
        display: flex;
        flex-direction: column;
        background-color: white;

        border-radius: 0.25rem;
        box-shadow: 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.6);

        opacity: 0;
        visibility: hidden;

        transition: all 200ms;

        z-index: 1;
      }

      ul.dropdown li a,
      ul.dropdown li button {
        background-color: #fff;
        font-size: 1rem;
        color: #333;
        display: flex;
        justify-content: flex-start;

        width: 100%;
        height: 3rem;

        padding: 0 1rem;
        border-radius: 0.25rem;
      }

      ul.dropdown li button {
        cursor: pointer;
      }

      ul.dropdown li:hover a,
      ul.dropdown li:hover button {
        background-color: #eee;
      }

      .actions.dropdown-container {
        display: flex;
        align-items: center;
        height: 3rem;
        cursor: pointer;
        padding: 0 1rem;
      }

      .actions.dropdown-container:hover {
        background-color: white;
      }

      .new-messages {
        background-color: #f50;
        color: yellow;
        font-size: 0.75rem;
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        border-radius: 0.25rem;
        padding: 0.25rem;
        max-height: 1.25rem;
      }
    }

    @media (max-width: 1500px) {
      div.header-internal {
        height: 22rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        h1 {
          font-size: 1rem;
        }

        h2 {
          font-size: 0.7rem;
        }
      }
    }
  }
`;

export const ProductsCardsContainer = styled.div`
  width: 100%;
  max-width: 70rem;
  margin: 3rem auto;

  & > div {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
  }

  @media (max-width: 1000px) {
    & > div {
      /* margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 2rem; */

      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const Pagination = styled.div`
  margin: 0 auto;
  align-self: center;
  margin-bottom: 2rem;
  display: flex;
  width: 30rem;
  min-width: 360px;
  max-width: 900px;
  justify-content: space-between;
  margin-top: 10px;
`;

export const PaginationButton = styled.div`
  display: flex;
`;

export const PaginationItem = styled.div`
  margin: 0 10px;
  cursor: pointer;

  ${props =>
    props['aria-selected'] && {
      background: '#6d6d6d',
      padding: '0 5px',
    }}
`;
