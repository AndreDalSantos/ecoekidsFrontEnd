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
import { useChatsStatus } from '../../hooks/chatsStatus';
import api from '../../services/api';

import { ChatContainer, HeaderChat } from './styles';

// interface ProductParams {
//   product_id: string;
// }

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

interface IMessage {
  id: string;
  user_id: string;
  chat_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// interface Product {
//   id: string;
//   title: string;
//   user_id: string;
// }

// interface ISeller {
//   id: string;
//   user_name: string;
// }

interface ChatParams {
  chat_id: string;
}

const ChatPageSeller: React.FC = () => {
  const params = useParams<ChatParams>();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chat, setChat] = useState<IChat>();
  // const [product, setProduct] = useState<Product>();
  // const [seller, setSeller] = useState<ISeller>();

  const { user } = useAuth();

  const {
    removeChatFromChatsWithUnreadedMessagesThatIamSeller,
  } = useChatsStatus();

  const handleSetMessages = useCallback(async (chat_id: string) => {
    const results = await api.get(`chats/index_chat_messages/${chat_id}`);
    setMessages(results.data);
  }, []);

  useEffect(
    () => {
      async function loadChat(): Promise<void> {
        const response = await api.get(`/chats/${params.chat_id}`);

        if (response.data) {
          setChat(response.data);
          removeChatFromChatsWithUnreadedMessagesThatIamSeller(
            response.data.id,
          );
          handleSetMessages(response.data.id);
        }
      }

      loadChat();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // params.chat_id,
      // handleSetMessages,
      // removeChatFromChatsWithUnreadedMessagesThatIamSeller,
    ],
  );

  /** ************************************* */
  const socket = useMemo(
    () =>
      socketio(process.env.REACT_APP_API_URL || 'http://localhost:3333', {
        query: {
          user_chat_id: `${user.id}&${chat?.id}`,
        },
      }),
    [user.id, chat],
  );

  useEffect(() => {
    socket.on('message', (msg: IMessage) => {
      if (user.id !== msg.user_id) {
        removeChatFromChatsWithUnreadedMessagesThatIamSeller(msg.chat_id);
      }

      setMessages([...messages, msg]);
    });
  }, [
    socket,
    messages,
    user.id,
    removeChatFromChatsWithUnreadedMessagesThatIamSeller,
  ]);
  /** ************************************** */

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (message.trim() && chat) {
      await api.post(`chats/message`, {
        chat_id: chat?.id,
        user_id: user.id,
        content: message,
      });

      socket.emit('message', {
        user_chat_id: `${user.id}&${chat?.id}`,
        message: {
          chat_id: chat?.id,
          user_id: user.id,
          content: message,
        },
      });
    }

    setMessage('');
  }

  const handleInputChange = useCallback(event => {
    setMessage(event.target.value);
  }, []);

  // window.onload = () => {
  //   async function loadChat(): Promise<void> {
  //     const response = await api.get(`/chats/${params.chat_id}`);

  //     if (response.data) {
  //       setChat(response.data);
  //       handleSetMessages(response.data.id);
  //     }
  //   }

  //   loadChat();
  // };

  return (
    <ChatContainer>
      <Header />
      <HeaderChat>
        <div>
          <span>
            Produto:{' '}
            <Link to={`/authenticated-show-product/${chat?.product_id}`}>
              {chat?.product_title}
            </Link>
          </span>

          <span>Usuário: {chat?.buyer_user_name}</span>
        </div>
      </HeaderChat>

      <div className="external-container">
        <main className="container">
          <ul className="list">
            {messages.map(m => (
              <li
                key={m.id}
                className={`list__item list__item--${
                  m.user_id === user.id ? 'mine' : 'other'
                }`}
              >
                <span
                  className={`message message--${
                    m.user_id === user.id ? 'mine' : 'other'
                  }`}
                >
                  {m.content}
                </span>
              </li>
            ))}
          </ul>

          <form className="form" onSubmit={handleFormSubmit}>
            <input
              className="form__field"
              onChange={handleInputChange}
              placeholder={`Digite uma mensagem para ${chat?.buyer_user_name}`}
              type="text"
              value={message}
            />
          </form>
        </main>
      </div>
    </ChatContainer>
  );
};

export default ChatPageSeller;
