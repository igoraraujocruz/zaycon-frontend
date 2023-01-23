import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Image,
  Flex,
  ModalHeader,
  Text,
  VStack,
  HStack,
  useToast,
  Heading,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react';

interface Client {
  name: string;
}

interface Product {
  id: string;
  name: string;
  points: number;
}

interface Order {
  id: string;
  quantity: number;
  product: Product;
}

interface Shop {
  shop: {
    id: string;
    quantity: number;
    createdAt: string;
    client: Client;
    order: Order[];
    paid: boolean;
  };
}

export interface DetailsShopModalHandle {
  onOpen: () => void;
  onClose: () => void;
}

const DetailsShop: ForwardRefRenderFunction<DetailsShopModalHandle, any> = (
  { shop }: Shop,
  ref,
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
    <Flex>
      <Modal size={['md', 'md', '2xl']} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="orange"
            _hover={{ bg: 'orangeHover' }}
            color="#fff"
          />
          <ModalHeader />
          <ModalBody color="#fff">
            <Flex justify="center" flexDir="column">
              <Heading>{shop.client?.name}</Heading>
              {shop.order?.map(clientOrder => (
                <Text key={clientOrder.id}>
                  {clientOrder.quantity}x {clientOrder.product.name} ={' '}
                  {clientOrder.quantity * clientOrder.product.points} Pontos
                </Text>
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              color="#fff"
              bg="orange"
              _hover={{ bg: 'orangeHover' }}
              mr={3}
              onClick={onClose}
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(DetailsShop);
