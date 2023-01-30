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
  Image,
  Button,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { withSSRAuth } from '../../utils/WithSSRAuth';

import { useProducts } from '../../services/hooks/useProducts';
import ModalExchangeFor, {
  ModalExchangeForHandle,
} from '../Modais/ExchangeFor';

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

export const ProductsForSellers = () => {
  const [filterProductName, setFilterProductName] = useState('');
  const [productId, setProductId] = useState('');
  const { data } = useProducts();

  const modalExchangeForRef = useRef<ModalExchangeForHandle>(null);

  const handleExchangeModal = (productId: string) => {
    setProductId(productId);
    modalExchangeForRef.current.onOpen();
  };
  return (
    <Flex
      flexDir="column"
      align="center"
      mt={['1rem']}
      ml="2rem"
      mr="2rem"
      bg="gray.800"
      color="#fff"
      borderRadius="2rem"
      p="2rem"
      h="37rem"
    >
      <ModalExchangeFor ref={modalExchangeForRef} productId={productId} />
      <Flex align="center">
        <Heading size="md" mt="0.4rem" mr="1rem">
          Produtos
        </Heading>
        <Input
          bg="gray.700"
          placeholder="Pesquisar produto"
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
              <Th pl="4px" pr="4px" />
              <Th pl="4px" pr="4px">
                Nome do Produto
              </Th>
              <Th pl="4px" pr="4px">
                Pontos
              </Th>
              <Th pl="4px" pr="4px" />
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
                  <Tr key={product.id}>
                    <Image
                      src={product.photos[0].url}
                      maxW="10rem"
                      minW="10rem"
                    />
                    <Td pl="4px" pr="4px">
                      {product.name}
                    </Td>
                    <Td pl="4px" pr="4px">
                      {product.points}
                    </Td>
                    <Td
                      cursor="pointer"
                      bg="gray.700"
                      _hover={{
                        bg: 'gray.800',
                      }}
                      onClick={() => handleExchangeModal(product.id)}
                    >
                      Trocar por Pontos
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
