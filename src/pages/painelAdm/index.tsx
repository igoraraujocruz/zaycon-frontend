import { Flex, Grid, Stack } from '@chakra-ui/react';
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

const PainelAdm = () => {
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
      <Flex flexDir="column" align="center" bg="gray.900" h="100vw">
        <HeaderPainel />
        <Stack
          mt="1rem"
          borderRadius="2rem"
          bg="gray.800"
          flexDir={['column', 'column', 'row']}
          p="2rem"
        >
          <Products />
          <Flex flexDir={['column', 'column', 'row']} w="100%">
            <PossibleShop />
            <AllShop />
            <FinishShop />
            <SellerShop />
          </Flex>
        </Stack>
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
