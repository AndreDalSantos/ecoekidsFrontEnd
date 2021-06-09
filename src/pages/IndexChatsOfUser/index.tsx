import React, { useCallback, useEffect, useState } from 'react';

import { Link, useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import Header from '../../components/Header';

import { OrdersContainer, OrderCard } from './styles';
import { useChatsStatus } from '../../hooks/chatsStatus';

interface IChat {
  id: string;
  seller_id: string;
  seller_user_name: string;
  buyer_id: string;
  buyer_user_name: string;
  product_id: string;
  product_title: string;
  created_at: string;
  updated_at: string;
}

interface ProductParams {
  product_id: string;
}

interface Product {
  id: string;
  title: string;
}

const IndexChatsOfUser: React.FC = () => {
  const params = useParams<ProductParams>();

  const [chats, setChats] = useState<IChat[]>();

  const { thereIsChatsIamBuyerWithUnreadedMessages } = useChatsStatus();

  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api.get(`/chats/index_buyer_chats/${user.id}`).then(response => {
        setChats(response.data.chats);
      });
    }
  }, [user, history, params.product_id]);

  const handleCheckMessagesStatus = useCallback(
    (chatId: string) => {
      if (thereIsChatsIamBuyerWithUnreadedMessages) {
        for (
          let i = 0;
          i < thereIsChatsIamBuyerWithUnreadedMessages.length;
          i++
        ) {
          if (thereIsChatsIamBuyerWithUnreadedMessages[i] === chatId) {
            return true;
          }
        }
      }
      return false;
    },
    [thereIsChatsIamBuyerWithUnreadedMessages],
  );

  return (
    <div>
      <Header />
      <OrdersContainer>
        <div className="title">
          <span>Listagem das minhas conversas com vendedores</span>
        </div>
        {chats?.map(item => {
          return (
            <OrderCard key={item.id}>
              <Link to={`/chat-page/${item.product_id}`}>
                <div>
                  <div>
                    <p>
                      <strong>Anúncio:</strong> {item.product_title}
                    </p>
                    {handleCheckMessagesStatus(item.id) && (
                      <div className="new-messages">novas mensagens</div>
                    )}
                  </div>
                  <p>
                    <strong>Vendedor:</strong>{' '}
                    {item.seller_user_name
                      ? item.seller_user_name
                      : 'Usuário removido'}
                  </p>
                </div>
              </Link>
            </OrderCard>

            // <OrderCard key={item.id}>
            //   <Link to={`/chat-page/${item.product_id}`}>
            //     <div>
            //       <p>
            //         <strong>Anúncio:</strong> {item.product_title}
            //       </p>
            //       <p>
            //         <strong>Vendedor:</strong>{' '}
            //         {item.seller_user_name
            //           ? item.seller_user_name
            //           : 'Usuário removido'}
            //       </p>
            //     </div>
            //   </Link>
            // </OrderCard>
          );
        })}
      </OrdersContainer>
    </div>
  );
};

export default IndexChatsOfUser;
