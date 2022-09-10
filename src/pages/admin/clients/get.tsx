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
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteModal } from '../../../components/Modais/DeleteModal';
import { DetailsClientModal } from '../../../components/Modais/DetailsClientModal';
import { useClients } from '../../../services/hooks/useClients';

export function GetClients() {
  const { data, isLoading, error, isFetching } = useClients();
  const { onOpen } = useDisclosure();

  return (
    <Flex w="70vw" flexDir="column">
      <Heading alignSelf="center" size="lg" fontWeight="normal">
        Clientes Cadastrados
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
          <Text>Falha ao obter dados dos clientes.</Text>
        </Flex>
      ) : (
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Celular</Th>
              <Th>Data de Nascimento</Th>
              <Th>Data do cadastro</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(client => (
              <Tr key={client.id}>
                <button type="button" onClick={onOpen}>
                  Tste
                </button>
                <Td>{client.name}</Td>
                <Td>{client.email}</Td>
                <Td>{client.mobilePhone}</Td>
                <Td>{client.birthday}</Td>
                <Td>{client.createdAt}</Td>
                <DetailsClientModal client={client} />
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
