import {
  Flex,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { BsBoxSeam } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiCheck } from 'react-icons/fi';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import DetailsAllShop, {
  DetailsAllShopModalHandle,
} from '../Modais/DetailsAllShop';
import { useShop } from '../../services/hooks/useShop';
import { useProducts } from '../../services/hooks/useProducts';

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
  status: string;
}

export const Products = () => {
  const modalDetailsAllShop = useRef<DetailsAllShopModalHandle>(null);
  const [shop, setShop] = useState({} as Shop);

  const { data } = useProducts();

  const handleModal = useCallback(shop => {
    setShop(shop);
    modalDetailsAllShop.current.onOpen();
  }, []);

  return (
    <Flex flexDir="column" align="center">
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />
      <Heading size="md">Produtos</Heading>
      <Flex
        bg="gray.800"
        h="38.5rem"
        flexDir="column"
        w={['25rem', '25rem', '30rem']}
        borderRadius="2rem"
        p="2rem"
        m="1rem"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF6B00',
            borderRadius: '24px',
          },
        }}
      >
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Nome do Produto</Th>
              <Th>Preço</Th>
              <Th>Estoque</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(product => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>R$ {product.price}</Td>
                <Td>{product.amount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* <VStack align="flex-start">
          {data?.map(product => (
            <Flex key={product.id}>
              <HStack
                color="#A9A9A9"
                cursor="pointer"
                onClick={() => handleModal(product)}
              >
                <Text>{product.name}</Text>
                <Text>R$ {product.price}</Text>
                <Text>{product.amount}</Text>
              </HStack>
            </Flex>
          ))}
        </VStack> */}
      </Flex>
    </Flex>
  );
};

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
