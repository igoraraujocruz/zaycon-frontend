import {
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { DeleteModal } from '../../../components/Modais/DeleteModal';
import { ImagesModal } from '../../../components/Modais/ImagesModal';
import { useProducts } from '../../../services/hooks/useProducts';

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    creditPoints: number;
    debitPoints: number;
    photos: [
      {
        id: string;
        name: string;
        url: string;
      },
    ];
  };
}

export default function Get() {
  const { data, isLoading, error, isFetching } = useProducts();

  return (
    <Flex w="70vw" flexDir="column">
      <Heading alignSelf="center" size="lg" fontWeight="normal">
        Produtos Cadastrados
        {!isLoading && isFetching && (
          <Spinner size="sm" color="gray.500" ml="4" />
        )}
      </Heading>

      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Falha ao obter dados dos produtos.</Text>
        </Flex>
      ) : (
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Nome do Produto</Th>
              <Th>Descrição</Th>
              <Th>Preço</Th>
              <Th>Pontos Débito</Th>
              <Th>Pontos Crédito</Th>
              <Th>Slug</Th>
              <Th>Cadastrado por:</Th>
              <Th>Data do cadastro</Th>
              <Th>Capa</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {data.map(product => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.description}</Td>
                <Td>R$ {product.price}</Td>
                <Td color="#c30000">- {product.debitPoints}</Td>
                <Td color="#0064cf">+ {product.creditPoints}</Td>
                <Td>{product.slug}</Td>
                <Td>{product.user.name}</Td>
                <Td>{product.createdAt}</Td>
                <Td>
                  <Flex flexDir="column" align="center">
                    {!product.photos[0] ? (
                      <Box>
                        <Image maxW="6rem" src="../imageNotFound.svg" />
                      </Box>
                    ) : (
                      <Zoom overlayBgColorEnd="gray.900">
                        <Image
                          maxW="6rem"
                          cursor="pointer"
                          src={product.photos[0].url}
                        />
                      </Zoom>
                    )}

                    <ImagesModal product={product} />
                  </Flex>
                </Td>

                <Td>
                  <DeleteModal productId={product.id} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
