import {
  Button,
  Flex,
  Heading,
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
import DeleteModal, { ModalDeleteHandle } from '../../../components/Modais/DeleteModal';
import { Client, useClients } from '../../../services/hooks/useClients';
import { BsTrashFill } from 'react-icons/bs';
import DetailsClientModal, { ModalDetailsClient } from '../../../components/Modais/DetailsClientModal';
import { SearchInput } from '../../../components/Form/SearchInput';
import { useForm } from 'react-hook-form';
import { api } from '../../../services/apiClient';

interface SearchProps {
  search: string;
}

export function GetClients() {
  const { data, isLoading, error, isFetching } = useClients();
  const [clientId, setClientId] = useState('')
  const [client, setClient] = useState({} as Client)
  const { register, handleSubmit } = useForm()
  const [itemFilters, setItemFilters] = useState<Client[]>([])

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

  const onSubmit = async ({search}: SearchProps) => {
    try {
      await api.get(`/clients/search/${search}`)
      .then(response => setItemFilters(response.data))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Flex w={'70vw'} flexDir="column">
      <DeleteModal clientId={clientId} ref={modalDelete} />
      <DetailsClientModal client={client} ref={modalDetailsClientModal} />
      <Heading alignSelf="flex-start" borderBottom={'0.5rem solid #FF6B00'} size="lg" fontWeight="normal">
        Clientes
      </Heading>
      <HStack as={'form'} onSubmit={handleSubmit(onSubmit)} justify={'flex-end'}>
        <SearchInput w={'18rem'} borderColor='gray.600' name='search' {...register('search', {
          onChange() {
            setItemFilters([])
          },
        })} />
        <Button bg={'orange'} _hover={{ bg: 'orangeHover' }} type={'submit'}>Procurar</Button>
      </HStack>
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
              <Th>Pontos</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {itemFilters.length ? itemFilters.map(client => 
              <Tr key={client.id} cursor={'pointer'}>
              <Td  onClick={() => openDetailsClientModal(client)}>{client.name}</Td>
              <Td  onClick={() => openDetailsClientModal(client)}>{client.email}</Td>
              <Td  onClick={() => openDetailsClientModal(client)}>{client.mobilePhone}</Td>
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
              <Td>
                {client.points}
              </Td>
              <Td color={'gray.600'} _hover={{ color: '#FF6B00'}} transition="color 200ms">
                  <BsTrashFill size={25} onClick={() => openDeleteModal(client.id)} cursor="pointer" />
              </Td>
            </Tr>
            ) :
            data.map(client => (
              <Tr key={client.id} cursor={'pointer'}>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.name}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.email}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.mobilePhone}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.birthday}</Td>
                <Td  onClick={() => openDetailsClientModal(client)}>{client.createdAt}</Td>
                <Td>
                  {client.points}
                </Td>
                <Td color={'gray.600'} _hover={{ color: '#FF6B00'}} transition="color 200ms">
                  <BsTrashFill size={25} onClick={() => openDeleteModal(client.id)} cursor="pointer" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
