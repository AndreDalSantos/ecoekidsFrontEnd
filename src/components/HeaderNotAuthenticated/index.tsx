/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Container } from './styles';
import { useAuth } from '../../hooks/auth';
import { useSearch } from '../../hooks/search';
// import { useChatsStatus } from '../../hooks/chatsStatus';

const Header: React.FC = ({ ...rest }) => {
  const [auxFilterProducts, setAuxFilterProducts] = useState('');
  // const [unreadedMessagesFlag, setUnreadedMessagesFlag] = useState(false);

  const history = useHistory();

  const { user } = useAuth();
  const { setSearchParams, clearSearchParams } = useSearch();
  // const {
  //   thereIsChatsIamBuyerWithUnreadedMessages,
  //   thereIsChatsIamSellerWithUnreadedMessages,
  // } = useChatsStatus();

  const checkUnreadedMessages = useCallback(() => {
    // console.log(
    //   `chats em que sou comprador e tem mensagens não lidas: ${thereIsChatsIamBuyerWithUnreadedMessages}`,
    // );
    // console.log(
    //   `chats em que sou vendedro e tem mensagens não lidas: ${thereIsChatsIamSellerWithUnreadedMessages}`,
    // );
    // const check =
    //   thereIsChatsIamBuyerWithUnreadedMessages.length > 0 ||
    //   thereIsChatsIamSellerWithUnreadedMessages.length > 0;
    // setUnreadedMessagesFlag(check);
  }, []);

  useEffect(() => {
    checkUnreadedMessages();
  }, [checkUnreadedMessages]);

  // useEffect(() => {
  //   async function loadChatsWhereIamSellerWithUnreadedMessages(): Promise<void> {
  //     try {
  //       const response = await api.get(
  //         `/chats/chats_where_i_am_seller/${user.id}`,
  //       );

  //       if (response.data.chatsThatIamSellerWithUnreadedMessages.length > 0) {
  //         setThereIsChatsIamSellerWithUnreadedMessages([
  //           ...thereIsChatsIamSellerWithUnreadedMessages,
  //           response.data.chatsThatIamSellerWithUnreadedMessages,
  //         ]);
  //       }
  //     } catch (error) {
  //       const errorMessage = error.response.data.message;

  //       addToast({
  //         type: 'error',
  //         title: 'Um erro ocorreu',
  //         description: errorMessage,
  //       });
  //     }
  //   }

  //   async function loadChatsWhereIamBuyerWithUnreadedMessages(): Promise<void> {
  //     try {
  //       const response = await api.get(
  //         `/chats/chats_where_i_am_buyer/${user.id}`,
  //       );

  //       if (response.data.chatsThatIamBuyerWithUnreadedMessages.length > 0) {
  //         setThereIsChatsIamBuyerWithUnreadedMessages([
  //           ...thereIsChatsIamBuyerWithUnreadedMessages,
  //           response.data.chatsThatIamBuyerWithUnreadedMessages,
  //         ]);
  //       }
  //     } catch (error) {
  //       const errorMessage = error.response.data.message;

  //       addToast({
  //         type: 'error',
  //         title: 'Um erro ocorreu',
  //         description: errorMessage,
  //       });
  //     }
  //   }

  //   loadChatsWhereIamBuyerWithUnreadedMessages();
  //   loadChatsWhereIamSellerWithUnreadedMessages();
  // }, [
  //   addToast,
  //   thereIsChatsIamSellerWithUnreadedMessages,
  //   thereIsChatsIamBuyerWithUnreadedMessages,
  //   user.id,
  // ]);

  const handleSearchProducts = useCallback(async () => {
    setSearchParams({
      filterProducts: auxFilterProducts,
      category_id: '',
      sub_category_id: '',
    });

    if (user) {
      history.push('/authenticated-home');
    } else {
      history.push('/');
    }
  }, [auxFilterProducts, setSearchParams, history, user]);

  const inputFieldCapture = useCallback(e => {
    setAuxFilterProducts(e.target.value);
  }, []);

  // function handleLogOut(): void {
  //   signOut();
  //   history.push('/signin');
  // }

  const handleClearSearchParamsFromStorage = useCallback(() => {
    clearSearchParams();
  }, [clearSearchParams]);

  return (
    <Container {...rest}>
      <div className="header-external">
        <div className="header-internal">
          <Link
            to={user ? '/authenticated-home' : '/'}
            onClick={handleClearSearchParamsFromStorage}
          >
            <h1>MARKET PLACE</h1>
            <h2>Compra e venda</h2>
          </Link>

          <form onSubmit={handleSearchProducts}>
            <div>
              <input
                type="text"
                name="filterProducts"
                onKeyUpCapture={inputFieldCapture}
                placeholder="Buscar por produto"
              />
              <button type="submit">Buscar</button>
            </div>
          </form>

          <nav className="primary">
            <ul>
              <li>
                <Link to="/signup">Cadastre-se</Link>
              </li>
              <li>
                <Link to="/signin">Entrar</Link>
              </li>
            </ul>
            {/* <ul>
              <li>
                {user && <Link to="/create-product">Novo anúncio</Link>}
                {!user && <Link to="/signup">Cadastre-se</Link>}
              </li>
              {!user && (
                <li>
                  <Link to="/signin">Entrar</Link>
                </li>
              )}
              {user && (
                <li className="dropdown-container">
                  {!unreadedMessagesFlag && (
                    <Link to="/profile">Minha conta</Link>
                  )}
                  {unreadedMessagesFlag && (
                    <div>
                      <Link to="/profile">Minha conta</Link>
                      <div className="new-messages">novas mensagens</div>
                    </div>
                  )}
                  <ul className="dropdown">
                    <li>
                      <Link to="/profile">Minha conta</Link>
                    </li>
                    <li>
                      <Link to="/private_user_purchase_orders_index">
                        Meus pedidos
                      </Link>
                    </li>
                    <li>
                      <Link to="/private_user_sales_orders_index">
                        Minhas vendas
                      </Link>
                    </li>
                    <li>
                      <Link to="/list-my-products-ads">Meus anúncios</Link>
                    </li>
                    <li>
                      {!unreadedMessagesFlag && (
                        <Link to="/list-chats">Chats</Link>
                      )}
                      {unreadedMessagesFlag && (
                        <div>
                          <Link to="/list-chats">
                            <div className="new-messages">novas mensagens</div>
                          </Link>
                        </div>
                      )}
                    </li>
                    <li>
                      <button type="button" onClick={handleLogOut}>
                        Sair
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul> */}
          </nav>
        </div>
      </div>
    </Container>
  );
};

export default Header;
