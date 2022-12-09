import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { BsBoxSeam } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiCheck } from 'react-icons/fi';
import { withSSRAuth } from '../../utils/WithSSRAuth';
import DetailsAllShop, {
  DetailsAllShopModalHandle,
} from '../Modais/DetailsAllShop';

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

export const AllShop = ({ seller }: Seller) => {
  const modalDetailsAllShop = useRef<DetailsAllShopModalHandle>(null);
  const [shop, setShop] = useState({} as Shop);

  const handleModal = useCallback(shop => {
    setShop(shop);
    modalDetailsAllShop.current.onOpen();
  }, []);

  return (
    <Flex flexDir="column">
      <DetailsAllShop shop={shop} ref={modalDetailsAllShop} />

      <Heading size="md">Todas as vendas</Heading>
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
                <Text color={shop.status === 'Entregue' && '#A9A9A9'}>
                  {new Date(shop.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </Text>
                <Text color={shop.status === 'Entregue' && '#A9A9A9'}>
                  {shop.client.name}
                </Text>
                {shop.status === 'Preparando' && <BsBoxSeam size={28} />}
                {shop.status === 'Enviado' && <TbTruckDelivery size={28} />}
                {shop.status === 'Entregue' && <FiCheck size={28} />}
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
};

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
