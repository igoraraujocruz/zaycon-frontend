import { useEffect } from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { api } from '../apiClient';

interface Product {
    id: string;
    name: string;
    description: string;
    amount: number;
    price: number;
    slug: string;
}

interface UpdateProductAmount {
    productId: string;
    amount: number;
}

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextData {
  cart: any;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  decreaseAmount: (product: any) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState({} as any)

    useEffect(() => {
        const cartLocal = window.localStorage.getItem('cart')

        if(cartLocal) {
            setCart(JSON.parse(cartLocal))
        }
    } ,[])

    const addToCart = product => {
        
        setCart(old => {
            let quantity = 0

            if(old[product.id]) {
                quantity = old[product.id].quantity
            }
            
            const newCart = {
                ...old,
                [product.id]: {
                    quantity: quantity + 1,
                    product,
                }
            }

            window.localStorage.setItem('cart', JSON.stringify(newCart))
            return newCart;
        })
    }

    const removeFromCart = (productId) => {
        setCart(old => {
            const newCart = {}
            Object.keys(old).forEach(id => {
                if (id !== productId) {
                    newCart[id] = old[id]
                }
            })
            window.localStorage.setItem('cart', JSON.stringify(newCart))
            return newCart
        })
    }

    const decreaseAmount = product => {
        const cartLocal = window.localStorage.getItem('cart')
        const cart = JSON.parse(cartLocal)


        if(cart[product.id].quantity <= 1) {
            removeFromCart(product.id)
            return;
          }

        if(cart[product.id].quantity < 1 ) {
            console.log(product.id)
            removeFromCart(product.id)
        }

        setCart(old => {
            const newCart = {
                ...old,
                [product.id]: {
                    quantity: cart[product.id].quantity - 1,
                    product,
                }
            }

            window.localStorage.setItem('cart', JSON.stringify(newCart))
            return newCart;
        })
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseAmount }}>
            {children}
        </CartContext.Provider>
    )
   
}

function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

export { CartProvider, useCart }