import {
  Button,
  useDisclosure,
  useToast,
  Flex,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  Text,
  FormControl,
  Checkbox,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createProduct } from '../../services/hooks/useProducts';
import { InputFile, InputFileHandle } from '../Form/InputFile';
import { Input } from '../Form/Input';
import { Textarea } from '../Form/TextArea';
import { convertRealToNumber } from '../../utils/convertRealToNumber';
import { MaskedInput } from '../Form/MaskedInput';
import { realMask } from '../../utils/realMask';

type CreateFormData = {
  name: string;
  description: string;
  amount: number;
  price: string;
  points: number;
  photos: File[];
  category: string;
  destaque: boolean;
};

export interface ContractCreateProductModal {
  onOpen: () => void;
  onClose: () => void;
}

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome do produto é obrigatório'),
  amount: yup.number().required('A quantidade é necessária'),
  description: yup.string().required('Descrição do produto é obrigatória'),
  category: yup.string().required('A categoria do produto é obrigatória'),
  destaque: yup.boolean(),
  price: yup
    .string()
    .typeError('Insira um valor')
    .required('Preço do produto é obrigatório'),
  points: yup
    .number()
    .typeError('Insira um valor')
    .required(
      'Informar quantos pontos são necessários para adquirir o produto',
    ),
});

const CreateProductModal: ForwardRefRenderFunction<
  ContractCreateProductModal
> = (props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputFileRef = useRef<InputFileHandle>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(createFormSchema),
  });

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const toast = useToast();

  const onSubmit: SubmitHandler<CreateFormData> = async (
    values: CreateFormData,
  ) => {
    try {
      await createProduct({
        name: values.name,
        description: values.description,
        amount: values.amount,
        price: convertRealToNumber(values.price),
        points: values.points,
        photos: inputFileRef.current.images,
        category: values.category,
        destaque: values.destaque,
      });

      inputFileRef.current?.setImages([]);
      reset();
      toast({
        title: 'Produto cadastrado com sucesso!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o produto',
        description: error.response?.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalCloseButton
          bg="orange"
          _hover={{ bg: 'orangeHover' }}
          color="#fff"
        />
        <ModalHeader />
        <ModalBody>
          <Flex onSubmit={handleSubmit(onSubmit)} as="form" flexDir="column">
            <Stack spacing="0.5">
              <Checkbox {...register('destaque')} colorScheme="green">
                Destacar
              </Checkbox>
              <Input
                error={errors.name}
                name="name"
                label="Nome"
                {...register('name')}
              />
              <MaskedInput
                focusBorderColor="#FF6B00"
                mask={realMask}
                error={errors.price}
                name="price"
                label="Preço"
                {...register('price')}
              />
              <FormControl h="5rem">
                <Text mt="0.5rem">Categoria</Text>
                <Select
                  _hover={{
                    borderColor: 'none',
                  }}
                  focusBorderColor="#FF6B00"
                  border="0.13rem solid"
                  borderColor="gray.600"
                  w="12rem"
                  {...register('category')}
                >
                  <option style={{ background: '#181B23' }} value="televisoes">
                    Televisões
                  </option>
                  <option style={{ background: '#181B23' }} value="informatica">
                    Informática
                  </option>
                  <option style={{ background: '#181B23' }} value="som">
                    Audio
                  </option>
                  <option style={{ background: '#181B23' }} value="utilitarios">
                    Utilitários
                  </option>
                </Select>
              </FormControl>

              <Textarea
                error={errors.description}
                name="description"
                label="Descrição"
                {...register('description')}
              />
              <Input
                error={errors.amount}
                name="amount"
                label="Quantidade"
                {...register('amount')}
              />
              <Input
                type="number"
                error={errors.points}
                name="points"
                label="Pontos"
                {...register('points')}
              />
            </Stack>
            <Flex justify="center">
              <InputFile mt="1rem" ref={inputFileRef} />
            </Flex>
            <Button
              bg="#FF6B00"
              _hover={{ bg: 'orangeHover' }}
              type="submit"
              mt="6"
              colorScheme="orange"
              size="lg"
            >
              Cadastrar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(CreateProductModal);
