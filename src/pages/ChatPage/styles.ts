import styled from 'styled-components';
// import { darken, shade } from 'polished';

export const ChatContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 40px 0;
  padding: 0;

  justify-content: center;

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  .external-container {
    width: 70rem;
    /* border: 1px solid #008b8b; */
    margin: 0 auto;
    height: 80vh;

    @media (max-width: 80rem) {
      & {
        width: 100%;
      }
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    height: 100vh;
    height: 90%;
    justify-content: space-between;
    width: 100vw;
    width: 100%;

    overflow: scroll;
    flex-direction: column-reverse;
  }

  .form {
    background: #008b8b;
    padding: 0.5rem;
    position: fixed;
    bottom: 1rem;
    width: 100%;
    max-width: 70rem;
  }

  .form__field {
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    color: #333;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    width: 100%;
  }

  .form__field:focus {
    border-color: #a3f7ff;
    box-shadow: 0 0 7px #a3f7ff;
    outline: none;
  }

  .list {
    margin: 0;
    padding: 1rem;
  }

  .list__item {
    list-style: none;
  }

  .list__item.list__item--mine {
    text-align: right;
  }

  .message {
    border: 1px solid transparent;
    border-radius: 5px;
    display: inline-block;
    list-style: none;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
  }

  .message.message--mine {
    background: #c3e88d;
    border-color: #82be27;
    text-align: right;
  }

  .message.message--other {
    background: #89ddff;
    border-color: #1abeff;
  }
`;

export const HeaderChat = styled.div`
  & > div {
    width: 70rem;
    /* border: 1px solid #008b8b; */
    margin: 1rem auto;
    /* height: 80vh; */

    border-bottom: 1px solid #008b8b;

    display: flex;
    align-items: center;
    justify-content: space-between;

    & > span > a {
      &:hover {
        letter-spacing: 1px;
        font-weight: bold;
      }
    }

    @media (max-width: 80rem) {
      & {
        width: 100%;
      }
    }

    @media (max-width: 55rem) {
      & {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        & > a {
          margin-bottom: 0.5rem;
        }
      }
    }
  }
`;
