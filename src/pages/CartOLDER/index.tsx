/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */

import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';
import {
  Container,
  CartContainer,
  PurchaseConfirmedCard,
  PurchaseNotConfirmedCard,
} from './styles';

import { useAuth } from '../../hooks/auth';

import Header from '../../components/Header';

import placeholderImg from '../../assets/image_dashboard.jpeg';
import { useToast } from '../../hooks/toast';

interface Product {
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

interface IUserAddress {
  id: string;
  state: string;
  city: string;
  neighborhood: string;
}

interface ISeller {
  id: string;
  name: string;
  user_name: string;
  created_at: string;
  reputation: number;
  email: string;
}

interface ProductParams {
  product_id: string;
}

const Cart: React.FC = () => {
  const params = useParams<ProductParams>();
  const [productShow, setProductShow] = useState<Product>();
  const [productAmount, setProductAmount] = useState(1);
  const [confirmPurchase, setConfirmPurchase] = useState(0);
  const [customerAddress, setCustomerAddress] = useState<IUserAddress>();
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(0);

  const [seller, setSeller] = useState<ISeller>();
  const [sellerAddress, setSellerAddress] = useState<IUserAddress>();
  const [sellerSinceYear, setSellerSinceYear] = useState('');
  const [sellerSinceMonth, setSellerSinceMonth] = useState('');

  const [blockConfirmPurchaseButton, setBlockConfirmPurchaseButton] = useState(
    0,
  );

  const history = useHistory();

  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    api.get(`products/show/${params.product_id}`).then(response => {
      handleGetCustomerAddress(user.id);
      handleGetSeller(response.data.productShow.user_id);
      handleGetSellerAddress(response.data.productShow.seller_address_id);
      setProductShow(response.data.productShow);
    });
  }, [params.product_id, user.id]);

  if (!productShow) {
    return <p>Carregando...</p>;
  }

  function handleGetCustomerAddress(customer_id: string): any {
    api.get(`adresses/${customer_id}`).then(response => {
      setCustomerAddress(response.data[0]);
    });
  }

  function handleIncrement(): void {
    let aux = 0;
    aux = productAmount + 1;
    if (productShow?.quantity) {
      if (aux > productShow?.quantity) {
        aux = productShow?.quantity;
      }
      setProductAmount(aux);
    }
  }

  function handleDecrement(): void {
    let aux = 0;
    aux = productAmount - 1;
    if (aux < 1) {
      aux = 1;
    }
    setProductAmount(aux);
  }

  function handleGetSeller(seller_id: string): any {
    api.get(`profile/${seller_id}`).then(response => {
      const auxCreatedAt = response.data.user.created_at;

      // 2020-11-17T16:16:24.909Z
      const sinceYear =
        auxCreatedAt[0] + auxCreatedAt[1] + auxCreatedAt[2] + auxCreatedAt[3];

      const sinceMonthAux = [];
      let auxFlagOfCreatedAtString = false;

      let dashStringCount = 0;

      for (let i = 0; i < auxCreatedAt.length; i++) {
        if (auxCreatedAt[i] === '-') {
          dashStringCount++;
          if (auxFlagOfCreatedAtString) {
            auxFlagOfCreatedAtString = false;
          } else {
            auxFlagOfCreatedAtString = true;
          }
        }

        if (auxFlagOfCreatedAtString && dashStringCount === 1) {
          dashStringCount++;
        } else if (auxFlagOfCreatedAtString && dashStringCount < 3) {
          sinceMonthAux.push(auxCreatedAt[i]);
        }
      }

      let auxMonth = '';
      for (let i = 0; i < sinceMonthAux.length; i++) {
        auxMonth += sinceMonthAux[i];
      }

      let sinceMonth = '';

      switch (auxMonth) {
        case '1':
        case '01':
          sinceMonth = 'Janeiro';
          break;
        case '2':
        case '02':
          sinceMonth = 'Fevereiro';
          break;
        case '3':
        case '03':
          sinceMonth = 'Março';
          break;
        case '4':
        case '04':
          sinceMonth = 'Abril';
          break;
        case '5':
        case '05':
          sinceMonth = 'Maio';
          break;
        case '6':
        case '06':
          sinceMonth = 'Junho';
          break;
        case '7':
        case '07':
          sinceMonth = 'Julho';
          break;
        case '8':
        case '08':
          sinceMonth = 'Agosto';
          break;
        case '9':
        case '09':
          sinceMonth = 'Setembro';
          break;
        case '10':
          sinceMonth = 'Outubro';
          break;
        case '11':
          sinceMonth = 'Novembro';
          break;
        case '12':
          sinceMonth = 'Dezembro';
          break;
        default:
          sinceMonth = 'Mês inválido';
      }

      setSellerSinceYear(sinceYear);
      setSellerSinceMonth(sinceMonth);

      setSeller(response.data.user);
    });
  }

  function handleGetSellerAddress(seller_address_id: string): any {
    api.get(`adresses/show/${seller_address_id}`).then(response => {
      setSellerAddress(response.data);
    });
  }

  async function handleCreateOrder(): Promise<any> {
    try {
      if (productShow) {
        setBlockConfirmPurchaseButton(1);
        const products = [{ id: productShow.id, quantity: productAmount }];
        const cart = { products, customer_address_id: customerAddress?.id };
        const order = await api.post('/orders', cart);

        if (order) {
          setPurchaseConfirmed(1);

          addToast({
            type: 'success',
            title: 'Pedido realizado com sucesso!',
            description: '',
          });
        }
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

  function handleFinalizeOrder(): void {
    history.push('/authenticated-home');
  }

  return (
    <Container>
      <Header />
      <CartContainer>
        {purchaseConfirmed === 0 ? (
          <PurchaseNotConfirmedCard>
            <div className="product-block">
              <div className="block">
                <p>Produto</p>
                <p>
                  <strong>{productShow.title}</strong>
                </p>
              </div>

              <div className="block">
                <p>Preço Unitário</p>
                <p>
                  <strong>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(productShow?.price))}
                  </strong>
                </p>
              </div>

              <div className="block">
                <p>Quantidade</p>
                <div className="quantity-block">
                  {confirmPurchase ? (
                    <p>-</p>
                  ) : (
                    <button type="button" onClick={handleDecrement}>
                      -
                    </button>
                  )}
                  <h4>{productAmount}</h4>
                  {confirmPurchase ? (
                    <p>+</p>
                  ) : (
                    <button type="button" onClick={handleIncrement}>
                      +
                    </button>
                  )}
                </div>
              </div>

              <div className="block">
                <p>Valor:</p>
                <h4>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(productAmount * Number(productShow.price))}
                </h4>
              </div>
            </div>

            <div className="confirmation-ask">
              {confirmPurchase === 1 && (
                <p>
                  Confirmar compra de <strong>{productAmount}</strong>{' '}
                  <strong>{productShow.title}</strong> ao valor total de{' '}
                  <strong>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(productAmount * Number(productShow.price))}
                  </strong>
                  ?
                </p>
              )}
            </div>

            <div className="buy-or-cancel-commands">
              <div className="buy">
                {confirmPurchase === 1 ? (
                  <button
                    type="button"
                    onClick={
                      blockConfirmPurchaseButton === 0
                        ? handleCreateOrder
                        : () => console.log('wait...')
                    }
                  >
                    {blockConfirmPurchaseButton === 0 ? (
                      <div>CONFIRMAR</div>
                    ) : (
                      <div>Aguarde...</div>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmPurchase(1);
                    }}
                  >
                    Comprar
                  </button>
                )}
              </div>

              <div className="cancel">
                <button
                  type="button"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </PurchaseNotConfirmedCard>
        ) : (
          <PurchaseConfirmedCard>
            <h2>Olá {user.name}, seu pedido foi realizado com sucesso!</h2>
            <p>
              Agora você deverá entrar em contato com o vendedor através dos
              meios disponíveis abaixo e combinar detalhes de entrega e
              pagamento, o que for melhor para ambos.
            </p>
            <div className="order-info">
              <h3>Produto: {productShow.title}</h3>
              <img
                src={productShow.productFiles[0].image_url || placeholderImg}
                alt={`Imagem de ${productShow.title}`}
              />
              <p>Descrição: {productShow.description}</p>
              <p>Quantidade: {productAmount}</p>
              <p>
                Preço unitário:{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(productShow.price))}
              </p>
              <p className="total-value-p">
                Valor total do pedido:{' '}
                <strong>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(productAmount * Number(productShow.price))}
                </strong>
              </p>
            </div>
            <div className="seller-info">
              <h3>Dados do vendedor:</h3>
              {/* <p>
                Nome: <strong>{seller?.name}</strong>
              </p> */}
              <p>
                Nome de usuário: <strong>{seller?.user_name}</strong>
              </p>
              {/* <p>
                Email: <strong>{seller?.email}</strong>
              </p> */}
              <p>
                Cidade: <strong>{sellerAddress?.city}</strong>
              </p>
              <p>
                Estado: <strong>{sellerAddress?.state}</strong>
              </p>
              <p>
                Desde:{' '}
                <strong>{`${sellerSinceMonth}/${sellerSinceYear}`}</strong>
              </p>
            </div>

            <div>
              <p>Foi enviado um email de confirmação a você</p>
            </div>

            <div>
              <button type="button" onClick={handleFinalizeOrder}>
                Voltar
              </button>
            </div>
          </PurchaseConfirmedCard>
        )}
      </CartContainer>
    </Container>
  );
};

export default Cart;
