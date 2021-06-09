/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { format, parseISO } from 'date-fns';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import Header from '../../components/Header';

import { OrderContainer } from './styles';
import placeholderImg from '../../assets/image_dashboard.jpeg';

interface IOrderProduct {
  id: string;
  price: string;
  quantity: number;
  product_id: string;
}

interface IOrder {
  id: string;
  status: string;
  total_value: string;
  created_at: string;
  updated_at: string;
  order_products: Array<{
    id: string;
    product_id: string;
    price: string;
    quantity: number;
  }>;
  customer: {
    name: string;
    user_name: string;
    email: string;
    reputation: string;
  };
}

interface OrderParams {
  order_id: string;
}

interface IProduct {
  id: string;
  title: string;
  quantity: number;
  price: string;
  category_id: string;
  description: string;
  status: string;
  user_id: string;
  category: {
    id: string;
    name: string;
  };
  productFiles: Array<{
    id: string;
    name: string;
    path: string;
    product_id: string;
    image_url: string;
  }>;
}

interface ICustomerAddress {
  id: string;
  state: string;
  city: string;
  neighborhood: string;
}

const UserSaleOrderShow: React.FC = () => {
  const params = useParams<OrderParams>();
  const [order, setOrder] = useState<IOrder>();
  const [products, setProducts] = useState<IProduct[]>();
  const [customerAddress, setCustomerAddress] = useState<ICustomerAddress>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customerAvatar, setCustomerAvatar] = useState('');

  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api.get(`/orders/${params.order_id}`).then(response => {
        handleGetProducts(response.data.order_products);
        handleGetCustomerInfo(response.data.customer_id);
        setOrder(response.data);
      });
    }
  }, [params.order_id, history, user]);

  async function handleGetProducts(order_products: IOrderProduct[]) {
    const productsListPromise = order_products.map(item => {
      return api.get(`products/show/${item.product_id}`);
    });
    const productsList = await Promise.all(productsListPromise);
    const productsListShow = productsList.map(item => {
      return item.data.productShow;
    });

    setProducts(productsListShow);
  }

  function handleGetCustomerInfo(customer_id: string): void {
    api.get(`adresses/${customer_id}`).then(response => {
      setCustomerAddress(response.data[0]);
    });
    api.get(`profile/${customer_id}`).then(response => {
      // console.log(response.data.user.avatar_url);
      setCustomerAvatar(response.data.user.avatar_url);
    });
  }

  function handleGoToChangeStatus() {
    history.push(`/user_edit_sale_order/${params.order_id}`);
  }

  async function handleLinkChat(product: IProduct) {
    const response = await api.get(
      `/chats/get_chat_by_seller_from_buyer_id_and_product_id/${product.id}/${order?.customer.email}`,
    );

    if (response.data) {
      history.push(`/chat-page-seller/${response.data.id}`);
    } else {
      await api.post(`chats/create_chat_by_buyer_email`, {
        product_id: product.id,
        seller_id: user.id,
        seller_user_name: user.user_name,
        buyer_email: order?.customer.email,
        buyer_user_name: order?.customer.user_name,
        product_title: product?.title,
        content: 'Olá, agradeço sua compra!',
      });

      const response2 = await api.get(
        `/chats/get_chat_by_seller_from_buyer_id_and_product_id/${product.id}/${order?.customer.email}`,
      );

      history.push(`/chat-page-seller/${response2.data.id}`);
    }
  }

  return (
    <div>
      <Header />
      <OrderContainer>
        <div className="order-block">
          <div className="block-content ">
            {order?.status === 'concluded' || order?.status === 'canceled' ? (
              <h3>Status desta ordem: {order?.status}</h3>
            ) : (
              <div className="status-order-content">
                <h3>Status desta ordem: Iniciada</h3>
                <h4>
                  *Obs: se já finalizou a negociação com o comprador ou precisa
                  cancelar este pedido, clique no link abaixo:
                </h4>
                <button type="button" onClick={handleGoToChangeStatus}>
                  Alterar status deste pedido
                </button>
                {/* <h2>
                  <Link to={`/user_edit_sale_order/${params.order_id}`}>
                    Alterar status deste pedido
                  </Link>
                </h2>
                <br /> */}
                <p>
                  ** Lembrando que ao mudar o status para concluído poderá
                  solicitar uma avaliação positiva ao comprador e aumentar sua
                  reputação o que poderá beneficiar suas futuras negociações!
                </p>
                <p>
                  *** Caso a negociação não tenha sido concluída por qualquer
                  motivo, você poderá cancelar este pedido fazendo com que seu
                  produto, nas quantidades deste pedido, seja novamente
                  anúnciado.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="order-block">
          <div className="block-content">
            <h2>Dados do pedido</h2>
            <p>
              <strong>Valor da venda: </strong>{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(Number(order?.total_value))}
            </p>
            <p>
              <strong>ID do pedido:</strong> {order?.id}
            </p>
            <p>
              <strong>Status do pedido:</strong> {order?.status}
            </p>
            <p>
              <strong>Data de criação do pedido: </strong>
              {order
                ? format(
                    parseISO(order?.created_at),
                    "dd/MM/yyyy 'às' HH:mm'h'",
                  )
                : ''}
            </p>
            {order?.created_at !== order?.updated_at ? (
              <p>
                <strong>Data da última atualização do pedido: </strong>
                {order
                  ? format(
                      parseISO(order?.updated_at),
                      "dd/MM/yyyy 'às' HH:mm'h'",
                    )
                  : ''}
              </p>
            ) : (
              <p />
            )}
          </div>
        </div>

        <div className="order-block">
          <div className="block-content">
            <h2>Informações do produto</h2>
            {order?.order_products.map(item => {
              return (
                <div key={item.id}>
                  <p>
                    <strong>Quantidade comprada:</strong> {item.quantity}
                  </p>

                  {products?.map(prod => {
                    if (prod.id === item.product_id) {
                      return (
                        <div key={prod.id}>
                          <p>
                            <strong>Título do anúncio:</strong> {prod.title}
                          </p>

                          <button
                            className="link-chat"
                            type="button"
                            onClick={() => handleLinkChat(prod)}
                          >
                            Link para chat com o comprador
                          </button>
                          <p />

                          <p>
                            <strong>Descrição do anúncio:</strong>{' '}
                            {prod.description}
                          </p>
                          <p>
                            <strong>Preço unitário:</strong>{' '}
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(Number(prod.price))}
                          </p>

                          <div className="product-images">
                            <p>
                              <strong>Fotos:</strong>
                            </p>

                            <img
                              src={
                                prod.productFiles[0]
                                  ? prod.productFiles[activeImageIndex]
                                      .image_url
                                  : placeholderImg
                              }
                              alt={prod.title}
                            />

                            <div className="images">
                              {prod.productFiles.map((image, index) => {
                                return (
                                  <button
                                    key={image.id}
                                    className={
                                      activeImageIndex === index ? 'active' : ''
                                    }
                                    type="button"
                                    onClick={() => {
                                      setActiveImageIndex(index);
                                    }}
                                  >
                                    <img
                                      src={image.image_url}
                                      alt={prod.title}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return <p />;
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="order-block">
          <div className="block-content">
            <h2>Comprador:</h2>
            <p>
              <strong>Nome:</strong> {order?.customer.name}
            </p>
            <p>
              <strong>Nome </strong>de usuário: {order?.customer.user_name}
            </p>
            <p>
              <strong>Email:</strong> {order?.customer.email}
            </p>
            <p>
              <strong>Cidade/Estado do comprador:</strong>{' '}
              {customerAddress?.city}/{customerAddress?.state}
            </p>

            <div className="avatar">
              <img
                src={customerAvatar || placeholderImg}
                alt={order?.customer.name}
              />
            </div>
          </div>
        </div>
      </OrderContainer>
    </div>
  );
};

export default UserSaleOrderShow;
