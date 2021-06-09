import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import Header from '../../components/Header';

import { OrdersContainer, OrderCard } from './styles';

import { useChatsStatus } from '../../hooks/chatsStatus';

const ListAllChats: React.FC = () => {
  const {
    thereIsChatsIamBuyerWithUnreadedMessages,
    thereIsChatsIamSellerWithUnreadedMessages,
  } = useChatsStatus();

  const [unreadedBuyerMessagesFlag, setUnreadedBuyerMessagesFlag] = useState(
    false,
  );
  const [unreadedSellerMessagesFlag, setUnreadedSellerMessagesFlag] = useState(
    false,
  );

  useEffect(() => {
    const checkBuyerMessages =
      thereIsChatsIamBuyerWithUnreadedMessages.length > 0;

    const checkSellerMessages =
      thereIsChatsIamSellerWithUnreadedMessages.length > 0;

    setUnreadedBuyerMessagesFlag(checkBuyerMessages);
    setUnreadedSellerMessagesFlag(checkSellerMessages);
  }, [
    thereIsChatsIamBuyerWithUnreadedMessages,
    thereIsChatsIamSellerWithUnreadedMessages,
  ]);

  return (
    <div>
      <Header />
      <OrdersContainer>
        <OrderCard>
          <Link to="/list-my-buyer-chats">
            <div>
              <p>Listar meus chats com vendedores</p>
              {unreadedBuyerMessagesFlag && (
                <div className="new-messages">novas mensagens</div>
              )}
            </div>
          </Link>
        </OrderCard>

        <OrderCard>
          <Link to="/list-my-products-to-list-chats">
            <div>
              <p>Listar chats em aberto nos meus anúncios</p>
              {unreadedSellerMessagesFlag && (
                <div className="new-messages">novas mensagens</div>
              )}
            </div>
          </Link>
        </OrderCard>
      </OrdersContainer>
    </div>
  );
};

export default ListAllChats;
