import { Box, Flex } from '@chakra-ui/react';
import { AdminHeader } from '../../../components/AdminHeader';

import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { CreateProducts } from './create';
import { GetProducts } from './get';

const Products = () => (
  <Box>
    <AdminHeader />
    <Flex
      w={'100%'}
      justify="center"
      mt="5rem"
      flexDir={['column', 'column', 'row']}
    >
      <Flex justify={['center']}>
        <CreateProducts />
      </Flex>
      <Flex justify={'center'} pl='2rem'>
        <GetProducts />
      </Flex>
    </Flex>
  </Box>
);

export default Products;

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
