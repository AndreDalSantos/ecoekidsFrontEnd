/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import socketio from 'socket.io-client';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { ChatContainer, HeaderChat } from './styles';

interface OrderParams {
  order_id: string;
}

interface IMessage {
  id: string;
  product_id: string;
  product_title: string;
  order_id: string;
  source_user_id: string;
  source_user_name: string;
  target_user_id: string;
  target_user_name: string;
  readed: boolean;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  title: string;
  user_id: string;
}

interface IUser {
  id: string;
  user_name: string;
}

const ChatMessagesPage: React.FC = () => {
  const params = useParams<OrderParams>();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [product, setProduct] = useState<Product>();
  const [seller, setSeller] = useState<IUser>();
  const [buyer, setBuyer] = useState<IUser>();

  const { user } = useAuth();

  // const {
  //   removeChatFromChatsWithUnreadedMessagesThatIamBuyer,
  // } = useChatsStatus();

  // const handleSetMessages = useCallback(async (chat_id: string) => {
  //   const results = await api.get(`chats/index_chat_messages/${chat_id}`);
  //   setMessages(results.data);
  // }, []);

  useEffect(() => {
    async function loadMessages(): Promise<void> {
      const response = await api.get(`/messages/${params.order_id}`);

      if (response.data) {
        setMessages(response.data.messages);

        const { sellerId } = response.data;
        const sellerUserName = response.data.seller_user_name;
        setSeller({ id: sellerId, user_name: sellerUserName });

        const buyerId = response.data.customerId;
        const buyerUserName = response.data.customer_user_name;
        setBuyer({ id: buyerId, user_name: buyerUserName });

        const { productId } = response.data;
        const { productTitle } = response.data;
        const { productUserId } = response.data;

        setProduct({
          id: productId,
          title: productTitle,
          user_id: productUserId,
        });
      }

      // if (response.data) {
      //   setChat(response.data);
      //   removeChatFromChatsWithUnreadedMessagesThatIamBuyer(response.data.id);
      //   handleSetMessages(response.data.id);
      // } else {
      //   const productResult = await api.get(
      //     `products/show/${params.product_id}`,
      //   );

      //   setProduct(productResult.data.productShow);

      //   const sellerResult = await api.get(
      //     `profile/${productResult.data.productShow.user_id}`,
      //   );

      //   setSeller(sellerResult.data.user);
      // }
    }

    loadMessages();
  }, [params.order_id]);

  /** ************************************* */
  const socket = useMemo(
    () =>
      socketio(process.env.REACT_APP_API_URL || 'http://localhost:3333', {
        query: {
          user_order_id: `${user.id}&${params.order_id}`,
        },
      }),
    [user.id, params.order_id],
  );

  useEffect(() => {
    socket.on('message', (msg: IMessage) => {
      // if (user.id !== msg.user_id) {
      //   removeChatFromChatsWithUnreadedMessagesThatIamBuyer(msg.chat_id);
      // }
      if (msg.order_id === params.order_id) setMessages([...messages, msg]);
    });
  }, [socket, messages, user.id, params]);
  /** ************************************** */

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (message.trim()) {
      await api.post(`messages`, {
        order_id: params.order_id,
        content: message,
      });

      socket.emit('message', {
        user_order_id: `${user.id}&${params.order_id}`,
        message: {
          order_id: params.order_id,
          content: message,
        },
      });
    }

    // if (message.trim() && !chat) {
    //   const response = await api.post(`chats`, {
    //     product_id: params.product_id,
    //     seller_id: product?.user_id,
    //     seller_user_name: seller?.user_name,
    //     buyer_id: user.id,
    //     buyer_user_name: user.user_name,
    //     product_title: product?.title,
    //     content: message,
    //   });

    //   setChat(response.data.chat);

    //   window.location.reload();
    // }

    setMessage('');
  }

  const handleInputChange = useCallback(event => {
    setMessage(event.target.value);
  }, []);

  return (
    <ChatContainer>
      <Header />

      <HeaderChat>
        <div>
          <span>
            Produto:{' '}
            <Link to={`/products/${product?.id}`}>{product?.title}</Link>
          </span>

          {user.id === buyer?.id && (
            <span>
              <Link to={`/private_user_purchse_order/${params.order_id}`}>
                Link para pedido
              </Link>
            </span>
          )}

          {user.id === seller?.id && (
            <span>
              <Link to={`/private_user_sale_order/${params.order_id}`}>
                Link para pedido
              </Link>
            </span>
          )}

          {user.id === buyer?.id && <span>Vendedor: {seller?.user_name}</span>}

          {user.id === seller?.id && <span>Comprador: {buyer?.user_name}</span>}
        </div>
      </HeaderChat>

      <div className="external-container">
        <main className="container">
          <ul className="list">
            {messages.map(m => (
              <li
                key={m.id}
                className={`list__item list__item--${
                  m.source_user_id === user.id ? 'mine' : 'other'
                } ${!m.readed && m.source_user_id !== user.id && 'not-readed'}`}
              >
                <span
                  className={`message message--${
                    m.source_user_id === user.id ? 'mine' : 'other'
                  }`}
                >
                  {m.content}
                </span>
              </li>
            ))}
          </ul>
        </main>

        <form className="form" onSubmit={handleFormSubmit}>
          <input
            className="form__field"
            onChange={handleInputChange}
            placeholder={`Digite uma mensagem para ${
              user.id === seller?.id
                ? buyer?.user_name
                : user.id === buyer?.id
                ? seller?.user_name
                : 'Usuário'
            }`}
            type="text"
            value={message}
          />
        </form>
      </div>
    </ChatContainer>
  );
};

export default ChatMessagesPage;
