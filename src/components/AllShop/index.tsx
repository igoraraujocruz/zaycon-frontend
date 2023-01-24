import { Flex, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
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
    <Flex
      mt={['1rem', '1rem', 0]}
      pb={['1rem', '1rem', 0]}
      h={['15rem', '15rem', '100%']}
      flexDir="column"
      align="center"
      borderBottom={['6px solid #181b23', '6px solid #181b23', 0]}
      borderLeft={[0, 0, '4px solid #181b23']}
      borderRight={[0, 0, '4px solid #181b23']}
    >
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />
      <Heading size="md" color="#fff">
        Todas as vendas
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
        <VStack ml="1rem" align={['center', 'center', 'flex-start']}>
          {data?.map(
            shop =>
              shop.paid &&
              shop.status !== 'Entregue' && (
                <Flex key={shop.id}>
                  <HStack
                    color={shop.paid ? '#00FF00' : '#A9A9A9'}
                    cursor="pointer"
                    onClick={() => handleModal(shop)}
                  >
                    {shop.status === 'Preparando' && <BsBoxSeam size={28} />}
                    {shop.status === 'Enviado' && <TbTruckDelivery size={28} />}
                    {shop.status === 'Aguardando Confirmação' && (
                      <Spinner size="md" />
                    )}
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
