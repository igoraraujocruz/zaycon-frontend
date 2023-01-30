import { Button, Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import nookies from 'nookies';
import { useRef } from 'react';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import { HeaderPainel } from '../../components/HeaderPainel';
import { SellerShop } from '../../components/SellerShop';
import { api } from '../../services/apiClient';
import { ProductsForSellers } from '../../components/ProductsForSellers';
import ModalExchangeFor, {
  ModalExchangeForHandle,
} from '../../components/Modais/ExchangeFor';

const PainelSeller = () => {
  const modalExchangeForRef = useRef<ModalExchangeForHandle>(null);

  return (
    <Flex>
      <ModalExchangeFor ref={modalExchangeForRef} />
      <Head>
        <title>Painel | Zaycon</title>
      </Head>
      <Flex
        flexDir="column"
        bg="gray.900"
        w="100%"
        h={['100%', '100%', '100vh']}
      >
        <HeaderPainel />
        <Flex justify="center" align="center" mt={['1rem', '1rem', '1rem', 0]}>
          <Button
            w="12rem"
            onClick={() => modalExchangeForRef.current.onOpen()}
          >
            Trocar pontos por dinheiro
          </Button>
        </Flex>

        <Stack
          flexDir={['column', 'column', 'row']}
          spacing="0"
          mt="2rem"
          w="100%"
          justify="center"
          align="center"
        >
          <Flex
            flexDir={['column', 'column', 'row']}
            bg="gray.800"
            mr={[0, 0, '2rem']}
          >
            <SellerShop />
          </Flex>

          <ProductsForSellers />
        </Stack>
      </Flex>
    </Flex>
  );
};

export default PainelSeller;

export const getServerSideProps = withSSRAuth(async ctx => {
  const cookies = nookies.get(ctx);

  try {
    const response = await api.get('/sellers/me', {
      headers: {
        Authorization: `Bearer ${cookies['snap.token']}`,
      },
    });

    const seller = response.data;

    if (seller.isAdmin === true) {
      return {
        redirect: {
          destination: '/painelAdm',
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
