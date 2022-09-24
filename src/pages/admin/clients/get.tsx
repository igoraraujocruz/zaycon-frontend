import {
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import DeleteModal, { ModalDeleteHandle } from '../../../components/Modais/DeleteModal';
import { Client, useClients } from '../../../services/hooks/useClients';
import { BsTrashFill } from 'react-icons/bs';
import DetailsClientModal, { ModalDetailsClient } from '../../../components/Modais/DetailsClientModal';

export function GetClients() {
  const { data, isLoading, error, isFetching } = useClients();
  const [clientId, setClientId] = useState('')
  const [client, setClient] = useState({} as Client)

  const modalDelete = useRef<ModalDeleteHandle>(null);
  const modalDetailsClientModal = useRef<ModalDetailsClient>(null);

  const openDeleteModal = useCallback((clientId: string) => {
    setClientId(clientId)
    modalDelete.current.onOpen()
  }, [])

  const openDetailsClientModal = useCallback((client: Client) => {
    setClient(client)
    modalDetailsClientModal.current.onOpen()
  }, [])

  return (
    <Flex w="70vw" flexDir="column">
      <DeleteModal clientId={clientId} ref={modalDelete} />
      <DetailsClientModal client={client} ref={modalDetailsClientModal} />
      <Heading alignSelf="center" size="lg" fontWeight="normal">
        Clientes Cadastrados
      </Heading>
      <Flex h={'2rem'}>  
      {!isLoading && isFetching && (
          <Spinner size="sm" color="gray.500" ml="4" />
      )}
      </Flex>

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
              <Tr key={client.id} cursor={'pointer'}>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.name}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.email}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.mobilePhone}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.birthday}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.createdAt}</Td>
                <Td>
                  <BsTrashFill color="orange" size={25} onClick={() => openDeleteModal(client.id)} cursor="pointer" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
