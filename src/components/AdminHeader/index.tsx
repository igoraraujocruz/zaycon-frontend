import { Button, Flex, HStack, Image, VStack } from '@chakra-ui/react';
import { Can } from '../Can';
import { signOut } from '../../services/hooks/useAuth';
import { NavLink } from '../ActiveLink';

export const AdminHeader = () => {
  return (
    <Flex
      flexDir="column"
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
      <Flex
        w="100%"
        mt={['0.5rem']}
        ml="-2rem"
        justify="flex-end"
        align="center"
      >
        <Button
          fontSize="0.8rem"
          onClick={() => signOut()}
          bg="gray.800"
          size={['xs', 'md']}
          _hover={{ bg: 'orangeHover' }}
        >
          Sair
        </Button>
      </Flex>
      <VStack mt="-1.5rem">
        <NavLink to="/">
          <Image w={['4rem', '7rem', '8rem']} src="../logo.svg" />
        </NavLink>
        <HStack
          mt={['0', '0', '1rem']}
          spacing={['0.5rem', '0.5rem', '2rem']}
          fontSize={['0.8rem', '0.8rem', '1rem']}
        >
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
      </VStack>
    </Flex>
  );
};
