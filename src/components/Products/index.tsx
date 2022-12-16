import {
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import { withSSRAuth } from '../../utils/WithSSRAuth';

import EditProductModal, {
  ContractEditProductModal,
} from '../Modais/EditProductModal';

import CreateProductModal, {
  ContractCreateProductModal,
} from '../Modais/CreateProductModal';

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
  const modalEditProduct = useRef<ContractEditProductModal>(null);

  const modalCreateProduct = useRef<ContractCreateProductModal>(null);

  const [product, setProduct] = useState({} as ProductProps);

  const { data } = useProducts();

  const handleModal = useCallback(shop => {
    setProduct(shop);
    modalEditProduct.current.onOpen();
  }, []);

  return (
    <Flex flexDir="column" align="center" mt={['1rem']} ml="2rem" mr="2rem">
      <EditProductModal product={product} ref={modalEditProduct} />
      <CreateProductModal ref={modalCreateProduct} />
      <Heading size="md">Produtos</Heading>
      <Flex
        align="flex-end"
        h={['15rem', '15rem', '20rem']}
        flexDir="column"
        w={['18rem', '18rem', '25rem']}
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
        <AiOutlinePlus
          size={32}
          cursor="pointer"
          onClick={() => modalCreateProduct.current.onOpen()}
        />
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
