import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { NavLink } from '../../components/ActiveLink';
import { Can } from '../../components/Can';
import { withSSRAuth } from '../../utils/WithSSRAuth';

const Panel = () => {
  return (
    <Flex h="100vh" flexDir="column" justify="flex-start" align="center">
      <Image mt="2rem" w="13rem" src="../logo.svg" />
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
  );
};

export default Panel;

export const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
});
