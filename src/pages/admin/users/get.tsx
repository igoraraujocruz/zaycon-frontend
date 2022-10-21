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
import { User, useUsers } from '../../../services/hooks/useUsers';
import DetailsUserModal, {
  ModalDetailsUserProps,
} from '../../../components/Modais/DetailsUserModal';
import { SearchInput } from '../../../components/Form/SearchInput';
import { api } from '../../../services/apiClient';
import { Pagination } from '../../../components/Pagination';

interface SearchProps {
  search: string;
}

export default function GetUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading, error, isFetching } = useUsers(
    currentPage,
    itemsPerPage,
  );
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({} as User);
  const { register, handleSubmit } = useForm();
  const [itemFilters, setItemFilters] = useState<User[]>([]);

  const modalDelete = useRef<ModalDeleteHandle>(null);
  const modalDetailsUser = useRef<ModalDetailsUserProps>(null);

  const openDeleteModal = useCallback((userId: string) => {
    setUserId(userId);
    modalDelete.current.onOpen();
  }, []);

  const openDetailsModal = useCallback((user: User) => {
    setUser(user);
    modalDetailsUser.current.onOpen();
  }, []);

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/users?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex w="70vw" flexDir="column">
      <DeleteModal userId={userId} ref={modalDelete} />
      <DetailsUserModal
        name={user.name}
        userId={user.id}
        userPermissions={user.permissions}
        ref={modalDetailsUser}
      />
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
        totalCountOfRegisters={data?.quantityOfUsers}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <Flex h="1rem" justify="center" align="center">
        {!isLoading && isFetching && <Spinner size="md" color="gray.500" />}
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center">
          <Spinner size="md" color="gray.500" />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Falha ao obter dados dos usuários.</Text>
        </Flex>
      ) : (
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Username</Th>
              <Th>Celular</Th>
              <Th>Email</Th>
              <Th>Data do Cadastro</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {itemFilters.length
              ? itemFilters.map(user => (
                  <Tr key={user.id} cursor="pointer">
                    <Td onClick={() => openDetailsModal(user)}>{user.name}</Td>
                    <Td onClick={() => openDetailsModal(user)}>
                      {user.username}
                    </Td>
                    <Td onClick={() => openDetailsModal(user)}>
                      {user.mobilePhone}
                    </Td>
                    <Td onClick={() => openDetailsModal(user)}>{user.email}</Td>
                    <Td onClick={() => openDetailsModal(user)}>
                      {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Td>
                    <Td
                      color="gray.600"
                      _hover={{ color: '#FF6B00' }}
                      transition="color 200ms"
                    >
                      <BsTrashFill
                        size={25}
                        onClick={() => openDeleteModal(user.id)}
                        cursor="pointer"
                      />
                    </Td>
                  </Tr>
                ))
              : data.users.map(user => (
                  <Tr key={user.id} cursor="pointer">
                    <Td onClick={() => openDetailsModal(user)}>{user.name}</Td>
                    <Td onClick={() => openDetailsModal(user)}>
                      {user.username}
                    </Td>
                    <Td onClick={() => openDetailsModal(user)}>
                      {user.mobilePhone}
                    </Td>
                    <Td onClick={() => openDetailsModal(user)}>{user.email}</Td>
                    <Td onClick={() => openDetailsModal(user)}>
                      {user.createdAt}
                    </Td>
                    <Td
                      color="gray.600"
                      _hover={{ color: '#FF6B00' }}
                      transition="color 200ms"
                    >
                      <BsTrashFill
                        size={25}
                        onClick={() => openDeleteModal(user.id)}
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
