import React, { createContext, useCallback, useContext, useState } from 'react';

interface SearchState {
  filterProducts: string;
  category_id: string;
  sub_category_id: string;
}

interface SearchContextData {
  filterProducts: string;
  category_id: string;
  sub_category_id: string;
  setSearchParams(input: SearchState): void;
  clearSearchParams(): void;
}

const SearchContext = createContext<SearchContextData>({} as SearchContextData);

const SearchProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<SearchState>(() => {
    const filterProducts = localStorage.getItem('@GoBarber:filterProducts');
    const category_id = localStorage.getItem('@GoBarber:category_id');
    const sub_category_id = localStorage.getItem('@GoBarber:sub_category_id');

    if (filterProducts && category_id && sub_category_id) {
      return { filterProducts, category_id, sub_category_id };
    }

    return {} as SearchState;
  });

  const setSearchParams = useCallback(
    ({ filterProducts, category_id, sub_category_id }) => {
      localStorage.setItem('@GoBarber:filterProducts', filterProducts);
      localStorage.setItem('@GoBarber:category_id', category_id);
      localStorage.setItem('@GoBarber:sub_category_id', sub_category_id);

      setData({ filterProducts, category_id, sub_category_id });
    },
    [],
  );

  const clearSearchParams = useCallback(() => {
    localStorage.getItem('@GoBarber:filterProducts');
    localStorage.getItem('@GoBarber:category_id');
    localStorage.getItem('@GoBarber:sub_category_id');

    setData({} as SearchState);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        filterProducts: data.filterProducts,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        setSearchParams,
        clearSearchParams,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

function useSearch(): SearchContextData {
  const context = useContext(SearchContext);

  return context;
}

export { SearchProvider, useSearch };
