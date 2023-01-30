import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  useToast,
  Flex,
  HStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { VscError } from 'react-icons/vsc';
import { api } from '../../services/apiClient';
import { Seller, useOneSeller } from '../../services/hooks/useSellers';
import { queryClient } from '../../services/queryClient';
import { formatPrice } from '../../utils/format';

interface AnswerModalProps {
  sellerId: string;
}

export interface ModalExchangeForHandle {
  onOpen: () => void;
  onClose: () => void;
}

const AnswerSeller: ForwardRefRenderFunction<
  ModalExchangeForHandle,
  AnswerModalProps
> = ({ sellerId }: AnswerModalProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useOneSeller(sellerId);

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const toast = useToast();

  async function handleResponseOrder(sellerOrderId: string) {
    try {
      await api.patch(`sellerOrders/${sellerOrderId}`);
      await queryClient.invalidateQueries('getOneseller');
      await queryClient.invalidateQueries('sellers');
      toast({
        title: 'Pedido Atendido!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  }

  return (
    sellerId.length > 0 && (
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="#fff">
          <ModalCloseButton color="#fff" />
          <ModalBody>
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th pl="4px" pr="4px">
                    Atendido
                  </Th>
                  <Th pl="30px" pr="4px">
                    Data
                  </Th>
                  <Th pl="4px" pr="4px">
                    Pontos
                  </Th>
                  <Th pl="4px" pr="4px">
                    Produto/Dinheiro
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.sellerOrders?.length > 0 ? (
                  data?.sellerOrders?.map(order => (
                    <Tr key={order.id}>
                      <Td pl="4px" pr="4px">
                        {order.answered ? (
                          <AiOutlineCheck size={20} color="green" />
                        ) : (
                          <VscError size={20} color="red" />
                        )}
                      </Td>
                      <Td pl="4px" pr="4px">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Td>
                      <Td pl="4px" pr="4px">
                        {order.points}
                      </Td>
                      <Td pl="4px" pr="4px">
                        {order.product?.name
                          ? order.product?.name
                          : formatPrice((order.points * 25) / 100)}
                      </Td>
                      <Td
                        cursor="pointer"
                        bg="transparent"
                        fontWeight="normal"
                        _hover={{ bg: 'gray.700' }}
                        mr={3}
                        onClick={() => handleResponseOrder(order.id)}
                      >
                        Atender
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>Nenhum Pedido no momento.</Tr>
                )}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  );
};

export default forwardRef(AnswerSeller);
