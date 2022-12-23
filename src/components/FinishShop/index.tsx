import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { BsBoxSeam } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiCheck } from 'react-icons/fi';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import DetailsAllShop, {
  DetailsAllShopModalHandle,
} from '../Modais/DetailsAllShop';
import { useShop } from '../../services/hooks/useShop';

interface Client {
  name: string;
}

interface Product {
  name: string;
}

interface Shop {
  id: string;
  quantity: number;
  createdAt: string;
  client: Client;
  product: Product;
  paid: boolean;
  status: string;
}

export const FinishShop = () => {
  const modalDetailsAllShop = useRef<DetailsAllShopModalHandle>(null);
  const [shop, setShop] = useState({} as Shop);

  const { data } = useShop();

  const handleModal = useCallback(shop => {
    setShop(shop);
    modalDetailsAllShop.current.onOpen();
  }, []);

  return (
    <Flex flexDir="column" align="flex-start" mb={['1rem', '1rem', 0]}>
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />
      <Heading size="md">Vendas Concluidas</Heading>
      <Flex
        flexDir="column"
        maxH={['15rem', '15rem', '20rem']}
        w={['18rem', '18rem', '25rem']}
        overflow="scroll"
        sx={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <VStack align="flex-start">
          {data?.map(
            shop =>
              shop.paid &&
              shop.status === 'Entregue' && (
                <HStack
                  align="flex-start"
                  key={shop.id}
                  color={shop.paid ? '#00FF00' : '#A9A9A9'}
                  cursor="pointer"
                  onClick={() => handleModal(shop)}
                >
                  <Text color={shop.status === 'Entregue' && '#A9A9A9'}>
                    {shop.createdAt}
                  </Text>
                  <Text color={shop.status === 'Entregue' && '#A9A9A9'}>
                    {shop.client.name.toUpperCase()}
                  </Text>
                </HStack>
              ),
          )}
        </VStack>
      </Flex>
    </Flex>
  );
};

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
