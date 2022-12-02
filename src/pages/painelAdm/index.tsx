import { Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import nookies from 'nookies';
import axios from 'axios';
import { signOut } from '../../services/hooks/useAuth';
import { Can } from '../../components/Can';
import CreateProducts from '../admin/products/create';

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
    <Can>
      <Head>
        <title>Painel Adm| Zaycon</title>
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
            <Text>Olá, {seller.name}</Text>
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
            <VStack p="2rem">
              <Flex
                bg="gray.800"
                flexDir="column"
                w="20rem"
                borderRadius="2rem"
                p="2rem"
              >
                <Heading size="md">Meus pontos</Heading>
                <Text>{seller.points}</Text>
              </Flex>
              <Flex
                bg="gray.800"
                h="38.5rem"
                flexDir="column"
                w="20rem"
                borderRadius="2rem"
                p="2rem"
              >
                <Heading size="md">Minhas Vendas</Heading>
                <VStack>
                  {seller.shop?.map(shop => (
                    <Flex id={shop.id}>
                      <Text>
                        {new Date(shop.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                        })}{' '}
                        {shop.client.name} comprou {shop.quantity}x{' '}
                        {shop.product.name}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Flex>
            </VStack>
            <CreateProducts />
          </Flex>
        </Flex>
      </Flex>
    </Can>
  );
};

export default PainelAdm;

export const getServerSideProps = async ctx => {
  const cookies = nookies.get(ctx);

  const response = await axios.get('http://localhost:3333/sellers/me', {
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
    props: { seller },
  };
};
