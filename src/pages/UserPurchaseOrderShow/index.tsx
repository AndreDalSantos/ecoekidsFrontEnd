/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

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
  rating: string;
  order_products: Array<{
    id: string;
    product_id: string;
    price: string;
    quantity: number;
  }>;
  seller: {
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

interface ISellerAddress {
  id: string;
  state: string;
  city: string;
  neighborhood: string;
}

const UserPurchseOrderShow: React.FC = () => {
  const params = useParams<OrderParams>();
  const [order, setOrder] = useState<IOrder>();
  const [products, setProducts] = useState<IProduct[]>();
  const [sellerAddress, setSellerAddress] = useState<ISellerAddress>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sellerAvatar, setSellerAvatar] = useState('');

  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api.get(`/orders/${params.order_id}`).then(response => {
        handleGetProducts(response.data.order_products);
        handleGetSellerInfo(response.data.seller_id);
        setOrder(response.data);
      });
    }
  }, [params.order_id, user, history]);

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

  function handleGetSellerInfo(seller_id: string | undefined): void {
    if (seller_id) {
      api.get(`adresses/${seller_id}`).then(response => {
        setSellerAddress(response.data[0]);
      });
      api.get(`profile/${seller_id}`).then(response => {
        setSellerAvatar(response.data.user.avatar_url);
      });
    }
  }

  return (
    <div>
      <Header />
      <OrderContainer>
        <div className="order-block">
          <div className="block-content">
            {order?.status === 'concluded' && <h3>Pedido concluído</h3>}
            {order?.status === 'started' && <h3>Pedido em andamento</h3>}
            {order?.status === 'canceled' && <h3>Pedido cacelado</h3>}
            {order?.status === 'concluded' && order.rating === null ? (
              <h4>
                <Link to={`/evaluate_order/${order.id}`}>
                  Avalie o vendedor desta compra!
                </Link>
              </h4>
            ) : (
              ''
            )}
            {order?.status === 'concluded' && order.rating !== null ? (
              <h4 className="order-evaluate">
                Minha nota para o vendedor deste produto: {order.rating}
              </h4>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="order-block">
          <div className="block-content">
            <h2>Dados do pedido:</h2>
            <p>
              <strong>Valor da compra: </strong>

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

                          <Link to={`/chat-page/${prod.id}`}>
                            <p>Link para chat com o vendedor</p>
                          </Link>
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
            <h2>Vendedor:</h2>
            <p>
              <strong>Nome:</strong> {order?.seller.name}
            </p>
            <p>
              <strong>Nome </strong>de usuário: {order?.seller.user_name}
            </p>
            <p>
              <strong>Email:</strong> {order?.seller.email}
            </p>
            <p>
              <strong>Cidade/Estado do vendedor:</strong> {sellerAddress?.city}/
              {sellerAddress?.state}
            </p>
            <div className="reputation-line">
              <strong>Reputação: </strong>
              <div className="reputation-value-container">
                <div
                  className={
                    order?.seller && Number(order?.seller.reputation) >= 1
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  1
                </div>
                <div
                  className={
                    order?.seller && Number(order?.seller.reputation) >= 2
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  2
                </div>
                <div
                  className={
                    order?.seller && Number(order?.seller.reputation) >= 3
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  3
                </div>
                <div
                  className={
                    order?.seller && Number(order?.seller.reputation) >= 4
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  4
                </div>
                <div
                  className={
                    order?.seller && Number(order?.seller.reputation) >= 5
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  5
                </div>
              </div>
            </div>

            <div className="avatar">
              <img
                src={sellerAvatar || placeholderImg}
                alt={order?.seller.name}
              />
            </div>
          </div>
        </div>
      </OrderContainer>
    </div>
  );
};

export default UserPurchseOrderShow;
