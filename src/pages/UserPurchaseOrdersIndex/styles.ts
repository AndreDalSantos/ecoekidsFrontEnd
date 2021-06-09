import styled from 'styled-components';

export const OrdersContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 30px 25px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    letter-spacing: 1px;
    font-size: 2rem;
  }
`;

export const OrderCard = styled.div`
  width: 600px;
  margin: 10px auto 0 auto;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #09f;
  font-family: 'Arial', sans-serif;
  font-style: italic;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    width: 400px;
  }

  background-color: #fff;
  color: #555;

  p {
    margin-bottom: 1rem;
    border-bottom: 1px solid #0df;

    strong {
      font-weight: bold;
      font-style: normal;
    }

    &:last-child {
      margin-bottom: 0;
      border: none;
    }
  }
`;
