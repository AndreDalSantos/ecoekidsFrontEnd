/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import MyProductCard from '../../components/MyProductCard';

import api from '../../services/api';
import {
  Pagination,
  PaginationButton,
  PaginationItem,
  ProductsContainer,
  HeaderMyProducts,
  ProductsCardsContainer,
} from './styles';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useChatsStatus } from '../../hooks/chatsStatus';

interface IProductItem {
  id: string;
  title: string;
  status: string;
  photo: string;
  price: string;
  description: string;
  quantity: number;
  deleted: '0' | '1';
}

interface ICategoryItem {
  id: string;
  name: string;
}

const ListMyProducts: React.FC = () => {
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [category_id, setCategory_id] = useState();
  const [sort, setSort] = useState();
  const [filterProducts, setFilterProducts] = useState('');
  const [pages, setPages] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedSearch, setDeletedSearch] = useState('0');
  const [statusSearch, setStatusSearch] = useState('1');
  const [auxFilterProducts, setAuxFilterProducts] = useState('');

  const [unreadedMessagesFlag, setUnreadedMessagesFlag] = useState(false);

  const history = useHistory();
  const { addToast } = useToast();

  const {
    thereIsChatsIamBuyerWithUnreadedMessages,
    thereIsChatsIamSellerWithUnreadedMessages,
  } = useChatsStatus();

  const { user, signOut } = useAuth();

  const checkUnreadedMessages = useCallback(() => {
    const check =
      thereIsChatsIamBuyerWithUnreadedMessages.length > 0 ||
      thereIsChatsIamSellerWithUnreadedMessages.length > 0;

    setUnreadedMessagesFlag(check);
  }, [
    thereIsChatsIamBuyerWithUnreadedMessages,
    thereIsChatsIamSellerWithUnreadedMessages,
  ]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      let query = `filterProducts=`;

      if (filterProducts) {
        query += `${filterProducts}`;
      }

      if (category_id && category_id !== 'Selecione a categoria')
        query += `&category_id=${category_id}`;

      if (statusSearch !== '2') query += `&status=${statusSearch}`;
      if (deletedSearch !== '2') query += `&deleted=${deletedSearch}`;

      if (limit) query += `&limit=${limit}`;

      if (sort && sort !== 'Preço') query += `&sort=${sort}`;

      const response = await api.get(
        `/products/list-my-products/${user.id}?${query}&page=${currentPage}`,
      );

      setTotal(Number(response.data.total));

      const totalPages = Math.ceil(total / limit);

      const arrayPages = [];
      for (let i = 1; i <= totalPages; i++) {
        arrayPages.push(i);
      }

      setPages(arrayPages);
      setProducts(response.data.productsList);
      setCategories(response.data.categories);
    }

    loadProducts();
    checkUnreadedMessages();
  }, [
    user,
    category_id,
    filterProducts,
    limit,
    sort,
    total,
    currentPage,
    statusSearch,
    deletedSearch,
    addToast,
    checkUnreadedMessages,
  ]);

  const handleSearchProducts = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      setFilterProducts(auxFilterProducts);
      setCurrentPage(1);
    },
    [auxFilterProducts],
  );

  const getCategoryId = useCallback(e => {
    setCategory_id(e.target.value);
    setCurrentPage(1);
  }, []);

  const getSort = useCallback(e => {
    setSort(e.target.value);
    setCurrentPage(1);
  }, []);

  const getStatus = useCallback(e => {
    setStatusSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const getDeleted = useCallback(e => {
    setDeletedSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  function handleLogOut(): void {
    signOut();
    history.push('/signin');
  }

  const inputFieldCapture = useCallback(e => {
    setAuxFilterProducts(e.target.value);
  }, []);

  return (
    <ProductsContainer>
      <HeaderMyProducts>
        <div className="header-external">
          <div className="header-internal">
            <Link to="/authenticated-home">
              <h1>MARKET PLACE</h1>
              <h2>Compra e venda</h2>
            </Link>

            <form onSubmit={handleSearchProducts}>
              <div>
                <input
                  type="text"
                  name="filterProducts"
                  onKeyUpCapture={inputFieldCapture}
                  placeholder="Buscar em meus anúncios"
                />
                <button type="submit">Buscar</button>
              </div>

              <div>
                <select onChange={getCategoryId}>
                  <option>Selecione a categoria</option>
                  {categories &&
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>

                <select onChange={getSort}>
                  <option>Preço</option>
                  <option value="-1">do maior para o menor</option>
                  <option value="1">do menor para o maior</option>
                </select>

                <select onChange={getDeleted}>
                  <option value="0">Existentes</option>
                  <option value="1">Removidos</option>
                  <option value="2">Todos</option>
                </select>

                <select onChange={getStatus}>
                  <option value="1">Disponíveis</option>
                  <option value="0">Indisponíveis</option>
                  <option value="2">Todos</option>
                </select>
              </div>
            </form>

            <nav className="primary">
              <ul>
                <li>
                  {user && <Link to="/create-product">Novo anúncio</Link>}
                  {!user && <Link to="/signup">Cadastre-se</Link>}
                </li>
                {!user && (
                  <li>
                    <Link to="/signin">Entrar</Link>
                  </li>
                )}
                {user && (
                  <li className="dropdown-container">
                    {!unreadedMessagesFlag && (
                      <Link to="/profile">Minha conta</Link>
                    )}
                    {unreadedMessagesFlag && (
                      <div>
                        <Link to="/profile">Minha conta</Link>
                        <div className="new-messages">novas mensagens</div>
                      </div>
                    )}
                    <ul className="dropdown">
                      <li>
                        <Link to="/profile">Minha conta</Link>
                      </li>
                      <li>
                        <Link to="/private_user_purchase_orders_index">
                          Meus pedidos
                        </Link>
                      </li>
                      <li>
                        <Link to="/private_user_sales_orders_index">
                          Minhas vendas
                        </Link>
                      </li>
                      <li>
                        <Link to="/list-my-products-ads">Meus anúncios</Link>
                      </li>
                      <li>
                        {!unreadedMessagesFlag && (
                          <Link to="/list-chats">Chats</Link>
                        )}
                        {unreadedMessagesFlag && (
                          <div>
                            <Link to="/list-chats">
                              <div className="new-messages">
                                novas mensagens
                              </div>
                            </Link>
                          </div>
                        )}
                      </li>
                      <li>
                        <button type="button" onClick={handleLogOut}>
                          Sair
                        </button>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </HeaderMyProducts>

      <div className="total-products-advertise">
        <h2>Meus anúncios</h2>
        <span>{total > 1 && `${total} anúncios encontrados!`}</span>
        <span>{total === 1 && `${total} anúncio encontrado!`}</span>
        <span>{total === 0 && `Nenhum anúncio encontrado!`}</span>
      </div>

      <ProductsCardsContainer>
        <div>
          {products &&
            products.map(product => (
              <MyProductCard key={product.id} product={product} />
            ))}
        </div>
      </ProductsCardsContainer>

      <div className="pagination-container">
        <Pagination>
          <PaginationButton>
            {currentPage > 1 && (
              <PaginationItem onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <div>
                <span>...</span>
              </div>
            )}

            {pages.map(page => {
              if (
                (currentPage <= 3 && page <= currentPage) ||
                (currentPage > 3 &&
                  currentPage - page < 3 &&
                  currentPage - page >= 0) ||
                (pages.length - currentPage < 3 && page > currentPage) ||
                (currentPage <= pages.length - 3 &&
                  page - currentPage < 3 &&
                  page - currentPage >= 0)
              ) {
                return (
                  <PaginationItem
                    aria-selected={page === currentPage}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationItem>
                );
              }

              return <div />;
            })}

            {currentPage <= pages.length - 3 && (
              <div>
                <span>...</span>
              </div>
            )}

            {currentPage < pages.length && (
              <PaginationItem onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </PaginationItem>
            )}
          </PaginationButton>
        </Pagination>
      </div>
    </ProductsContainer>
  );
};

export default ListMyProducts;
