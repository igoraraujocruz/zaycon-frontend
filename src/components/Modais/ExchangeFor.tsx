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
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';
import { api } from '../../services/apiClient';
import { queryClient } from '../../services/queryClient';

interface ImageModalProps {
  productId?: string;
}

export interface ModalExchangeForHandle {
  onOpen: () => void;
  onClose: () => void;
}

const ExchangeFor: ForwardRefRenderFunction<
  ModalExchangeForHandle,
  ImageModalProps
> = ({ productId }: ImageModalProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const toast = useToast();

  async function trocarPontos() {
    if (productId) {
      try {
        await api.post('/sellerOrders', {
          productId,
        });
        toast({
          title: 'Seus pontos foram trocados!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        await queryClient.invalidateQueries('seller');
        onClose();
      } catch (err) {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      try {
        await api.post('/sellerOrders');
        toast({
          title: 'Seus pontos foram trocados!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        await queryClient.invalidateQueries('seller');
        onClose();
      } catch (err) {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.900" color="#fff">
        <ModalHeader fontSize="1.5rem" fontWeight="normal">
          Tem certeza que deseja trocar?
        </ModalHeader>
        <ModalCloseButton color="#fff" />
        <ModalBody>
          <Text>Todos os seus pontos serão trocados por dinheiro.</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="transparent"
            fontWeight="normal"
            _hover={{ bg: 'gray.700' }}
            mr={3}
            onClick={() => trocarPontos()}
          >
            Sim, quero que troque.
          </Button>
          <Button
            fontWeight="normal"
            bg="transparent"
            _hover={{ bg: 'gray.700' }}
            mr={3}
            onClick={onClose}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(ExchangeFor);
