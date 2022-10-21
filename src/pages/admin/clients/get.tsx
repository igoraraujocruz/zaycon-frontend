import {
  Button,
  Flex,
  HStack,
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
import { BsTrashFill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import DeleteModal, {
  ModalDeleteHandle,
} from '../../../components/Modais/DeleteModal';
import { Client, useClients } from '../../../services/hooks/useClients';
import DetailsClientModal, {
  ModalDetailsClient,
} from '../../../components/Modais/DetailsClientModal';
import { SearchInput } from '../../../components/Form/SearchInput';
import { api } from '../../../services/apiClient';
import { Pagination } from '../../../components/Pagination';

interface SearchProps {
  search: string;
}

export default function GetClients() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading, error, isFetching } = useClients(
    currentPage,
    itemsPerPage,
  );
  const [clientId, setClientId] = useState('');
  const [client, setClient] = useState({} as Client);
  const { register, handleSubmit } = useForm();
  const [itemFilters, setItemFilters] = useState<Client[]>([]);

  const modalDelete = useRef<ModalDeleteHandle>(null);
  const modalDetailsClientModal = useRef<ModalDetailsClient>(null);

  const openDeleteModal = useCallback((clientId: string) => {
    setClientId(clientId);
    modalDelete.current.onOpen();
  }, []);

  const openDetailsClientModal = useCallback((client: Client) => {
    setClient(client);
    modalDetailsClientModal.current.onOpen();
  }, []);

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/clients?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex w="70vw" flexDir="column">
      <DeleteModal clientId={clientId} ref={modalDelete} />
      <DetailsClientModal client={client} ref={modalDetailsClientModal} />
      <HStack
        mt="2rem"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        justify="flex-end"
      >
        <SearchInput
          w="18rem"
          borderColor="gray.600"
          name="search"
          {...register('search', {
            onChange() {
              setItemFilters([]);
            },
          })}
        />
        <Button bg="orange" _hover={{ bg: 'orangeHover' }} type="submit">
          Procurar
        </Button>
      </HStack>
      <Pagination
        registersPerPage={itemsPerPage}
        totalCountOfRegisters={data?.quantityOfClients}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <Flex h="1rem" justify="center" align="center">
        {!isLoading && isFetching && <Spinner size="md" color="gray.500" />}
      </Flex>

      {isLoading ? (
        <Flex h="1rem" justify="center" align="center">
          <Spinner size="md" color="gray.500" />
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
              <Th>Pontos</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {itemFilters.length
              ? itemFilters.map(client => (
                  <Tr key={client.id} cursor="pointer">
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.name}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.email}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.mobilePhone}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {new Date(client.birthday).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {new Date(client.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Td>
                    <Td>{client.points}</Td>
                    <Td
                      color="gray.600"
                      _hover={{ color: '#FF6B00' }}
                      transition="color 200ms"
                    >
                      <BsTrashFill
                        size={25}
                        onClick={() => openDeleteModal(client.id)}
                        cursor="pointer"
                      />
                    </Td>
                  </Tr>
                ))
              : data.clients.map(client => (
                  <Tr key={client.id} cursor="pointer">
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.name}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.email}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.mobilePhone}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.birthday}
                    </Td>
                    <Td onClick={() => openDetailsClientModal(client)}>
                      {client.createdAt}
                    </Td>
                    <Td>{client.points}</Td>
                    <Td
                      color="gray.600"
                      _hover={{ color: '#FF6B00' }}
                      transition="color 200ms"
                    >
                      <BsTrashFill
                        size={25}
                        onClick={() => openDeleteModal(client.id)}
                        cursor="pointer"
                      />
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
