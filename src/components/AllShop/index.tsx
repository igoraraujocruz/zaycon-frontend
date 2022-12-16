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

export const AllShop = () => {
  const modalDetailsAllShop = useRef<DetailsAllShopModalHandle>(null);
  const [shop, setShop] = useState({} as Shop);

  const { data } = useShop();

  const handleModal = useCallback(shop => {
    setShop(shop);
    modalDetailsAllShop.current.onOpen();
  }, []);

  return (
    <Flex flexDir="column" mt={['1rem']} align="center">
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />
      <Heading size="md">Todas as vendas</Heading>
      <Flex
        flexDir="column"
        h={['15rem', '15rem', '20rem']}
        mr={[0, 0, '1rem']}
        w={['18rem', '18rem', '25rem']}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF6B00',
            borderRadius: '24px',
          },
        }}
      >
        <VStack align="center">
          {data?.map(
            shop =>
              shop.paid && (
                <Flex key={shop.id}>
                  <HStack
                    color={shop.paid ? '#00FF00' : '#A9A9A9'}
                    cursor="pointer"
                    onClick={() => handleModal(shop)}
                  >
                    <Text color={shop.status === 'Entregue' && '#A9A9A9'}>
                      {shop.createdAt}
                    </Text>
                    <Text color={shop.status === 'Entregue' && '#A9A9A9'}>
                      {shop.client.name}
                    </Text>
                    {shop.status === 'Preparando' && <BsBoxSeam size={28} />}
                    {shop.status === 'Enviado' && <TbTruckDelivery size={28} />}
                    {shop.status === 'Entregue' && <FiCheck size={28} />}
                  </HStack>
                </Flex>
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
