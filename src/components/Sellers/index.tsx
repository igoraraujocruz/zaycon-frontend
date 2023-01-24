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
import { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

interface Seller {
  id: string;
  name: string;
  points: number;
  email: string;
  numberPhone: string;
  birthday: string;
  createdAt: string;
}

export const Sellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    const getSellers = async () => {
      const response = await api.get('/sellers');

      setSellers(response.data);
    };

    getSellers();
  }, []);
  return (
    <Flex
      flexDir="column"
      color="#fff"
      p="2rem"
      bg="gray.800"
      align="flex-center"
      h="30rem"
      mb="2rem"
    >
      <Flex justify="space-between">
        <Heading>Vendedores</Heading>
        <HStack>
          <Text>Total:</Text>
          <Text>{sellers.length}</Text>
        </HStack>
      </Flex>

      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Pontos</Th>
            <Th>Email</Th>
            <Th>Celular</Th>
            <Th>Aniversário</Th>
            <Th>Data de Registro</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sellers.map(seller => (
            <Tr key={seller.id} cursor="pointer">
              <Td>{seller.name}</Td>
              <Td>{seller.points}</Td>
              <Td>{seller.email}</Td>
              <Td>{seller.numberPhone}</Td>
              <Td>
                {new Date(seller.birthday).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Td>
              <Td>
                {new Date(seller.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};
