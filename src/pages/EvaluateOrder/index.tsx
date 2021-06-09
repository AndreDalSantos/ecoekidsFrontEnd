/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Header from '../../components/Header';

import { OrderContainer } from './styles';
import { useToast } from '../../hooks/toast';

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

const EvaluateOrder: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const params = useParams<OrderParams>();

  const [order, setOrder] = useState<IOrder>();
  const [rating, setRating] = useState(0);
  const [checkR1, setCheckR1] = useState(1);
  const [checkR2, setCheckR2] = useState(1);
  const [checkR3, setCheckR3] = useState(1);
  const [checkR4, setCheckR4] = useState(1);
  const [checkR5, setCheckR5] = useState(1);

  const { user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api.get(`/orders/${params.order_id}`).then(response => {
        setOrder(response.data);
      });
    }
  }, [params.order_id, user, history]);

  const handleEvaluateSubmit = useCallback(() => {
    api.post(`/orders/rating_order_by_a_customer/${order?.id}`, { rating });

    addToast({
      type: 'success',
      title: 'Avaliação submetida com sucesso!',
      description: '',
    });

    history.push(`/private_user_purchase_orders_index`);
  }, [history, rating, order, addToast]);

  return (
    <div>
      <Header />
      <OrderContainer>
        <h2>Avaliação do vendedor do pedido</h2>

        <div className="seller-block">
          <div className="seller-block-content">
            <p>
              <strong>Nome do vendedor:</strong> {order?.seller.name}
            </p>
            <p>
              <strong>Email:</strong> {order?.seller.email}
            </p>
            <p>
              <strong>Reputação:</strong> {order?.seller.reputation}
            </p>
          </div>
        </div>

        <Form
          className="form-evaluate-container"
          ref={formRef}
          onSubmit={handleEvaluateSubmit}
        >
          <h3>Nota:</h3>
          <div className="check-buttons-evaluate">
            <button
              type="button"
              className={
                checkR1 === 2
                  ? 'selected'
                  : checkR1 === 1
                  ? 'free'
                  : 'not-selected'
              }
              onClick={() => {
                setCheckR1(2);
                setCheckR2(0);
                setCheckR3(0);
                setCheckR4(0);
                setCheckR5(0);

                setRating(1);
              }}
            >
              1
            </button>
            <button
              type="button"
              className={
                checkR2 === 2
                  ? 'selected'
                  : checkR2 === 1
                  ? 'free'
                  : 'not-selected'
              }
              onClick={() => {
                setCheckR1(0);
                setCheckR2(2);
                setCheckR3(0);
                setCheckR4(0);
                setCheckR5(0);

                setRating(2);
              }}
            >
              2
            </button>
            <button
              type="button"
              className={
                checkR3 === 2
                  ? 'selected'
                  : checkR3 === 1
                  ? 'free'
                  : 'not-selected'
              }
              onClick={() => {
                setCheckR1(0);
                setCheckR2(0);
                setCheckR3(2);
                setCheckR4(0);
                setCheckR5(0);

                setRating(3);
              }}
            >
              3
            </button>
            <button
              type="button"
              className={
                checkR4 === 2
                  ? 'selected'
                  : checkR4 === 1
                  ? 'free'
                  : 'not-selected'
              }
              onClick={() => {
                setCheckR1(0);
                setCheckR2(0);
                setCheckR3(0);
                setCheckR4(2);
                setCheckR5(0);

                setRating(4);
              }}
            >
              4
            </button>
            <button
              type="button"
              className={
                checkR5 === 2
                  ? 'selected'
                  : checkR5 === 1
                  ? 'free'
                  : 'not-selected'
              }
              onClick={() => {
                setCheckR1(0);
                setCheckR2(0);
                setCheckR3(0);
                setCheckR4(0);
                setCheckR5(2);

                setRating(5);
              }}
            >
              5
            </button>
          </div>
          {rating > 0 && (
            <button className="submit-button" type="submit">
              Enviar
            </button>
          )}
          {rating === 0 && (
            <button className="false-button" type="button">
              Enviar
            </button>
          )}
        </Form>
      </OrderContainer>
    </div>
  );
};

export default EvaluateOrder;
