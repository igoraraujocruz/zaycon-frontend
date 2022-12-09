import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import nookies from 'nookies';
import CreateProducts from '../admin/products/create';
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import { Admin } from '../../components/Can';
import { HeaderPainel } from '../../components/HeaderPainel';
import { SellerShop } from '../../components/SellerShop';
import { AllShop } from '../../components/AllShop';

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
  return (
    <Admin>
      <Head>
        <title>Painel Adm| Zaycon</title>
      </Head>
      <Flex h="100vh" flexDir="column" justify="flex-start" align="center">
        <HeaderPainel seller={seller} />
        <Flex flexDir="column" mt="2rem" align="center">
          <Flex
            flexDir={['column', 'column', 'row']}
            align="center"
            w="100vw"
            justify="space-around"
          >
            <AllShop seller={seller} />
            <SellerShop seller={seller} />
            <CreateProducts />
          </Flex>
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
    // continue regardless of error
  }
});
