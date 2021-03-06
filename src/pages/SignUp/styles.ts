import styled, { keyframes } from 'styled-components';
import { darken, shade } from 'polished';

import signUpBackgroundImg from '../../assets/sign-up-background.png';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  place-content: center;

  width: 100%;
  max-width: 850px;

  @media (max-width: 600px) {
    & {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      place-content: center;
      margin-top: 400px;

      width: 100%;
      max-width: 850px;
    }
  }
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opactity: 1;
    transform: translateX(0)
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 50px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;

      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }

    .form-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .block {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;

        &:first-child {
          margin-bottom: 5rem;
        }

        &:nth-child(2) {
          margin-bottom: 1rem;
        }

        &:last-child {
          margin-bottom: 3rem;
        }

        @media (max-width: 600px) {
          & {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            & div {
              margin-bottom: 0px;
            }
          }
        }
      }

      .cep-block {
        a {
          color: #009;
          display: block;
          width: 18rem;
          margin-top: 24px;

          text-decoration: none;
          transition: color 0.2s;

          &:hover {
            color: ${darken(0.2, '#f4ede8')};
          }
        }
      }
    }
  }

  /* Para estilizar uma tag que vem diretamente de um bloco, sem afetar outras tags de mesmo tipo que est??o um n??vel para dentro */
  > a {
    color: #333;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: cover;
`;
