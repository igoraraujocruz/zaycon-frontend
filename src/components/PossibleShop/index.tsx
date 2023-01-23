import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
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

export const PossibleShop = () => {
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
      flexDir="column"
      w="100%"
      h={['15rem', '15rem', '100%']}
      borderBottom={['6px solid #181b23', '6px solid #181b23', 0]}
    >
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />

      <Flex justify="center">
        <Heading color="white" size="md">
          Possíveis Vendas
        </Heading>
      </Flex>

      <Flex
        maxH={['15rem', '15rem', '20rem']}
        flexDir="column"
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
              !shop.paid && (
                <Flex key={shop.id}>
                  <HStack
                    color={shop.paid ? '#00FF00' : '#A9A9A9'}
                    cursor="pointer"
                    onClick={() => handleModal(shop)}
                  >
                    <Text>{shop.createdAt}</Text>
                    <Text
                      w="5rem"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
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
