import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { theme } from '../styles/theme';
import { queryClient } from '../services/queryClient';
import { AuthProvider } from '../services/hooks/useAuth';
import { CartProvider } from '../services/hooks/useCart';
import { SocketProvider } from '../services/hooks/useSocket';
import { FinishShopProvider } from '../services/hooks/useFinishShop';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <FinishShopProvider>
          <CartProvider>
            <ChakraProvider theme={theme}>
              <AuthProvider>
                <Component {...pageProps} />
              </AuthProvider>
              <ReactQueryDevtools />
            </ChakraProvider>
          </CartProvider>
        </FinishShopProvider>
      </QueryClientProvider>
    </SocketProvider>
  );
}

export default MyApp;
