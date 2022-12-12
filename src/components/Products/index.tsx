import {
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';

import { withSSRAuth } from '../../utils/WithSSRAuth';

import EditProductModal, {
  ContractEditProductModal,
} from '../Modais/EditProductModal';
import { useProducts } from '../../services/hooks/useProducts';

interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  amount: number;
  points: number;
  createdAt: string;
  photos: [
    {
      id: string;
      name: string;
      url: string;
    },
  ];
}

export const Products = () => {
  const modaEditProduct = useRef<ContractEditProductModal>(null);

  const [product, setProduct] = useState({} as ProductProps);

  const { data } = useProducts();

  const handleModal = useCallback(shop => {
    setProduct(shop);
    modaEditProduct.current.onOpen();
  }, []);

  return (
    <Flex flexDir="column" align="center">
      <EditProductModal product={product} ref={modaEditProduct} />
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
              <Th>Pontos</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(product => (
              <Tr
                color={product.amount < 3 && 'red'}
                key={product.id}
                cursor="pointer"
                onClick={() => handleModal(product)}
              >
                <Td>{product.name}</Td>
                <Td>R$ {product.price}</Td>
                <Td>{product.amount}</Td>
                <Td>{product.points}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
