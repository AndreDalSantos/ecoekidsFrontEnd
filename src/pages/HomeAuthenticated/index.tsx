import React, { useEffect, useState, useCallback, FormEvent } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useSearch } from '../../hooks/search';

import { estados } from '../../utils/states-cities.json';

import {
  Container,
  HeaderHome,
  Pagination,
  PaginationButton,
  PaginationItem,
  ProductsCardsContainer,
} from './styles';
import ProductCard from '../../components/ProductCard';
import { useToast } from '../../hooks/toast';
import { useChatsStatus } from '../../hooks/chatsStatus';

interface IProductItem {
  id: string;
  title: string;
  photo: string;
  price: string;
  description: string;
  quantity: number;
  state: string;
  city: string;
  neighborhood: string;
}

interface ICategoryItem {
  id: string;
  name: string;
}

interface ISubCategoryItem {
  id: string;
  name: string;
}

interface IStateInfo {
  nome: string;
  sigla: string;
}

const HomeAuthenticated: React.FC = () => {
  const {
    category_id: categoryIdFromStorage,
    sub_category_id: subCategoryIdFromStorage,
    filterProducts: filterProductsFromStorage,
    clearSearchParams,
  } = useSearch();

  const { addToast } = useToast();
  const {
    thereIsChatsIamBuyerWithUnreadedMessages,
    thereIsChatsIamSellerWithUnreadedMessages,
  } = useChatsStatus();

  const [products, setProducts] = useState<IProductItem[]>([]);
  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategoryItem[]>([]);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [category_id, setCategory_id] = useState(categoryIdFromStorage);
  const [sub_category_id, setSubCategory_id] = useState(
    subCategoryIdFromStorage,
  );
  const [sort, setSort] = useState('-1');
  const [filterProducts, setFilterProducts] = useState(
    filterProductsFromStorage,
  );
  const [pages, setPages] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);

  const [auxFilterProducts, setAuxFilterProducts] = useState('');

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [statesList, setStatesList] = useState<IStateInfo[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);

  const [unreadedMessagesFlag, setUnreadedMessagesFlag] = useState(false);

  const location = useLocation();
  const history = useHistory();

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
      try {
        let query = `filterProducts=`;

        if (filterProducts) {
          query += `${filterProducts}`;
        }

        if (category_id && category_id !== 'Selecione a categoria')
          query += `&category_id=${category_id}`;

        if (sub_category_id && sub_category_id !== 'Sub-categoria')
          query += `&sub_category_id=${sub_category_id}`;

        if (limit) query += `&limit=${limit}`;

        if (sort && sort !== 'Preço') query += `&sort=${sort}`;

        if (state && state !== 'Selecione a UF') query += `&state=${state}`;
        if (city && city !== 'Selecione a cidade') query += `&city=${city}`;

        const response = await api.get(
          `/products/search?${query}&page=${currentPage}`,
        );

        setTotal(Number(response.data.total));

        const totalPages = Math.ceil(total / limit);

        const arrayPages = [];
        for (let i = 1; i <= totalPages; i++) {
          arrayPages.push(i);
        }

        const allStates = estados.map(item => {
          return { nome: item.nome, sigla: item.sigla };
        });
        setStatesList(allStates);

        setPages(arrayPages);
        setProducts(response.data.productsList);
        setCategories(response.data.categories);
      } catch (error) {
        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Um erro ocorreu',
          description: errorMessage,
        });
      }
    }

    loadProducts();
    checkUnreadedMessages();
  }, [
    filterProducts,
    limit,
    total,
    sort,
    category_id,
    currentPage,
    location,
    categoryIdFromStorage,
    filterProductsFromStorage,
    state,
    city,
    addToast,
    checkUnreadedMessages,
    sub_category_id,
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
    async function loadSubCategories(categoryId: string) {
      const subCategoriesList = await api.get(`sub_categories/${categoryId}`);
      setSubCategories(subCategoriesList.data.subCategories);
    }

    setCategory_id(e.target.value);
    setCurrentPage(1);
    setSubCategory_id('');
    loadSubCategories(e.target.value);
  }, []);

  const getSubCategoryId = useCallback(e => {
    setSubCategory_id(e.target.value);
    setCurrentPage(1);
  }, []);

  const getSort = useCallback(e => {
    setSort(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleLogOut = useCallback(() => {
    signOut();
    history.push('/signin');
  }, [history, signOut]);

  const clearAllVariablesWhenBackToHome = useCallback(() => {
    clearSearchParams();
    setFilterProducts('');
    setCategory_id('');
    setSubCategory_id('');
    setLimit(90);
    setSort('-1');
    setTotal(0);
    setPages([0]);
    setCurrentPage(1);
  }, [clearSearchParams]);

  const inputFieldCapture = useCallback(e => {
    setAuxFilterProducts(e.target.value);
  }, []);

  const getCitiesListFromState = useCallback((selectedState: string) => {
    if (selectedState !== '' && selectedState !== 'Selecione o estado') {
      const allCitiesOfState = estados.filter(
        item => item.sigla === selectedState,
      );
      setCitiesList(allCitiesOfState[0].cidades);
    } else {
      setCitiesList([]);
    }
  }, []);

  const getState = useCallback(
    e => {
      if (e.target.value === 'Selecione o estado' || e.target.value === '') {
        setCity('');
        setState('');
      } else {
        setCity('');
        getCitiesListFromState(e.target.value);
        setState(e.target.value);
      }
    },
    [getCitiesListFromState],
  );

  const getCity = useCallback(e => {
    setCity(e.target.value);
  }, []);

  return (
    <Container>
      <HeaderHome>
        <div className="header-external">
          <div className="header-internal">
            <Link
              to="/authenticated-home"
              onClick={clearAllVariablesWhenBackToHome}
            >
              <h1>MARKET PLACE</h1>
              <h2>Compra e venda</h2>
            </Link>
            <form onSubmit={handleSearchProducts}>
              <div>
                <input
                  type="text"
                  name="filterProducts"
                  onKeyUpCapture={inputFieldCapture}
                  placeholder="Buscar por produto"
                />
                <button type="submit">Buscar</button>
              </div>
              <div>
                <select onChange={getState}>
                  <option>Selecione o estado</option>
                  {statesList &&
                    statesList.map(item => (
                      <option key={item.sigla} value={item.sigla}>
                        {item.nome}
                      </option>
                    ))}
                </select>

                <select onChange={getCity}>
                  <option>Selecione a cidade</option>
                  {citiesList &&
                    citiesList.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>

                <select onChange={getCategoryId}>
                  <option>Selecione a categoria</option>
                  {categories &&
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>

                <select onChange={getSubCategoryId}>
                  <option>Sub-categoria</option>
                  {subCategories &&
                    subCategories.map(subCategory => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))}
                </select>

                <select onChange={getSort}>
                  <option>Ordenar por valor</option>
                  <option value="-1">do maior para o menor</option>
                  <option value="1">do menor para o maior</option>
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
      </HeaderHome>

      <div className="total-products-advertise">
        <span>{total > 1 && `${total} produtos encontrados!`}</span>
        <span>{total === 1 && `${total} produto encontrado!`}</span>
        <span>{total === 0 && `Nenhum produto encontrado!`}</span>
      </div>

      <ProductsCardsContainer>
        <div>
          {products &&
            products.map(product => (
              <ProductCard key={product.id} product={product} />
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
    </Container>
  );
};

export default HomeAuthenticated;
