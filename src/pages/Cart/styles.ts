import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
`;

export const CartContainer = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 40px 0;
  justify-content: center;
`;

export const PurchaseNotConfirmedCard = styled.div`
  .product-block {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .block {
      margin-bottom: 1rem;

      p {
        font-size: 1rem;
        margin-bottom: 0.5rem;

        strong {
          font-weight: 900;
          letter-spacing: 1px;
        }
      }

      & p:first-child {
        font-style: italic;
      }

      h4 {
        font-size: 1rem;
        margin-bottom: 0.5rem;

        font-weight: 900;
        letter-spacing: 1px;
      }
    }

    .quantity-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 900;
      letter-spacing: 1px;

      button {
        border: 1px solid #09f;
        padding: 0.1rem 0.5rem;
        background: #09f;
        color: #eee;
        border-radius: 0.25rem;

        &:hover {
          background: ${darken(0.1, '#09f')};
          color: ${darken(0.1, '#eee')};
        }
      }

      p {
        border: 1px solid #bbb;
        padding: 0.1rem 0.5rem;
        background: #ddd;
        color: #eee;
        border-radius: 0.25rem;
      }
    }
  }

  .confirmation-ask {
    margin-bottom: 1rem;
    font-weight: normal;
    font-size: 1.25rem;
    letter-spacing: 1px;
    color: #05f;

    strong {
      font-weight: 900;
    }
  }

  .buy-or-cancel-commands {
    width: 15rem;
    margin-left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      background: #09f;
      padding: 0.25rem 0.5rem;
      color: #eee;
      border-radius: 0.25rem;
      border: 1ps solid #05f;

      &:hover {
        background: ${darken(0.1, '#09f')};
      }
    }

    .cancel {
      & > button {
        background: #f50;

        &:hover {
          background: ${darken(0.1, '#f50')};
        }
      }
    }
  }

  @media (max-width: 900px) {
    .product-block {
      margin-left: 2rem;
      display: grid;
      grid-template-columns: 1fr;

      .quantity-block {
        max-width: 200px;
      }
    }

    .confirmation-ask {
      margin-left: 2rem;
      max-width: 400px;
    }

    .buy-or-cancel-commands {
      margin-left: 2rem;
    }
  }
`;

export const PurchaseConfirmedCard = styled.div`
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.5rem;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  & > p {
    margin-bottom: 1.5rem;
  }

  .total-value-p {
    font-size: 1.25rem;
  }

  .order-info {
    h3 {
      font-weight: 700;
      letter-spacing: 1.5px;

      margin-bottom: 1rem;
    }

    img {
      height: 200px;
      width: auto;

      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
  }

  .seller-info {
    border-top: 1px solid #008b8b;
    h3 {
      margin-bottom: 1rem;
    }
  }

  & > div > button {
    background: #09f;
    padding: 0.25rem 0.5rem;
    color: #eee;
    border-radius: 0.25rem;

    &:hover {
      background: ${darken(0.1, '#09f')};
    }
  }

  @media (max-width: 900px) {
    & {
      margin-left: 2rem;
      width: 400px;
    }
  }
`;
