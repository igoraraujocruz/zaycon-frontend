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
    <Flex
      mt={['1rem', '1rem', 0]}
      pb={['1rem', '1rem', 0]}
      h={['15rem', '15rem', '100%']}
      flexDir="column"
      align="center"
      borderBottom={['6px solid #181b23', '6px solid #181b23', 0]}
      borderRight={[0, 0, '4px solid #181b23']}
    >
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />
      <Heading color="#fff" size="md">
        Vendas Concluidas
      </Heading>
      <Flex
        flexDir="column"
        maxH={['15rem', '15rem', '20rem']}
        w={['18rem', '18rem', '15rem']}
        overflow="scroll"
        sx={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <VStack align={['center', 'center', 'flex-start']}>
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
                  <Text
                    w="5rem"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    color={shop.status === 'Entregue' && '#A9A9A9'}
                  >
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
