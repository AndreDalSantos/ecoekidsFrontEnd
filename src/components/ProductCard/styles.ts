import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  /* background: #f0f0f5; */
  /* background: #b0f0f8; */
  background: #c4d8f9;
  border-radius: 8px;
  width: 352px;

  & > a {
    text-decoration: none;
  }

  header {
    /* background: ${shade(-0.4, '#ffb84d')}; */
    background: #0af;
    border-radius: 8px 8px 8px 8px;
    height: 352px;
    overflow: hidden;
    transition: 0.3s opacity;
    text-align: center;

    img {
      pointer-events: none;
      user-select: none;
      height: 320px;
      width: 320px;
      margin-top: 15px;

      border-radius: 8px;
      background: no-repeat center;
      background-size: cover;
    }
  }

  section.body {
    padding: 30px;

    h2 {
      color: #3d3d4d;
    }

    p {
      color: #3d3d4d;

      margin-top: 16px;
    }

    .price {
      font-style: normal;
      font-size: 24px;
      line-height: 34px;
      color: #39b100;

      b {
        font-weight: 600;
      }
    }
  }
`;

// import styled from 'styled-components';
// import { shade } from 'polished';

// export const Container = styled.div`
//   background: #f0f0f5;
//   border-radius: 8px;

//   header {
//     background: ${shade(-0.4, '#ffb84d')};
//     border-radius: 8px 8px 8px 8px;
//     height: 195px;
//     overflow: hidden;
//     transition: 0.3s opacity;
//     text-align: center;

//     img {
//       pointer-events: none;
//       user-select: none;
//       height: 175px;
//       width: 90%;
//       margin-top: 10px;

//       border-radius: 8px;
//       background: no-repeat center;
//       background-size: cover;
//     }
//   }

//   section.body {
//     padding: 30px;

//     h2 {
//       color: #3d3d4d;
//     }

//     p {
//       color: #3d3d4d;

//       margin-top: 16px;
//       /* margin-top: auto; */
//     }

//     .price {
//       font-style: normal;
//       font-size: 24px;
//       line-height: 34px;
//       color: #39b100;

//       b {
//         font-weight: 600;
//       }
//     }
//   }

//   section.footer {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;

//     padding: 20px 30px;
//     background: #e4e4eb;
//     border-radius: 0px 0px 8px 8px;

//     div.icon-container {
//       display: flex;

//       div.around-link {
//         background: ${shade(-0.4, '#ffb84d')};

//         padding: 10px;
//         border-radius: 8px;
//         display: flex;
//         border: none;
//         transition: 0.1s;

//         a {
//           text-decoration: none;
//           color: #555;
//         }
//       }

//       button {
//         background: #fff;
//         padding: 10px;
//         border-radius: 8px;
//         display: flex;
//         border: none;
//         transition: 0.1s;

//         svg {
//           color: #3d3d4d;
//         }

//         & + button {
//           margin-left: 6px;
//         }
//       }
//     }

//     div.availability-container {
//       display: flex;
//       align-items: center;

//       p {
//         color: #3d3d4d;
//       }

//       .switch {
//         position: relative;
//         display: inline-block;
//         width: 88px;
//         height: 32px;
//         margin-left: 12px;

//         & input {
//           opacity: 0;
//           width: 0;
//           height: 0;
//         }

//         .slider {
//           position: absolute;
//           cursor: pointer;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: #c72828;
//           -webkit-transition: 0.4s;
//           transition: 0.4s;
//           border-radius: 16px;

//           &:before {
//             position: absolute;
//             content: '';
//             height: 20px;
//             width: 40px;
//             left: 8px;
//             bottom: 6px;
//             background-color: white;
//             -webkit-transition: 0.4s;
//             transition: 0.4s;
//             border-radius: 10px;
//           }
//         }

//         input:checked + .slider {
//           background-color: #39b100;
//         }

//         input:focus + .slider {
//           box-shadow: 0 0 1px #2196f3;
//         }

//         input:checked + .slider:before {
//           -webkit-transform: translateX(32px);
//           -ms-transform: translateX(32px);
//           transform: translateX(32px);
//         }
//       }
//     }
//   }
// `;
