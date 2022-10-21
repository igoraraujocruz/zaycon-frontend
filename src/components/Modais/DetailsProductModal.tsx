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
  Stack,
  HStack,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AiFillCloseCircle } from 'react-icons/ai';
import Zoom from 'react-medium-image-zoom';
import {
  createPhotos,
  updateProduct,
  useProductById,
} from '../../services/hooks/useProducts';
import { InputFile, InputFileHandle } from '../Form/InputFile';
import DeleteModal, { ModalDeleteHandle } from './DeleteModal';
import { Input } from '../Form/Input';
import { Textarea } from '../Form/TextArea';
import { api } from '../../services/apiClient';

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
  };
}

type CreateFormData = {
  photos: File[];
};

type EditFormData = {
  name: string;
  description: string;
  price: number;
  debitPoints: number;
  creditPoints: number;
};

export interface DetailsProductModalHandle {
  onOpen: () => void;
  onClose: () => void;
}

const editFormSchema = yup.object().shape({
  name: yup.string().required('Nome do produto é obrigatório'),
  description: yup.string().required('Descrição do produto é obrigatória'),
  price: yup.number().required('Preço do produto é obrigatório'),
  debitPoints: yup
    .number()
    .required(
      'Informar quantos pontos são necessários para adquirir o produto',
    ),
  creditPoints: yup
    .number()
    .required(
      'Informar quantidade de pontos que se ganha ao comprar este produto',
    ),
});

const DetailsProductModal: ForwardRefRenderFunction<
  DetailsProductModalHandle,
  ProductProps
> = ({ product }: ProductProps, ref) => {
  const inputFileRef = useRef<InputFileHandle>(null);
  const deleteModalRef = useRef<ModalDeleteHandle>(null);

  const {
    data: newProduct,
    isLoading,
    error,
    isFetching,
  } = useProductById(product.id);

  const [photoId, setPhotoId] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit, getValues, reset } = useForm({
    defaultValues: useMemo(() => {
      return product;
    }, [product]),
  });

  useEffect(() => {
    reset(product);
  }, [product]);

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const openDeleteModal = (photoId: string) => {
    setPhotoId(photoId);
    deleteModalRef.current.onOpen();
  };

  const toast = useToast();

  const onUploadImageSubmit = async () => {
    try {
      await createPhotos({
        productId: product.id,
        photos: inputFileRef.current.images,
      });
      toast({
        title: 'Upload feito com sucesso!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      inputFileRef.current.setImages([]);
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o produto',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const editSubmit: SubmitHandler<EditFormData> = async () => {
    try {
      await updateProduct({
        id: product.id,
        name: getValues('name'),
        description: getValues('description'),
        price: getValues('price'),
        creditPoints: getValues('creditPoints'),
        debitPoints: getValues('debitPoints'),
      });
      toast({
        title: 'Produto atualizado com sucesso!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível atualizar o produto',
        description: error.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex>
      <DeleteModal ref={deleteModalRef} photoId={photoId} />
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="orange"
            _hover={{ bg: 'orangeHover' }}
            color="#fff"
          />
          <ModalHeader />
          <ModalBody>
            <Flex flexDir={['column', 'column', 'row']} justify="space-between">
              <Flex
                minW="20rem"
                pr="0.5rem"
                maxW={800}
                flexDir="column"
                as="form"
                onSubmit={handleSubmit(editSubmit)}
              >
                <Stack spacing="0.5">
                  <Input
                    bg="gray.800"
                    name="name"
                    label="Nome"
                    {...register('name')}
                    placeholder={product.name}
                  />
                  <Input
                    bg="gray.800"
                    name="price"
                    label="Preço"
                    {...register('price')}
                  />
                  <Textarea
                    bg="gray.800"
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
                    name="description"
                    label="Descrição"
                    {...register('description')}
                  />
                  <Input
                    bg="gray.800"
                    name="debitPoints"
                    label="Débito de Pontos"
                    {...register('debitPoints')}
                  />
                  <Input
                    bg="gray.800"
                    name="creditPoints"
                    label="Crédito de Pontos"
                    {...register('creditPoints')}
                  />
                </Stack>
                <Button
                  bg="#FF6B00"
                  _hover={{ bg: 'orangeHover' }}
                  type="submit"
                  mt="6"
                  colorScheme="orange"
                  size="lg"
                >
                  Salvar
                </Button>
              </Flex>
              <Flex
                minW="20rem"
                maxW="48rem"
                flexDir="column"
                mt={['2rem', '2rem', 0, 0]}
                bg="gray.800"
                borderRadius={8}
              >
                <Flex justify="center" w="100%" align="center" h="2rem">
                  {!isLoading && isFetching && <Spinner size="md" />}
                </Flex>

                <Flex flexDir="column" justify="space-between">
                  <Flex
                    wrap="wrap"
                    minW={['20rem', '20rem', '48rem']}
                    h="24.4rem"
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
                    overflowY="auto"
                  >
                    {isLoading ? (
                      <Flex justify="center">
                        <Spinner />
                      </Flex>
                    ) : error ? (
                      <Flex justify="center">
                        <Text>Falha ao obter dados dos produtos.</Text>
                      </Flex>
                    ) : (
                      newProduct?.photos?.map(photo => (
                        <Flex
                          p="0.2rem"
                          key={photo.id}
                          flexDir="column"
                          align="end"
                        >
                          <Flex
                            _hover={{ color: '#ff0118' }}
                            transition="color 200ms"
                            mb="0.5rem"
                          >
                            <AiFillCloseCircle
                              size={30}
                              cursor="pointer"
                              onClick={() => openDeleteModal(photo.id)}
                            />
                          </Flex>
                          <Zoom overlayBgColorEnd="gray.900">
                            <Image maxW="10rem" src={photo.url} />
                          </Zoom>
                        </Flex>
                      ))
                    )}
                  </Flex>

                  <Flex
                    justify={['center', 'center', 'start', 'end']}
                    p="1rem"
                    as="form"
                    onSubmit={handleSubmit(onUploadImageSubmit)}
                  >
                    <HStack spacing={2}>
                      <InputFile ref={inputFileRef} />
                      <Button
                        type="submit"
                        disabled={!inputFileRef.current?.images.length && true}
                        bg="orange"
                        _hover={{ bg: 'orangeHover' }}
                        size="lg"
                      >
                        Upload
                      </Button>
                    </HStack>
                  </Flex>
                </Flex>
              </Flex>
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
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(DetailsProductModal);
