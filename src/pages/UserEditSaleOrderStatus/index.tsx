/* eslint-disable no-await-in-loop */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { format, parseISO } from 'date-fns';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import Header from '../../components/Header';

import { OrderContainer } from './styles';

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

const UserEditSaleOrderStatus: React.FC = () => {
  const params = useParams<OrderParams>();
  const [order, setOrder] = useState<IOrder>();
  const [products, setProducts] = useState<IProduct[]>();
  const [customerAddress, setCustomerAddress] = useState<ICustomerAddress>();
  const [confirmation, setConfirmation] = useState(false);
  const [cancellation, setCancellation] = useState(false);

  const history = useHistory();
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api.get(`/orders/${params.order_id}`).then(response => {
        handleGetProducts(response.data.order_products);
        handleGetCustomerAddress(response.data.customer_id);
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

  function handleGetCustomerAddress(customer_id: string): void {
    api.get(`adresses/${customer_id}`).then(response => {
      setCustomerAddress(response.data[0]);
    });
  }

  const handleConfirmOrder = useCallback(
    async (order_id: string) => {
      try {
        await api.put(`orders/${order_id}`, { status: 'concluded' });

        addToast({
          type: 'success',
          title: 'O pedido foi concluído com sucesso.',
          description: '',
        });

        history.push(`/private_user_sale_order/${order_id}`);
      } catch (error) {
        console.log(error);

        addToast({
          type: 'error',
          title:
            'Não foi possível alterar o status do pedido, tente novamente mais tarde.',
          description: '',
        });
      }
    },
    [addToast, history],
  );

  const handleCancelOrder = useCallback(
    async (order_id: string) => {
      try {
        await api.put(`orders/${order_id}`, { status: 'canceled' });

        addToast({
          type: 'success',
          title: 'O pedido foi cancelado com sucesso.',
          description: '',
        });

        history.push(`/private_user_sale_order/${order_id}`);
      } catch (error) {
        console.log(error);

        addToast({
          type: 'error',
          title:
            'Não foi possível alterar o status do pedido, tente novamente mais tarde.',
          description: '',
        });
      }
    },
    [addToast, history],
  );

  return (
    <div>
      <Header />
      <OrderContainer>
        <h1>Alterar status de pedido</h1>

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
          </div>
        </div>

        <div className="order-block">
          <div className="block-content">
            {!confirmation &&
              !cancellation &&
              order?.status !== 'concluded' &&
              order?.status !== 'canceled' && (
                <div className="change-status-block">
                  <h3>Status atual: {order?.status}</h3>

                  <div className="change-status-buttons">
                    <button type="button" onClick={() => setConfirmation(true)}>
                      Concluir pedido
                    </button>

                    <button type="button" onClick={() => setCancellation(true)}>
                      Cancelar pedido
                    </button>
                  </div>
                </div>
              )}

            {confirmation &&
              order?.status !== 'concluded' &&
              order?.status !== 'canceled' && (
                <div className="change-status-block">
                  <h4>
                    Confirmar <strong>CONCLUSÃO</strong> do pedido?
                  </h4>
                  <div className="change-status-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        if (order) {
                          handleConfirmOrder(order?.id);
                        }
                      }}
                    >
                      CONCLUIR PEDIDO
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmation(false)}
                    >
                      VOLTAR
                    </button>
                  </div>
                  <p>
                    *OBS: Somente se você ja finalizou a negociação com o
                    comprador!
                  </p>
                  <p>**OBS: Esta ação não poderá ser desfeita!</p>
                </div>
              )}

            {cancellation &&
              order?.status !== 'concluded' &&
              order?.status !== 'canceled' && (
                <div className="change-status-block">
                  <h4>
                    Confirmar <strong>CANCELAMENTO</strong> do pedido?
                  </h4>
                  <div className="change-status-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        if (order) {
                          handleCancelOrder(order?.id);
                        }
                      }}
                    >
                      CANCELAR PEDIDO
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancellation(false)}
                    >
                      VOLTAR
                    </button>
                  </div>
                  <p>
                    *OBS: Somente se a negociação com o comprador não avançou!
                  </p>
                  <p>**OBS: Esta ação não poderá ser desfeita!</p>
                </div>
              )}
          </div>
        </div>

        {/* <br />
        <h3>Status atual: {order?.status}</h3>
        <br />
        <div>
          {order?.status === 'concluded' || order?.status === 'canceled' ? (
            <div />
          ) : (
            <div>
              <Link to={`/confirm_concluded_sale_order/${params.order_id}`}>
                Concluir pedido
              </Link>
              <p>
                * Lembrando que ao mudar o status para concluído poderá
                solicitar uma avaliação positiva ao comprador e aumentar sua
                reputação o que poderá beneficiar suas futuras negociações!
              </p>
              <br />
              <Link to={`/confirm_canceled_sale_order/${params.order_id}`}>
                Cancelar pedido
              </Link>
              <p>
                ** Caso a negociação não tenha sido concluída por qualquer
                motivo poderá cancelar este pedido fazendo com que seu produto,
                nas quantidades deste pedido, seja novamente anúnciado.
              </p>
            </div>
          )}
        </div>
        <br /> */}
      </OrderContainer>
    </div>
  );
};

export default UserEditSaleOrderStatus;
