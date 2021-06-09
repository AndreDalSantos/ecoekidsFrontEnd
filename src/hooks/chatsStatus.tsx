/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import socketio from 'socket.io-client';

import api from '../services/api';
import { useToast } from './toast';

import { useAuth } from './auth';

interface INotification {
  chatId: string;
  userTypeInChat: string;
}

interface ChatsStatusContextData {
  thereIsChatsIamSellerWithUnreadedMessages: string[];
  thereIsChatsIamBuyerWithUnreadedMessages: string[];
  setChatsWhereIamSellerWithUnreadedMessages(newMessage: string): void;
  setChatsWhereIamBuyerWithUnreadedMessages(newMessage: string): void;
  removeChatFromChatsWithUnreadedMessagesThatIamBuyer(chatId: string): void;
  removeChatFromChatsWithUnreadedMessagesThatIamSeller(chatId: string): void;
  addChatToChatsOfBuyerUnreaded(chatId: string): void;
}

const ChatsStatusContext = createContext<ChatsStatusContextData>(
  {} as ChatsStatusContextData,
);

const ChatsStatusProvider: React.FC = ({ children }) => {
  const [
    thereIsChatsIamSellerWithUnreadedMessages,
    setThereIsChatsIamSellerWithUnreadedMessages,
  ] = useState<string[]>([]);
  const [
    thereIsChatsIamBuyerWithUnreadedMessages,
    setThereIsChatsIamBuyerWithUnreadedMessages,
  ] = useState<string[]>([]);

  const { addToast } = useToast();
  const { user } = useAuth();

  const socket = useMemo(
    () =>
      socketio(process.env.REACT_APP_API_URL || 'http://localhost:3333', {
        query: {
          user_id: `${user.id}`,
        },
      }),
    [user.id],
  );

  useEffect(() => {
    socket.on('notification', (data: INotification) => {
      if (data.userTypeInChat === 'seller') {
        setThereIsChatsIamSellerWithUnreadedMessages([
          ...thereIsChatsIamSellerWithUnreadedMessages,
          data.chatId,
        ]);
      } else {
        setThereIsChatsIamBuyerWithUnreadedMessages([
          ...thereIsChatsIamBuyerWithUnreadedMessages,
          data.chatId,
        ]);
      }
    });
  }, [
    socket,
    thereIsChatsIamSellerWithUnreadedMessages,
    thereIsChatsIamBuyerWithUnreadedMessages,
  ]);

  useEffect(() => {
    async function loadChatsWhereIamSellerWithUnreadedMessages(
      user_id: string,
    ): Promise<void> {
      try {
        const response = await api.get(
          `/chats/chats_where_i_am_seller/${user_id}`,
        );

        if (response.data.chatsThatIamSellerWithUnreadedMessages.length > 0) {
          setThereIsChatsIamSellerWithUnreadedMessages(
            response.data.chatsThatIamSellerWithUnreadedMessages,
          );
        }
      } catch (error) {
        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Um erro ocorreu',
          description: errorMessage,
        });
      }
    }

    async function loadChatsWhereIamBuyerWithUnreadedMessages(
      user_id: string,
    ): Promise<void> {
      try {
        const response = await api.get(
          `/chats/chats_where_i_am_buyer/${user_id}`,
        );

        if (response.data.chatsThatIamBuyerWithUnreadedMessages.length > 0) {
          setThereIsChatsIamBuyerWithUnreadedMessages(
            response.data.chatsThatIamBuyerWithUnreadedMessages,
          );
        }
      } catch (error) {
        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Um erro ocorreu',
          description: errorMessage,
        });
      }
    }

    if (user) {
      loadChatsWhereIamBuyerWithUnreadedMessages(user.id);
      loadChatsWhereIamSellerWithUnreadedMessages(user.id);
    }
  }, [addToast, user]);

  const setChatsWhereIamBuyerWithUnreadedMessages = useCallback(
    (newMessage: string) => {
      setThereIsChatsIamBuyerWithUnreadedMessages([
        ...thereIsChatsIamBuyerWithUnreadedMessages,
        newMessage,
      ]);
    },
    [thereIsChatsIamBuyerWithUnreadedMessages],
  );

  const setChatsWhereIamSellerWithUnreadedMessages = useCallback(
    (newMessage: string) => {
      setThereIsChatsIamSellerWithUnreadedMessages([
        ...thereIsChatsIamSellerWithUnreadedMessages,
        newMessage,
      ]);
    },
    [thereIsChatsIamSellerWithUnreadedMessages],
  );

  const removeChatFromChatsWithUnreadedMessagesThatIamBuyer = useCallback(
    (chatId: string) => {
      const copyOfThereIsChatsIamBuyerWithUnreadedMessages = [
        ...thereIsChatsIamBuyerWithUnreadedMessages,
      ];

      const index = copyOfThereIsChatsIamBuyerWithUnreadedMessages.indexOf(
        chatId,
      );

      if (index >= 0) {
        copyOfThereIsChatsIamBuyerWithUnreadedMessages.splice(index, 1);
      }

      setThereIsChatsIamBuyerWithUnreadedMessages(
        copyOfThereIsChatsIamBuyerWithUnreadedMessages,
      );

      // console.log(`removendo: ${chatId}`);
    },
    [thereIsChatsIamBuyerWithUnreadedMessages],
  );

  const removeChatFromChatsWithUnreadedMessagesThatIamSeller = useCallback(
    (chatId: string) => {
      const copyOfThereIsChatsIamSellerWithUnreadedMessages = [
        ...thereIsChatsIamSellerWithUnreadedMessages,
      ];

      const index = copyOfThereIsChatsIamSellerWithUnreadedMessages.indexOf(
        chatId,
      );

      if (index >= 0) {
        copyOfThereIsChatsIamSellerWithUnreadedMessages.splice(index, 1);
      }

      setThereIsChatsIamSellerWithUnreadedMessages(
        copyOfThereIsChatsIamSellerWithUnreadedMessages,
      );
    },
    [thereIsChatsIamSellerWithUnreadedMessages],
  );

  const addChatToChatsOfBuyerUnreaded = useCallback(
    (chatId: string) => {
      const results = thereIsChatsIamBuyerWithUnreadedMessages.filter(item => {
        if (item === chatId) return item;
      });

      if (results.length === 0) {
        setThereIsChatsIamBuyerWithUnreadedMessages([
          ...thereIsChatsIamBuyerWithUnreadedMessages,
          chatId,
        ]);
      }
    },
    [thereIsChatsIamBuyerWithUnreadedMessages],
  );

  return (
    <ChatsStatusContext.Provider
      value={{
        thereIsChatsIamSellerWithUnreadedMessages,
        thereIsChatsIamBuyerWithUnreadedMessages,
        setChatsWhereIamBuyerWithUnreadedMessages,
        setChatsWhereIamSellerWithUnreadedMessages,
        removeChatFromChatsWithUnreadedMessagesThatIamBuyer,
        removeChatFromChatsWithUnreadedMessagesThatIamSeller,
        addChatToChatsOfBuyerUnreaded,
      }}
    >
      {children}
    </ChatsStatusContext.Provider>
  );
};

function useChatsStatus(): ChatsStatusContextData {
  const context = useContext(ChatsStatusContext);

  return context;
}

export { ChatsStatusProvider, useChatsStatus };
