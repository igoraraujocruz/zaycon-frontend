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
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import { useForm } from 'react-hook-form';
import { withSSRAuth } from '../../utils/WithSSRAuth';

import EditProductModal, {
  ContractEditProductModal,
} from '../Modais/EditProductModal';

import CreateProductModal, {
  ContractCreateProductModal,
} from '../Modais/CreateProductModal';

import { useProducts } from '../../services/hooks/useProducts';
import { Input } from '../Form/Input';

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

  console.log(filterProductName);

  return (
    <Flex flexDir="column" align="center" mt={['1rem']} ml="2rem" mr="2rem">
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
          name="productFilterName"
          onChange={e => setFilterProductName(e.target.value)}
        />
      </Flex>
      <Flex
        align="flex-end"
        maxH={['30rem', '30rem', '40rem']}
        flexDir="column"
        w={['18rem', '18rem', '25rem']}
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
              <Th>Nome do Produto</Th>
              <Th>Preço</Th>
              <Th>Estoque</Th>
              <Th>Pontos</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data
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
