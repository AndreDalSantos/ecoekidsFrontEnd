/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import NotAuthenticatedRoute from './NotAuthenticatedRoute';

import HomeAuthenticated from '../pages/HomeAuthenticated';
import AuthenticatedShowProduct from '../pages/AuthenticatedShowProduct';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import EditAddress from '../pages/EditAddress';
import Cart from '../pages/Cart';
import UserPurchaseOrdersIndex from '../pages/UserPurchaseOrdersIndex';
import UserPurchaseOrderShow from '../pages/UserPurchaseOrderShow';
import UserSalesOrdersIndex from '../pages/UserSalesOrdersIndex';
import UserSaleOrderShow from '../pages/UserSaleOrderShow';
import UserEditSaleOrderStatus from '../pages/UserEditSaleOrderStatus';
import EvaluateOrder from '../pages/EvaluateOrder';
import CreateProduct from '../pages/CreateProduct';
import EditProduct from '../pages/EditProduct';
import ListMyProductsAds from '../pages/ListMyProductsAds';
import ChangeAvatar from '../pages/ChangeAvatar';
import ChatPage from '../pages/ChatPage';
import ChatPageSeller from '../pages/ChatPageSeller';
import IndexChatsOfProduct from '../pages/IndexChatsOfProduct';
import IndexChatsOfUser from '../pages/IndexChatsOfUser';
import ListAllChats from '../pages/ListAllChats';
import ListMyProductsToListChats from '../pages/ListMyProductsToListChats';
import ChatMessagesPage from '../pages/ChatMessagesPage';

const AuthenticatedRoutes: React.FC = () => (
  <Switch>
    <PrivateRoute
      path="/authenticated-home"
      component={HomeAuthenticated}
      isPrivate
    />

    <PrivateRoute
      path="/authenticated-show-product/:product_id"
      component={AuthenticatedShowProduct}
      isPrivate
    />

    <PrivateRoute path="/profile" component={Profile} isPrivate />

    <PrivateRoute path="/edit-profile" component={EditProfile} isPrivate />

    <PrivateRoute path="/edit-address" component={EditAddress} isPrivate />

    <PrivateRoute path="/cart/:product_id" component={Cart} isPrivate />

    {/* verificar as informações em cada card, ex. colocar titulo do produto */}
    {/* ver se coloca sistema de busca e páginação, ordernar por data atualização */}
    <PrivateRoute
      path="/private_user_purchase_orders_index"
      component={UserPurchaseOrdersIndex}
      isPrivate
    />

    <PrivateRoute
      path="/private_user_purchse_order/:order_id"
      component={UserPurchaseOrderShow}
      isPrivate
    />

    {/* verificar as informações em cada card, ex. colocar titulo do produto */}
    {/* ver se coloca sistema de busca e páginação, ordernar por data atualização */}
    <PrivateRoute
      path="/private_user_sales_orders_index"
      component={UserSalesOrdersIndex}
      isPrivate
    />

    <PrivateRoute
      path="/private_user_sale_order/:order_id"
      component={UserSaleOrderShow}
      isPrivate
    />

    <PrivateRoute
      path="/user_edit_sale_order/:order_id"
      component={UserEditSaleOrderStatus}
      isPrivate
    />

    <PrivateRoute
      path="/evaluate_order/:order_id"
      component={EvaluateOrder}
      isPrivate
    />

    <PrivateRoute path="/create-product" component={CreateProduct} isPrivate />

    <PrivateRoute
      path="/edit_product_ad/:product_id"
      component={EditProduct}
      isPrivate
    />

    <PrivateRoute
      path="/list-my-products-ads"
      component={ListMyProductsAds}
      isPrivate
    />
    <PrivateRoute path="/edit-avatar" component={ChangeAvatar} isPrivate />
    <PrivateRoute
      path="/chat-page/:product_id"
      component={ChatPage}
      isPrivate
    />
    <PrivateRoute
      path="/chat-page-seller/:chat_id"
      component={ChatPageSeller}
      isPrivate
    />
    <PrivateRoute
      path="/list-my-products-to-list-chats"
      component={ListMyProductsToListChats}
      isPrivate
    />
    <PrivateRoute
      path="/list-chats-of-product/:product_id"
      component={IndexChatsOfProduct}
      isPrivate
    />
    <PrivateRoute path="/list-chats" component={ListAllChats} isPrivate />
    <PrivateRoute
      path="/list-my-buyer-chats"
      component={IndexChatsOfUser}
      isPrivate
    />
    {/* novas páginas de chats relacionadas ao um pedido */}
    {/* listar chats em meus pedidos de compra */}
    {/* listar chats em meus pedidos de venda */}
    {/* <PrivateRoute
      path="/chat-messages-page/:order_id"
      component={ChatMessagesPage}
      isPrivate
    /> */}
  </Switch>
);

export default AuthenticatedRoutes;
