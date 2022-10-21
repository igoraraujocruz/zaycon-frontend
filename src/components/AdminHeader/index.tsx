import { Button, Flex, HStack, Image } from '@chakra-ui/react';
import { Can } from '../Can';
import { signOut } from '../../services/hooks/useAuth';
import { NavLink } from '../ActiveLink';

export const AdminHeader = () => {
  return (
    <Flex
      w="100vw"
      as="header"
      borderRadius="0 0 3rem 3rem"
      align="center"
      style={{
        boxShadow: '0 0 0 0.5rem #FF6B00',
      }}
      h={['50px', '100px']}
      bg="gray.700"
    >
      <Flex w="100%" justify="center">
        <NavLink to="/">
          <Image w="10rem" src="../logo.svg" />
        </NavLink>
      </Flex>
      <Flex>
        <HStack mt="1rem" spacing="2rem">
          <Can
            permissions={[
              'Cadastrar Produto',
              'Editar Produto',
              'Listar Produto',
              'Deletar Produto',
            ]}
          >
            <NavLink to="/admin/products">Produtos</NavLink>
          </Can>
          <Can
            permissions={[
              'Cadastrar Cliente',
              'Editar Cliente',
              'Listar Cliente',
              'Deletar Cliente',
            ]}
          >
            <NavLink to="/admin/clients">Clientes</NavLink>
          </Can>
          <Can
            permissions={[
              'Criar Usuário',
              'Editar Usuario',
              'Listar Usuario',
              'Deletar Usuario',
            ]}
          >
            <NavLink to="/admin/users">Usuários</NavLink>
          </Can>
        </HStack>
      </Flex>
      <Flex w="100%" justify="end">
        <Button
          onClick={() => signOut()}
          p="1.5rem"
          mr="2rem"
          bg="gray.800"
          _hover={{ bg: 'orangeHover' }}
        >
          Sair
        </Button>
      </Flex>
    </Flex>
  );
};
