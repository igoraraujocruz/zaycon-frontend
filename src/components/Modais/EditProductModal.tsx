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
  Checkbox,
  FormControl,
  Select,
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
    amount: number;
    points: number;
    createdAt: string;
    destaque: boolean;
    category: string;
    photos: [
      {
        id: string;
        name: string;
        url: string;
      },
    ];
  };
}

type CreateFormData = {
  photos: File[];
};

type EditFormData = {
  name: string;
  description: string;
  price: number;
  amount: number;
  points: number;
  destaque: boolean;
  category: string;
};

export interface ContractEditProductModal {
  onOpen: () => void;
  onClose: () => void;
}

const DetailsProductModal: ForwardRefRenderFunction<
  ContractEditProductModal,
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
  }, [product, reset]);

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
        points: getValues('points'),
        amount: getValues('amount'),
        destaque: getValues('destaque'),
        category: getValues('category'),
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
        <ModalContent bg="gray.900" color="#fff">
          <ModalCloseButton />
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
                  <Checkbox {...register('destaque')} colorScheme="green">
                    Destacar
                  </Checkbox>

                  <FormControl h="5rem">
                    <Text mt="0.5rem">Categoria</Text>
                    <Select
                      _hover={{
                        borderColor: 'none',
                      }}
                      w="12rem"
                      {...register('category')}
                    >
                      <option
                        style={{ background: '#181B23' }}
                        value="televisoes"
                      >
                        Televisões
                      </option>
                      <option
                        style={{ background: '#181B23' }}
                        value="informatica"
                      >
                        Informática
                      </option>
                      <option style={{ background: '#181B23' }} value="som">
                        Audio
                      </option>
                      <option
                        style={{ background: '#181B23' }}
                        value="utilitarios"
                      >
                        Utilitários
                      </option>
                    </Select>
                  </FormControl>
                  <Input
                    color="#04070D"
                    name="name"
                    label="Nome"
                    {...register('name')}
                    placeholder={product.name}
                  />
                  <Input
                    color="#04070D"
                    name="price"
                    label="Preço"
                    {...register('price')}
                  />
                  <Textarea
                    bg="inputBg"
                    color="#04070D"
                    _focus={{
                      bg: 'inputBg',
                    }}
                    _hover={{
                      border: 'none',
                    }}
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
                    color="#04070D"
                    name="points"
                    label="Pontos"
                    {...register('points')}
                  />
                  <Input
                    color="#04070D"
                    name="amount"
                    label="Estoque"
                    {...register('amount')}
                  />
                </Stack>
                <Button
                  bg="#04070D"
                  type="submit"
                  _hover={{
                    bg: '#04070D',
                  }}
                  mt="6"
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
                        _hover={{ bg: '#04070D' }}
                        size="lg"
                        bg="#04070D"
                      >
                        Upload
                      </Button>
                    </HStack>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(DetailsProductModal);
