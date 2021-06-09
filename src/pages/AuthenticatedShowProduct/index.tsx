/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { parseISO, format } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import api from '../../services/api';
import { ProductContainer } from './styles';

import placeholderImg from '../../assets/image_dashboard.jpeg';
import { useAuth } from '../../hooks/auth';
import Header from '../../components/Header';

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

interface ISeller {
  id: string;
  name: string;
  user_name: string;
  created_at: string;
  reputation: number;
}

interface ISellerAddress {
  id: string;
  state: string;
  city: string;
  neighborhood: string;
}

interface ProductParams {
  product_id: string;
}

interface IComment {
  id: string;
  from_user_id: string;
  from_user_name: string;
  product_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const ShowProduct: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const params = useParams<ProductParams>();
  const [productShow, setProductShow] = useState<Product>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [seller, setSeller] = useState<ISeller>();
  const [sellerId, setSellerId] = useState('');
  const [sellerAddress, setSellerAddress] = useState<ISellerAddress>();
  const [sellerSinceYear, setSellerSinceYear] = useState('');
  const [sellerSinceMonth, setSellerSinceMonth] = useState('');
  const [comments, setComments] = useState<IComment[]>([]);
  const [addCommnetField, setAddCommnetField] = useState(0);
  const [commentContent, setCommentContent] = useState('');

  const { user } = useAuth();

  const handleCommentSubmit = useCallback(async () => {
    try {
      await api.post('/products/comments', {
        content: commentContent,
        product_id: productShow?.id,
      });
      setAddCommnetField(0);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }, [productShow, commentContent]);

  function handleSetProduct(product: Product) {
    setProductShow(product);
  }

  useEffect(() => {
    api.get(`products/show/${params.product_id}`).then(response => {
      handleGetSeller(response.data.productShow.user_id);
      setSellerId(response.data.productShow.user_id);
      handleGetSellerAddress(response.data.productShow.seller_address_id);
      handleGetComments(response.data.productShow.id);
      handleSetProduct(response.data.productShow);
    });
  }, [params.product_id]);

  const handleLoadCommentContent = useCallback(e => {
    setCommentContent(e.target.value);
  }, []);

  if (!productShow) {
    return <p>Carregando...</p>;
  }

  function handleGetSeller(seller_id: string): any {
    api.get(`profile/${seller_id}`).then(response => {
      const auxCreatedAt = response.data.user.created_at;

      const createdAt = parseISO(auxCreatedAt);

      const sinceMonth = format(createdAt, `MMMM`, {
        locale: brLocale,
      });

      const sinceYear = format(createdAt, 'yyyy', {
        locale: brLocale,
      });

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

  function handleGetComments(product_id: string): any {
    api.get(`products/comments/${product_id}`).then(response => {
      setComments(response.data);
    });
  }

  return (
    <ProductContainer>
      <Header />

      <div className="general-product">
        <div className="product-images">
          <img
            src={
              productShow.productFiles[0]
                ? productShow.productFiles[activeImageIndex].image_url
                : placeholderImg
            }
            alt={productShow.title}
          />

          <div className="images">
            {productShow.productFiles.map((image, index) => {
              return (
                <button
                  key={image.id}
                  className={activeImageIndex === index ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                  }}
                >
                  <img src={image.image_url} alt={productShow.title} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="product-details">
          <h1>{productShow?.title}</h1>
          <h2>
            Preço unitário:{' '}
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(productShow?.price))}
          </h2>
          <h3>
            <div>
              {productShow?.status === '1' ? (
                <div>Quantidade disponível: {productShow?.quantity}</div>
              ) : (
                'Produto indisponível'
              )}
            </div>
          </h3>
          <h3>Categoria: {productShow?.category.name}</h3>

          <p>
            <strong>Descrição: </strong>
            {productShow?.description}
          </p>

          <p>
            <strong>Vendedor: </strong>
            {seller ? seller.user_name : 'vendedor inválido!'}
          </p>
          <div>
            <div className="reputation-line">
              <strong>Reputação: </strong>
              <div className="reputation-value-container">
                <div
                  className={
                    seller && seller.reputation >= 1
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  1
                </div>
                <div
                  className={
                    seller && seller.reputation >= 2
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  2
                </div>
                <div
                  className={
                    seller && seller.reputation >= 3
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  3
                </div>
                <div
                  className={
                    seller && seller.reputation >= 4
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  4
                </div>
                <div
                  className={
                    seller && seller.reputation >= 5
                      ? 'reputation-number active-reputation-value'
                      : 'reputation-number'
                  }
                >
                  5
                </div>
              </div>
            </div>
          </div>
          <p>
            <strong>Cidade do vendedor: </strong>
            {sellerAddress?.city}/{sellerAddress?.state}
          </p>
          <p>
            <strong>
              Desde{' '}
              {seller
                ? `${sellerSinceMonth}/${sellerSinceYear}`
                : 'vendedor inválido'}
            </strong>
          </p>

          {/* {user && user.id === sellerId ? (
            <Link to={`/list-chats-of-product/${productShow.id}`}>
              <div className="link-list-chats">
                <p>Listar conversas deste anúncio</p>
              </div>
            </Link>
          ) : (
            <Link to={`/chat-page/${productShow.id}`}>
              <div className="link-talk-seller">
                <p>Falar com o vendedor</p>
              </div>
            </Link>
          )} */}

          {user && user.id === sellerId ? (
            <Link to={`/edit_product_ad/${productShow.id}`}>
              <div className="link-edit-product">
                <p>Editar este anúncio</p>
              </div>
            </Link>
          ) : productShow.status === '1' ? (
            <Link to={`/cart/${productShow.id}`}>
              <div className="link-buy-product">
                <p>COMPRAR</p>
              </div>
            </Link>
          ) : (
            <div className="not-available-product">
              <p>Não disponível</p>
            </div>
          )}
        </div>
      </div>

      <div className="comments">
        <div className="create-comment">
          {addCommnetField === 0 && user && (
            <button type="button" onClick={() => setAddCommnetField(1)}>
              Adicionar comentário
            </button>
          )}

          {addCommnetField === 1 && (
            <div className="insert-comment">
              <Form
                className="form-comment"
                ref={formRef}
                onSubmit={handleCommentSubmit}
              >
                <div>
                  <textarea
                    onKeyUpCapture={handleLoadCommentContent}
                    maxLength={300}
                    cols={45}
                    rows={10}
                    placeholder="Escreva aqui seu comentário ou pergunta para o vendedor."
                  />

                  <div>
                    <button type="submit" className="save-comment-button">
                      Salvar
                    </button>
                    <button type="button" onClick={() => setAddCommnetField(0)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
        <div className="all-comments">
          {comments &&
            comments.map(comment => (
              <div key={comment.id} className="comment-container">
                <div className="comment-header">
                  <h3>De: {comment.from_user_name}</h3>
                </div>
                <p className="comment-created-date">
                  {format(
                    parseISO(comment.created_at),
                    "dd'/'MM'/'yyyy', às ' HH:mm'h'",
                    { locale: brLocale },
                  )}
                </p>
                <p>{comment.content}</p>
              </div>
            ))}
        </div>
      </div>
    </ProductContainer>
  );
};

export default ShowProduct;
