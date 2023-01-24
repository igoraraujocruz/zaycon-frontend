import { Flex, Grid, Stack, useMediaQuery } from '@chakra-ui/react';
import Head from 'next/head';
import nookies from 'nookies';
import { useContext } from 'react';
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
import { FinishShop } from '../../components/FinishShop';
import { Sellers } from '../../components/Sellers';

const PainelAdm = () => {
  const [isMinThan1440] = useMediaQuery('(max-width: 1440px)');
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
      <Flex flexDir="column" align="center" bg="gray.900" h="100%">
        <HeaderPainel />
        <Stack
          mt="1rem"
          borderRadius="2rem"
          bg="gray.800"
          flexDir={['column', 'column', 'row']}
          p="2rem"
        >
          <Products />

          {!isMinThan1440 && (
            <Flex flexDir={['column', 'column', 'row']}>
              <PossibleShop />
              <AllShop />
              <FinishShop />
              <SellerShop />
            </Flex>
          )}
        </Stack>

        {isMinThan1440 && (
          <Flex
            mt="2rem"
            bg="gray.800"
            p="2rem"
            flexDir={['column', 'column', 'row']}
          >
            <PossibleShop />
            <AllShop />
            <FinishShop />
            <SellerShop />
          </Flex>
        )}

        <Flex mt="2rem">
          <Sellers />
        </Flex>
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
    //
  }
});
