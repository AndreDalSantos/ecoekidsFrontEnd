/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Link } from 'react-router-dom';

import { Container } from './styles';
import placeholderImg from '../../assets/image_dashboard.jpeg';

interface IProductItem {
  id: string;
  title: string;
  photo: string;
  price: string;
  description: string;
  quantity: number;
  status: string;
  deleted: string;
}

interface IProps {
  product: IProductItem;
}

const Product: React.FC<IProps> = ({ product }: IProps) => {
  return (
    <Container>
      <Link to={`/authenticated-show-product/${product.id}`}>
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
            {product.deleted === '0' &&
              (product.status === '1' ? 'Disponível' : 'Indisponível')}
          </p>
          <p>{product.deleted === '1' && 'Removido'}</p>
        </section>
      </Link>
    </Container>
  );
};

export default Product;
