import React, { useEffect, useState } from 'react';

import { format, parseISO } from 'date-fns';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import Header from '../../components/Header';

import { OrdersContainer, OrderCard } from './styles';

interface IOrders {
  id: string;
  customer_id: string;
  seller_id: string;
  status: string;
  total_value: string;
  customer: {
    id: string;
    name: string;
    user_name: string;
  };
  created_at: string;
  updated_at: string;
}

const UserPurchseOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrders[]>();

  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    } else {
      api.get(`/orders/orders_of_seller/${user.id}`).then(response => {
        setOrders(response.data);
      });
    }
  }, [user, history]);

  // const handleGetUserName = useCallback(
  //   (user_id: string) => {
  //     if (users) {
  //       for (let i = 0; i < users?.length; i++) {
  //         if (user_id === users[i].id) {
  //           return users[i].name;
  //         }
  //       }
  //     }
  //     return '';
  //   },
  //   [users],
  // );

  // function handleFormatDate(inputDate: string): string {
  //   let hour = Number(`${inputDate[11]}${inputDate[12]}`);
  //   const min = Number(`${inputDate[14]}${inputDate[15]}`);

  //   let day = Number

  //   let day = '01';
  //   let month = '01';
  //   let year = '2021';

  //   if(hour < 6) {
  //     // caso 1: 01/01/2021 05h59m
  //     // dia voltar para 31
  //     // mês voltar para 12
  //     // ano voltar para 2020

  //     hour += 24 - 6;
  //   }

  //   hour -= 6;

  //   let hourShow = `${hour}`;
  //   if (hour < 10) hourShow = `0${hour}`;

  //   const formatDate =
  //     `${inputDate[8]}` +
  //     `${inputDate[9]}` +
  //     `/` +
  //     `${inputDate[5]}` +
  //     `${inputDate[6]}` +
  //     `/` +
  //     `${inputDate[0]}` +
  //     `${inputDate[1]}` +
  //     `${inputDate[2]}` +
  //     `${inputDate[3]}` +
  //     ` às ` +
  //     `${hourShow}h` +
  //     `${inputDate[14]}` +
  //     `${inputDate[15]}m`;

  //   return formatDate;
  // }

  return (
    <div>
      <Header />
      <OrdersContainer>
        <div className="title">
          <h3>Listagem dos meus pedidos de venda:</h3>
        </div>
        {orders?.map(item => {
          return (
            <OrderCard key={item.id}>
              {/* <button type="button" onClick={handleShowOrder(item.id)}> */}
              <Link to={`private_user_sale_order/${item.id}`}>
                <div>
                  <p>
                    <strong>id do pedido: </strong>
                    {item.id}
                  </p>
                  <p>
                    <strong>Comprador: </strong>
                    {item.customer.name}
                  </p>
                  {/* <p>Vendedor ID: {item.seller_id}</p> */}
                  <p>
                    <strong>Status: </strong>
                    {item.status}
                  </p>
                  <p>
                    <strong>Valor do pedido: </strong>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(item.total_value))}
                  </p>
                  <p>
                    <strong>Data do pedido: </strong>
                    {format(
                      parseISO(item.created_at),
                      "dd/MM/yyyy 'às' HH:mm'h'",
                    )}
                  </p>

                  {item?.created_at !== item?.updated_at ? (
                    <p>
                      <strong>Data da última atualização do pedido: </strong>
                      {item
                        ? format(
                            parseISO(item?.updated_at),
                            "dd/MM/yyyy 'às' HH:mm'h'",
                          )
                        : ''}
                    </p>
                  ) : (
                    <p />
                  )}

                  {/* <p>
                  Data da última atualização:{' '}
                  {format(
                    parseISO(item.updated_at),
                    "dd/MM/yyyy 'às' HH:mm'h'",
                  )}
                </p> */}
                </div>
              </Link>
              {/* </button> */}
            </OrderCard>
          );
        })}
      </OrdersContainer>
    </div>
  );
};

export default UserPurchseOrders;
