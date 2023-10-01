import { useToast } from '@chakra-ui/react';
import {
  useEffect,
  useRef,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { api } from '../apiClient';

interface Photos {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  category: string;
  slug: string;
  photos: Photos[];
}

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: string;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: string) => Promise<void>;
  removeProduct: (productId: string) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
  removeAllProductsInBag: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const toast = useToast();

  const [cart, setCart] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const storagedCart = localStorage.getItem('babi-show:cart');

      if (storagedCart) {
        return JSON.parse(storagedCart);
      }

      return [];
    }
  });

  const prevCartRef = useRef<Product[]>();

  useEffect(() => {
    prevCartRef.current = cart;
  });

  const cartPreviousValue = prevCartRef.current ?? cart;

  useEffect(() => {
    if (cartPreviousValue !== cart) {
      localStorage.setItem('babi-show:cart', JSON.stringify(cart));
    }
  }, [cart, cartPreviousValue]);

  const addProduct = async (productId: string) => {
    try {
      const updatedCart = [...cart];
      const productExists = updatedCart.find(
        product => product.id === productId,
      );
      const stock = await api.get<Product>(`/products?productId=${productId}`);
      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1;

      if (amount > stockAmount) {
        toast({
          position: 'bottom-right',
          title: 'Quantidade solicitada fora de estoque',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      if (productExists) {
        productExists.amount = amount;
      } else {
        const product = await api.get<Product>(
          `/products?productId=${productId}`,
        );

        const newProduct = {
          ...product.data,
          amount: 1,
        };
        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      toast({
        position: 'bottom-right',
        title: `Adicionado ao Carrinho!`,
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    } catch {
      toast({
        position: 'bottom-right',
        title: 'Erro na adição do produto',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const removeProduct = (productId: string) => {
    try {
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        product => product.id === productId,
      );

      if (productIndex >= 0) {
        updatedCart.splice(productIndex, 1);
        setCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast({
        position: 'bottom-right',
        title: 'Erro na remoção do produto',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const removeAllProductsInBag = () => {
    setCart([]);
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return;
      }

      const stock = await api.get(`/products?productId=${productId}`);
      const stockAmount = stock.data.amount;

      if (amount > stockAmount) {
        toast({
          position: 'bottom-right',
          title: 'Quantidade solicitada fora de estoque',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });

        return;
      }

      const updatedCart = [...cart];

      const productExist = updatedCart.find(
        product => product.id === productId,
      );

      if (productExist) {
        productExist.amount = amount;
        setCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast({
        position: 'bottom-right',
        title: 'Erro na alteração de quantidade do produto',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        removeProduct,
        updateProductAmount,
        removeAllProductsInBag,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
