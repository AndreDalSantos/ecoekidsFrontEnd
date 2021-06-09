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

const IndexChatsOfProduct: React.FC = () => {
  const params = useParams<ProductParams>();

  const [chats, setChats] = useState<IChat[]>();
  const [product, setProduct] = useState<Product>();

  const { user } = useAuth();
  const history = useHistory();
  const { thereIsChatsIamSellerWithUnreadedMessages } = useChatsStatus();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api
        .get(`/chats/index_chats_of_product_by_seller/${params.product_id}`)
        .then(response => {
          setChats(response.data);
        });

      api.get(`products/show/${params.product_id}`).then(response => {
        setProduct(response.data.productShow);
      });
    }
  }, [user, history, params.product_id]);

  const handleCheckMessagesStatus = useCallback(
    (chatId: string) => {
      if (thereIsChatsIamSellerWithUnreadedMessages) {
        for (
          let i = 0;
          i < thereIsChatsIamSellerWithUnreadedMessages.length;
          i++
        ) {
          if (thereIsChatsIamSellerWithUnreadedMessages[i] === chatId) {
            return true;
          }
        }
      }
      return false;
    },
    [thereIsChatsIamSellerWithUnreadedMessages],
  );

  return (
    <div>
      <Header />
      <OrdersContainer>
        <div className="title">
          <span>
            Listagem das conversas relativas ao anúncio{' '}
            <Link to={`/authenticated-show-product/${product?.id}`}>
              <strong>{product?.title}</strong>
            </Link>
          </span>
        </div>
        {chats?.map(item => {
          return (
            <OrderCard key={item.id}>
              <Link to={`/chat-page-seller/${item.id}`}>
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
                    <strong>Usuário:</strong>{' '}
                    {item.buyer_user_name
                      ? item.buyer_user_name
                      : 'Usuário removido'}
                  </p>
                </div>
              </Link>
              {/* </button> */}
            </OrderCard>
          );
        })}
      </OrdersContainer>
    </div>
  );
};

export default IndexChatsOfProduct;
