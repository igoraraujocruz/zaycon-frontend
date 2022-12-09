import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import nookies from 'nookies';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import { HeaderPainel } from '../../components/HeaderPainel';
import { SellerShop } from '../../components/SellerShop';
import { api } from '../../services/apiClient';

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

const PainelSeller = ({ seller }: Seller) => {
  return (
    <>
      <Head>
        <title>Painel | Zaycon</title>
      </Head>
      <Flex h="100vh" flexDir="column" justify="flex-start" align="center">
        <HeaderPainel seller={seller} />
        <Flex flexDir="column" mt="2rem" align="center">
          <Flex
            flexDir={['column', 'column', 'row']}
            align="center"
            justify="center"
            w="100%"
            m={0}
          >
            <SellerShop seller={seller} />
          </Flex>
        </Flex>
      </Flex>
    </>
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
