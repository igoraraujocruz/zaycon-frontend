import { Box, Flex } from '@chakra-ui/react';
import { AdminHeader } from '../../../components/AdminHeader';
import { Can } from '../../../components/Can';

import { withSSRAuth } from '../../../utils/WithSSRAuth';
import CreateProducts from './create';
import GetProducts from './get';

const Products = () => (
  <Box>
    <AdminHeader />
    <Flex
      justify="center"
      flexDir={['column', 'column', 'column', 'column', 'row']}
    >
      <Can permissions={['Cadastrar Produto']}>
        <Flex mt="2rem" justify={['center']}>
          <CreateProducts />
        </Flex>
      </Can>
      <Can permissions={['Listar Produto']}>
        <Flex justify="center" pl={['0', '0', '2rem']}>
          <GetProducts />
        </Flex>
      </Can>
    </Flex>
  </Box>
);

export default Products;

export const getServerSideProps = withSSRAuth(
  async ctx => {
    return {
      props: {},
    };
  },
  {
    permissions: [
      'Cadastrar Produto',
      'Deletar Produto',
      'Listar Produto',
      'Editar Produto',
    ],
  },
);
