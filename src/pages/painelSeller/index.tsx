import {
  Button,
  Flex,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import nookies from 'nookies';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import { signOut } from '../../services/hooks/useAuth';
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
}

interface Seller {
  id: string;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  numberPhone: string;
  points: number;
  birthday: string;
  shop: Shop[];
}

const PainelSeller = () => {
  const [myInfo, setMyInfo] = useState({} as Seller);
  useEffect(() => {
    api.get('/sellers/me').then(response => setMyInfo(response.data));
  }, []);

  return (
    <>
      <Head>
        <title>Painel | Zaycon</title>
      </Head>
      <Flex h="100vh" flexDir="column" justify="flex-start" align="center">
        <VStack align="end" w="100vw" mr="5rem">
          <HStack w="100vw" mt="2rem" justify="end">
            <Heading size="lg">Zaycon</Heading>
            <Button
              fontSize="0.8rem"
              onClick={() => signOut()}
              bg="gray.800"
              size={['xs', 'md']}
              _hover={{ bg: 'orangeHover' }}
            >
              Sair
            </Button>
          </HStack>
          <VStack>
            <Text>Olá, {myInfo.name}</Text>
          </VStack>
        </VStack>

        <Flex flexDir="column" mt="2rem" align="center">
          <Flex
            flexDir={['column', 'column', 'row']}
            align="center"
            justify="center"
            w="100%"
            m={0}
          >
            <Flex p="2rem" flexDir="column" justify="center">
              <Heading size="md">Meus pontos</Heading>
              <Text>{myInfo.points}</Text>
            </Flex>
            <Flex p="2rem" flexDir="column" align="center" justify="center">
              <Heading size="md">Minhas Vendas</Heading>
              <VStack>
                {myInfo.shop?.map(shop => (
                  <List key={shop.id} spacing={3}>
                    <ListItem>
                      {new Date(shop.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}{' '}
                      {shop.client.name} comprou {shop.quantity}x{' '}
                      {shop.product.name}
                    </ListItem>
                  </List>
                ))}
              </VStack>
            </Flex>
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
  } catch (err) {
    // no error
  }

  return {
    props: {},
  };
});
