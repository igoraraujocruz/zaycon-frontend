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
  useToast,
  Flex,
  ModalHeader,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createPhotos, Product, useProductById } from '../../services/hooks/useProducts';
import { InputFile, InputFileHandle } from '../Form/InputFile';

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    slug: string;
    creditPoints: number;
    debitPoints: number;
    createdAt: string;
    photos: [
      {
        id: string;
        name: string;
        url: string;
      },
    ];
    user: {
      id: string;
      name: string;
    };
  }
}


type CreateFormData = {
  photos: File[];
};

export interface UploadImageModalHandle {
  onOpen: () => void;
  onClose: () => void;
}

const UploadImageModal: ForwardRefRenderFunction<UploadImageModalHandle, ProductProps> = ({ product }: ProductProps, ref) => {
  const inputFileRef = useRef<InputFileHandle>(null)
  const { data: newProduct,  isLoading, error, isFetching } = useProductById(product.id)
  const { handleSubmit } = useForm();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const toast = useToast();

  const onSubmit: SubmitHandler<CreateFormData> = async () => {
    try {
      await createPhotos({
        productId: product.id,
        photos: inputFileRef.current.images,
      });
      inputFileRef.current.setImages({})
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o produto',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="#ff6a0099"
            _hover={{ bg: 'orange' }}
            color="black"
          />
          <ModalHeader>
            <Flex
              align={'center'}
              justify={'space-evenly'}
              onSubmit={handleSubmit(onSubmit)}
              as="form"
              bg="gray.800"
              p="2"
              borderRadius={8}
            >
              <InputFile mt={'1rem'} ref={inputFileRef} />
              <Button type="submit" mt="6" bg={'orange'} _hover={{ bg: 'orangeHover'}} size="lg">
                Upload
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody>
          <Flex h={'2rem'}>  
            {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
            )}
          </Flex>
          {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
          ) : error ? (
          <Flex justify="center">
            <Text>Falha ao obter dados dos produtos.</Text>
          </Flex>
          ) : (
            newProduct?.photos.map(photo => (
              <Image p="0.7rem" key={photo.id} src={photo.url} />
            )))}
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              bg="#ff6a0099"
              _hover={{ bg: 'orange' }}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default forwardRef(UploadImageModal)