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
import { deletePhoto, deleteProducts } from '../../services/hooks/useProducts';

interface ImageModalProps {
  productId?: string;
  clientId?: string;
  photoId?: string;
  userId?: string;
}

export interface ModalDeleteHandle {
  onOpen: () => void;
  onClose: () => void;
}

const DeleteModal: ForwardRefRenderFunction<
  ModalDeleteHandle,
  ImageModalProps
> = ({ productId, clientId, photoId, userId }: ImageModalProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const toast = useToast();

  function deleteObject() {
    if (productId) {
      try {
        deleteProducts(productId);
        onClose();
      } catch (error) {
        toast({
          title: 'Não foi possível deletar o produto',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }

    if (photoId) {
      try {
        deletePhoto(photoId);
        onClose();
      } catch (error) {
        toast({
          title: 'Não foi possível deletar a imagem',
          description: error.message,
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
      <ModalContent bg="gray.900">
        <ModalHeader fontSize="1.5rem" fontWeight="normal">
          Tem certeza que deseja deletar?
        </ModalHeader>
        <ModalCloseButton color="#fff" />
        <ModalBody>
          <Text>Não será possível recuperar depois.</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="transparent"
            fontWeight="normal"
            _hover={{ bg: '#ff0118' }}
            mr={3}
            onClick={deleteObject}
          >
            Deletar
          </Button>
          <Button
            fontWeight="normal"
            bg="transparent"
            _hover={{ bg: 'orange' }}
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

export default forwardRef(DeleteModal);
