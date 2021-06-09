/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Link } from 'react-router-dom';

import { Container } from './styles';
import placeholderImg from '../../assets/image_dashboard.jpeg';

import { useAuth } from '../../hooks/auth';

interface IProductItem {
  id: string;
  title: string;
  photo: string;
  price: string;
  description: string;
  quantity: number;
  city: string;
  state: string;
}

interface IProps {
  product: IProductItem;
}

const Product: React.FC<IProps> = ({ product }: IProps) => {
  const { user } = useAuth();

  return (
    <Container>
      <Link
        to={
          !user
            ? `/products/${product.id}`
            : `/authenticated-show-product/${product.id}`
        }
      >
        <header>
          <img src={product.photo || placeholderImg} alt={product.title} />
        </header>
        <section className="body">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p className="price">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(product.price))}
          </p>
          <p>Quantidade: {product.quantity}</p>
          <p>
            {product.city}/{product.state}
          </p>
        </section>
      </Link>
    </Container>
  );
};

export default Product;
