import { Flex } from '@chakra-ui/react';

import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { CreateProducts } from './create';
import { GetProducts } from './get';

const Products = () => (
  <Flex
    justify="center"
    mt="5rem"
    flexDir={['column', 'column', 'row']}
  >
    <Flex position={['initial', 'initial', 'fixed']} justify={['center']} left={'5rem'}>
      <CreateProducts />
    </Flex>
    <Flex ml={'-10rem'} w={'100vw'} justify={'flex-end'}>
      <GetProducts />
    </Flex>
  </Flex>
);

export default Products;

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
