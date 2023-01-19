import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useContext, useRef, useState } from 'react';
import { SocketContext } from '../../services/hooks/useSocket';
import { useSeller } from '../../services/hooks/useUsers';
import { queryClient } from '../../services/queryClient';
import DetailsShopModal, {
  DetailsShopModalHandle,
} from '../Modais/DetailsShop';

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
}

export const SellerShop = () => {
  const modalDetailsShop = useRef<DetailsShopModalHandle>(null);

  const [shop, setShop] = useState({} as Shop);

  const handleModal = shop => {
    setShop(shop);
    modalDetailsShop.current.onOpen();
  };

  const { data } = useSeller();

  const socket = useContext(SocketContext);

  socket.on('createShop', async () => {
    await queryClient.invalidateQueries('seller');
  });

  socket.on('receivePaimentAdmin', async () => {
    await queryClient.invalidateQueries('seller');
  });

  return (
    <Flex flexDir="column" align="flex-start" mb={['1rem', '1rem', 0]}>
      <DetailsShopModal shop={shop} ref={modalDetailsShop} />
      <Heading size="md" color="#fff">
        Minhas Vendas
      </Heading>
      <Flex
        maxH={['15rem', '15rem', '20rem']}
        flexDir="column"
        w={['18rem', '18rem', '25rem']}
        overflow="scroll"
        sx={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <VStack align="flex-start">
          {data?.shop.map(shop => (
            <Flex key={shop.id}>
              <HStack
                color={shop.paid ? '#00FF00' : '#A9A9A9'}
                cursor="pointer"
                onClick={() => handleModal(shop)}
              >
                <Text>
                  {new Date(shop.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </Text>
                <Text>{shop.client.name.toUpperCase()}</Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
};
