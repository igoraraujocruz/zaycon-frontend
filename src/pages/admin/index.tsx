import { Box, Flex } from '@chakra-ui/react';

import { withSSRAuth } from '../../utils/WithSSRAuth';
import { CreateProducts } from './products/create';
import { GetProducts } from './products/get';
import { CreateClients } from './clients/create';
import { GetClients } from './clients/get';

const Products = () => (
  <Flex
    justify="center"
    mt="5rem"
    flexDir={['column-reverse', 'column-reverse', 'row']}
  >
    <Box>
      <CreateProducts />
      <Box mt="2rem">
        <CreateClients />
      </Box>
    </Box>
    <Box>
      <GetProducts />
      <Box mt="5rem">
        <GetClients />
      </Box>
    </Box>
  </Flex>
);

export default Products;

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
