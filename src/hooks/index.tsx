/* eslint-disable no-use-before-define */
import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { SearchProvider } from './search';
// import { ChatsStatusProvider } from './chatsStatus';
// import { TestMessagesSocketIOProvider } from './testeMessagesSocketIO';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <SearchProvider>{children}</SearchProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
