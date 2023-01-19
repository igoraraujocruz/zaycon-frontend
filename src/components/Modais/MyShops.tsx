import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Text,
  Flex,
  Image,
  VStack,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { FaCheckSquare } from 'react-icons/fa';
import { api } from '../../services/apiClient';
import { useFinishShop } from '../../services/hooks/useFinishShop';
import { SocketContext } from '../../services/hooks/useSocket';

export interface ContractMyShopsModal {
  onOpen: () => void;
  onClose: () => void;
}

interface Photos {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  photos: Photos[];
}

interface Order {
  id: string;
  quantity: number;
  product: Product;
}

interface Client {
  id: string;
  address: string;
  cep: string;
}

interface Shop {
  id: string;
  status: string;
  order: Order[];
  client: Client;
  createdAt: string;
}

const MyShops: ForwardRefRenderFunction<ContractMyShopsModal> = (
  props,
  ref,
) => {
  const [shopInfo, setShopInfo] = useState<Shop[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statusUpdated, setStatusUpdated] = useState(false);

  const { finishShopsId } = useFinishShop();

  const socket = useContext(SocketContext);

  socket.on('changeStatus', async () => {
    setStatusUpdated(!statusUpdated);
  });

  useEffect(() => {
    if (finishShopsId.length > 0) {
      api
        .get(`/shop?shopId=${finishShopsId}`)
        .then(response => setShopInfo([response.data]));
    }
  }, [finishShopsId, statusUpdated]);

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg" color="bg">
        <ModalCloseButton color="itemColor" />
        <ModalHeader />
        <ModalBody color="itemColor">
          {shopInfo[0]?.id?.length > 0 ? (
            shopInfo?.map(shop => (
              <VStack key={shop.id}>
                {shop.order?.map(order => (
                  <VStack key={order.id}>
                    <Text>{order.product.name}</Text>
                    <Image
                      alt="fotos dos produtos"
                      src={order.product.photos[0]?.url}
                    />
                  </VStack>
                ))}
                <HStack align="center" justify="center">
                  <Text>Status: {shop.status}</Text>
                  {shop.status === 'Aguardando Confirmação' && (
                    <Image
                      w="2rem"
                      alt="loading"
                      src="loading-aguardando.svg"
                    />
                  )}

                  {shop.status === 'Preparando' && (
                    <Image
                      w="4rem"
                      alt="loading"
                      src="loading-preparando.svg"
                    />
                  )}
                  {shop.status === 'Enviado' && (
                    <Image w="4rem" alt="loading" src="loading-enviado.svg" />
                  )}

                  {shop.status === 'Entregue' && (
                    <FaCheckSquare color="green" />
                  )}
                </HStack>

                <Flex>
                  <Text>
                    {shop.client?.cep} - {shop.client?.address}
                  </Text>
                </Flex>
              </VStack>
            ))
          ) : (
            <Text>Você ainda não possui nenhuma compra finalizada</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(MyShops);
