/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import NotAuthenticatedRoute from './NotAuthenticatedRoute';

import Home from '../pages/Home';
import ShowProduct from '../pages/ShowProduct';
import SignIn from '../pages/Signin';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ConfirmEmail from '../pages/ConfirmEmail';

import AuthenticatedRoutes from './AuthenticatedRoutes';

import { ChatsStatusProvider } from '../hooks/chatsStatus';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Home} />

    <Route path="/products/:product_id" component={ShowProduct} />

    <NotAuthenticatedRoute path="/signin" component={SignIn} />

    <NotAuthenticatedRoute path="/forgot-password" component={ForgotPassword} />

    <NotAuthenticatedRoute path="/reset_password" component={ResetPassword} />
    {/* falta enviar email de para verificação de email (front-end/back-end) */}
    {/* falta analisar se é necessário cpf (front-end/back-end) */}
    <NotAuthenticatedRoute path="/signup" component={SignUp} />

    <NotAuthenticatedRoute path="/confirm_email" component={ConfirmEmail} />

    <ChatsStatusProvider>
      <AuthenticatedRoutes />
    </ChatsStatusProvider>
  </Switch>
);

export default Routes;
