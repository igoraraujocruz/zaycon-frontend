import { Box, Button, Flex, Grid, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import nookies from 'nookies';
import { Howl, Howler } from 'howler';
import { useContext, useEffect, useRef } from 'react';
import CreateProducts from '../admin/products/create';
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import { Admin } from '../../components/Can';
import { HeaderPainel } from '../../components/HeaderPainel';
import { SellerShop } from '../../components/SellerShop';
import { AllShop } from '../../components/AllShop';
import { SocketContext } from '../../services/hooks/useSocket';
import { queryClient } from '../../services/queryClient';
import { PossibleShop } from '../../components/PossibleShop';
import { Products } from '../../components/Products';

interface Client {
  name: string;
}

interface Product {
  name: string;
}

interface Shop {
  id: string;
  quantity: number;
  createdAt: string;
  client: Client;
  product: Product;
  paid: boolean;
}

interface Seller {
  seller: {
    id: string;
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
    numberPhone: string;
    points: number;
    birthday: string;
    shop: Shop[];
  };
}

const PainelAdm = ({ seller }: Seller) => {
  const socket = useContext(SocketContext);

  socket.on('createShop', async () => {
    await queryClient.invalidateQueries('shop');
  });

  socket.on('receivePaimentAdmin', async () => {
    await queryClient.invalidateQueries('shop');
  });

  return (
    <Admin>
      <Head>
        <title>Painel Adm| Zaycon</title>
      </Head>
      <Flex h="100vh" flexDir="column" justify="flex-start" align="center">
        <HeaderPainel seller={seller} />
        <Grid
          mt="2rem"
          templateColumns={['1fr', '1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr']}
        >
          <PossibleShop />
          <AllShop />

          <SellerShop seller={seller} />
          <Products />
          <CreateProducts />
        </Grid>
      </Flex>
    </Admin>
  );
};

export default PainelAdm;

export const getServerSideProps = withSSRAuth(async ctx => {
  const cookies = nookies.get(ctx);

  try {
    const response = await api.get('/sellers/me', {
      headers: {
        Authorization: `Bearer ${cookies['snap.token']}`,
      },
    });

    const seller = response.data;

    if (seller.isAdmin === false) {
      return {
        redirect: {
          destination: '/painelSeller',
          permanent: false,
        },
      };
    }
    return {
      props: {
        seller,
      },
    };
  } catch (err) {
    // continue regardless of error
  }
});
