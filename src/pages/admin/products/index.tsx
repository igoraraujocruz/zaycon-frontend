import { Flex } from '@chakra-ui/react';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import Create from './create';
import Get from './get';

const Products = () => (
  <Flex justify="center" mt="5rem">
    <Create />
    <Get />
  </Flex>
);

export default Products;

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
