import {
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Box,
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
  destaque: boolean;
  category: string;
  photos: [
    {
      id: string;
      name: string;
      url: string;
    },
  ];
}

export const Products = () => {
  const [filterProductName, setFilterProductName] = useState('');
  const modalEditProduct = useRef<ContractEditProductModal>(null);

  const modalCreateProduct = useRef<ContractCreateProductModal>(null);

  const [product, setProduct] = useState({} as ProductProps);

  const { data } = useProducts();

  const handleModal = useCallback(shop => {
    setProduct(shop);
    modalEditProduct.current.onOpen();
  }, []);

  return (
    <Flex
      flexDir="column"
      align="center"
      mt={['1rem']}
      ml="2rem"
      mr="2rem"
      bg="gray.900"
      color="#fff"
      borderRadius="2rem"
      p="2rem"
      h="37rem"
    >
      <EditProductModal product={product} ref={modalEditProduct} />
      <CreateProductModal ref={modalCreateProduct} />
      <Flex align="center">
        <Flex
          bg="gray.800"
          borderRadius={50}
          mr="0.5rem"
          transition="background 200ms"
          _hover={{
            bg: 'orangeHover',
          }}
        >
          <AiOutlinePlus
            size={32}
            cursor="pointer"
            onClick={() => modalCreateProduct.current.onOpen()}
          />
        </Flex>

        <Heading size="md" mt="0.4rem" mr="1rem">
          Produtos
        </Heading>
        <Input
          bg="gray.700"
          border="none"
          color="#fff"
          name="productFilterName"
          onChange={e => setFilterProductName(e.target.value)}
        />
      </Flex>
      <Flex
        align="flex-end"
        maxH={['30rem', '30rem', '40rem']}
        flexDir="column"
        w={['25rem']}
        overflow="scroll"
        sx={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th pl="4px" pr="4px">
                Nome do Produto
              </Th>
              <Th pl="4px" pr="4px">
                Preço
              </Th>
              <Th pl="4px" pr="4px">
                Estoque
              </Th>
              <Th pl="4px" pr="4px">
                Pontos
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data
                .filter(element => {
                  if (filterProductName === '') {
                    return element;
                  }
                  if (
                    element.name
                      .toLowerCase()
                      .includes(filterProductName.toLowerCase())
                  ) {
                    return element;
                  }
                })
                .map(product => (
                  <Tr
                    color={product.amount < 3 && 'red'}
                    key={product.id}
                    cursor="pointer"
                    onClick={() => handleModal(product)}
                  >
                    <Td pl="4px" pr="4px">
                      {product.name}
                    </Td>
                    <Td pl="4px" pr="4px">
                      R$ {product.price}
                    </Td>
                    <Td pl="4px" pr="4px">
                      {product.amount}
                    </Td>
                    <Td pl="4px" pr="4px">
                      {product.points}
                    </Td>
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
