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
import { useRef, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { VscError } from 'react-icons/vsc';
import { Seller, useSellers } from '../../services/hooks/useSellers';
import AnswerSeller, { ModalExchangeForHandle } from '../Modais/AnswerSeller';

export const Sellers = () => {
  const { data } = useSellers();
  const [sellerId, setSellerId] = useState('');

  const answerSeller = useRef<ModalExchangeForHandle>(null);

  const handleAnswerSeller = (sellerId: string) => {
    setSellerId(sellerId);
    answerSeller.current.onOpen();
  };
  return (
    <VStack mb="2rem">
      <AnswerSeller ref={answerSeller} sellerId={sellerId} />
      <Flex justify="space-between" color="#fff" w="100%">
        <Heading>Vendedores</Heading>
        <HStack>
          <Text>Total:</Text>
          <Text>{data?.length}</Text>
        </HStack>
      </Flex>
      <Flex
        flexDir="column"
        color="#fff"
        p="2rem"
        bg="gray.800"
        align="flex-center"
        h="30rem"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#E5E5E5',
            borderRadius: '24px',
          },
        }}
        overflowY="auto"
        mb="2rem"
      >
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Pontos</Th>
              <Th>Email</Th>
              <Th>Celular</Th>
              <Th>Aniversário</Th>
              <Th>Data de Registro</Th>
              <Th>Email Confirmado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(seller => (
              <Tr
                key={seller.id}
                cursor="pointer"
                color={
                  seller.sellerOrders.some(order => order.answered === false) &&
                  'red'
                }
                onClick={() => handleAnswerSeller(seller.id)}
              >
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
                <Td>
                  {seller.emailConfirm ? (
                    <AiOutlineCheck size={20} color="green" />
                  ) : (
                    <VscError size={20} color="red" />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </VStack>
  );
};
