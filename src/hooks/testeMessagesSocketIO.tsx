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

import { useAuth } from './auth';

interface TestMessagesSocketIOContextData {
  ordersWithUnreadedMessages: string[];
  removeOrderIdFromOrdersWithUnreadedMessages(rderId: string): void;
}

const TestMessagesSocketIOContext = createContext<TestMessagesSocketIOContextData>(
  {} as TestMessagesSocketIOContextData,
);

const TestMessagesSocketIOProvider: React.FC = ({ children }) => {
  const [ordersWithUnreadedMessages, setOrdersWithUnreadedMessages] = useState<
    string[]
  >([]);

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
    socket.on('notification', (orderId: string) => {
      const orderAlreadyIncluded = ordersWithUnreadedMessages.find(
        item => item === orderId,
      );
      if (!orderAlreadyIncluded) {
        setOrdersWithUnreadedMessages([...ordersWithUnreadedMessages, orderId]);
      }
    });
  }, [socket, ordersWithUnreadedMessages]);

  const removeOrderIdFromOrdersWithUnreadedMessages = useCallback(
    (orderId: string) => {
      const getOrderId = ordersWithUnreadedMessages.find(
        item => item === orderId,
      );
      if (getOrderId) {
        const aux = ordersWithUnreadedMessages;
        aux.splice(aux.indexOf(getOrderId), 1);
        setOrdersWithUnreadedMessages(aux);
      }
    },
    [ordersWithUnreadedMessages],
  );

  return (
    <TestMessagesSocketIOContext.Provider
      value={{
        ordersWithUnreadedMessages,
        removeOrderIdFromOrdersWithUnreadedMessages,
      }}
    >
      {children}
    </TestMessagesSocketIOContext.Provider>
  );
};

function useMessagesSocket(): TestMessagesSocketIOContextData {
  const context = useContext(TestMessagesSocketIOContext);

  return context;
}

export { TestMessagesSocketIOProvider, useMessagesSocket };
