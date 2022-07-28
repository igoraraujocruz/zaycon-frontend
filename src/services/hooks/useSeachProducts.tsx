import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../apiClient';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  creditPoints: number;
  debitPoints: number;
  createdAt: string;
  photos: [
    {
      id: string;
      name: string;
      url: string;
    },
  ];
  user: {
    id: string;
    name: string;
  };
}

interface ProductsProviderProps {
  children: ReactNode;
}

interface ProductsContextData {
  searchProduct: Product[];
  teste: (value: string) => void;
  searchValueInput: string;
}

const ProductsContext = createContext<ProductsContextData>(
  {} as ProductsContextData,
);

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [searchValueInput, setSearchValueInput] = useState('');
  const [searchProduct, setSearchProduct] = useState<Product[]>([]);

  const teste = useCallback(
    async value => {
      setSearchValueInput(value);
      await api
        .get(`products/search/${searchValueInput}`)
        .then(response => setSearchProduct(response.data));
      setSearchProduct(response => response);
    },
    [searchValueInput],
  );

  return (
    <ProductsContext.Provider
      value={{ teste, searchValueInput, searchProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useSearchProduct() {
  const context = useContext(ProductsContext);

  return context;
}
