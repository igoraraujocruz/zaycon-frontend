import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
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

interface Seller {
  seller: {
    id: string;
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
    numberPhone: string;
    points: number;
    birthday: string;
    shop: Shop[];
  };
}

export const SellerShop = ({ seller }: Seller) => {
  const modalDetailsShop = useRef<DetailsShopModalHandle>(null);
  const [shop, setShop] = useState({} as Shop);

  const handleModal = shop => {
    setShop(shop);
    modalDetailsShop.current.onOpen();
  };

  return (
    <Flex flexDir="column">
      <DetailsShopModal shop={shop} ref={modalDetailsShop} />
      <Heading size="md">Minhas Vendas</Heading>
      <HStack>
        <Text color="#00FF00">Vendidos</Text>
        <Text color="#A9A9A9">Aguardando Pagamento</Text>
      </HStack>
      <Flex
        bg="gray.800"
        h="38.5rem"
        flexDir="column"
        w={['20rem', '20rem', '30rem']}
        borderRadius="2rem"
        p="2rem"
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
        <VStack align="flex-start">
          {seller.shop?.map(shop => (
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
                <Text>{shop.client.name}</Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
};
