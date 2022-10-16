import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from 'react-query';
import { theme } from '../styles/theme';
import { queryClient } from '../services/queryClient';
import { AuthProvider } from '../services/hooks/useAuth';

/* import { makeServer } from '../services/mirage';

if (process.env.NODE_ENV === 'development') {
  makeServer();
}
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
