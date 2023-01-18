import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Flex,
  ModalHeader,
  Text,
  VStack,
  HStack,
  Heading,
  Select,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { updateStatus } from '../../services/hooks/useShop';

interface Client {
  name: string;
  address: string;
  cep: string;
  email: string;
  numberPhone: string;
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

export interface DetailsAllShopModalHandle {
  onOpen: () => void;
  onClose: () => void;
}

const DetailsAllShop: ForwardRefRenderFunction<
  DetailsAllShopModalHandle,
  any
> = ({ shop }: Shop, ref) => {
  const [isSubmited, setIsSubmited] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { handleSubmit, register } = useForm();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const onSubmit = async ({ status }: any) => {
    setIsSubmited(true);
    try {
      await updateStatus(shop.id, status);
    } catch (err) {
      toast({
        position: 'top',
        title: `Conexão do Whatsapp`,
        description: err.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }

    setIsSubmited(false);
    onClose();
  };

  return (
    <Flex>
      <Modal size={['md', 'md', '2xl']} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="#fff">
          <ModalCloseButton />
          <ModalHeader />
          <ModalBody>
            <VStack spacing="1rem">
              <HStack spacing="5rem">
                <VStack align="flex-start">
                  <Heading size="md">{shop.client?.name}</Heading>
                  <Text fontSize="1.2rem">{shop.client?.email}</Text>
                  <Text fontSize="1.2rem">{shop.client?.cep}</Text>
                  <Text fontSize="1.2rem">{shop.client?.address}</Text>
                  <Text fontSize="1.2rem">{shop.client?.numberPhone}</Text>
                </VStack>
                <VStack align="start" bg="#0d0e12" p="2rem" borderRadius="1rem">
                  <Text fontSize="1.2rem">Itens</Text>
                  {shop.order?.map(clientOrder => (
                    <Text key={clientOrder.id}>
                      {clientOrder.quantity}x {clientOrder.product.name}
                    </Text>
                  ))}
                </VStack>
              </HStack>
              <Text alignSelf="start">Status</Text>
              {!shop.paid && (
                <Text alignSelf="flex-start">Aguardando pagamento...</Text>
              )}
              {shop.paid && (
                <Flex h="2rem">
                  {!isSubmited ? (
                    <VStack
                      as="form"
                      w="100%"
                      justify="flex-start"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Select {...register('status')}>
                        <option
                          style={{ background: '#0d0e12' }}
                          value="Preparando"
                        >
                          Preparando
                        </option>
                        <option
                          style={{ background: '#0d0e12' }}
                          value="Enviado"
                        >
                          Enviado
                        </option>
                        <option
                          style={{ background: '#0d0e12' }}
                          value="Entregue"
                        >
                          Entregue
                        </option>
                      </Select>
                      <Flex justify="start" w="100%">
                        <Button
                          type="submit"
                          bg="#0d0e12"
                          _hover={{
                            bg: '#181b23',
                          }}
                        >
                          Alterar Status
                        </Button>
                      </Flex>
                    </VStack>
                  ) : (
                    <Spinner size="md" />
                  )}
                </Flex>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter h="5rem" />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(DetailsAllShop);
