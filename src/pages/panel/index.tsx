import { Button, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { NavLink } from '../../components/ActiveLink';
import { Can } from '../../components/Can';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import { signOut } from '../../services/hooks/useAuth';

const Panel = () => {
  return (
    <>
      <Head>
        <title>Painel de Acesso | Snap</title>
      </Head>
      <Flex h="100vh" flexDir="column" justify="flex-start" align="center">
        <HStack mt="2rem">
          <Image w="13rem" src="../logo.svg" />
          <Button
            fontSize="0.8rem"
            onClick={() => signOut()}
            bg="gray.800"
            size={['xs', 'md']}
            _hover={{ bg: 'orangeHover' }}
          >
            Sair
          </Button>
        </HStack>

        <Flex flexDir="column" mt="2rem" align="center">
          <Heading>Painel de Acesso</Heading>
          <Flex
            flexDir={['column', 'column', 'row']}
            align="center"
            justify="center"
            w="100%"
            m={0}
          >
            <Can
              permissions={[
                'Cadastrar Produto',
                'Editar Produto',
                'Listar Produto',
                'Deletar Produto',
              ]}
            >
              <NavLink to="/admin/products">
                <Flex
                  m="2rem"
                  border="0.3rem solid black"
                  w="15rem"
                  h="15rem"
                  borderRadius="2rem"
                  justify="center"
                  align="center"
                  _hover={{ color: '#FF6B00', borderColor: 'orange' }}
                  transition={['color 200ms', 'border 500ms']}
                >
                  <Text>Produtos</Text>
                </Flex>
              </NavLink>
            </Can>

            <Can
              permissions={[
                'Cadastrar Cliente',
                'Editar Cliente',
                'Listar Cliente',
                'Deletar Cliente',
              ]}
            >
              <NavLink to="/admin/clients">
                <Flex
                  m="2rem"
                  border="0.3rem solid black"
                  w="15rem"
                  h="15rem"
                  borderRadius="2rem"
                  justify="center"
                  align="center"
                  _hover={{ color: '#FF6B00', borderColor: 'orange' }}
                  transition={['color 200ms', 'border 500ms']}
                >
                  <Text>Clientes</Text>
                </Flex>
              </NavLink>
            </Can>

            <Can
              permissions={[
                'Criar Usuário',
                'Editar Usuario',
                'Listar Usuario',
                'Deletar Usuario',
              ]}
            >
              <NavLink to="/admin/users">
                <Flex
                  m="2rem"
                  border="0.3rem solid black"
                  w="15rem"
                  h="15rem"
                  borderRadius="2rem"
                  justify="center"
                  align="center"
                  _hover={{ color: '#FF6B00', borderColor: 'orange' }}
                  transition={['color 200ms', 'border 500ms']}
                >
                  <Text>Usuários</Text>
                </Flex>
              </NavLink>
            </Can>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Panel;

export const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
});
