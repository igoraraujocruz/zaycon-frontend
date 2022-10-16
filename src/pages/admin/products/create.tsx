import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef } from 'react';
import { createProduct } from '../../../services/hooks/useProducts';
import { Input } from '../../../components/Form/Input';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { InputFile, InputFileHandle } from '../../../components/Form/InputFile'
import { Textarea } from '../../../components/Form/TextArea';

type CreateFormData = {
  name: string;
  description: string;
  price: number;
  debitPoints: number;
  creditPoints: number;
  photos: File[];
};

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome do produto é obrigatório'),
  description: yup.string().required('Descrição do produto é obrigatória'),
  price: yup.number().typeError('Insira um valor').required('Preço do produto é obrigatório'),
  debitPoints: yup
    .number()
    .typeError('Insira um valor')
    .required(
      'Informar quantos pontos são necessários para adquirir o produto',
    ),
  creditPoints: yup
    .number()
    .typeError('Insira um valor')
    .required(
      'Informar quantidade de pontos que se ganha ao comprar este produto',
    ),
});

export function CreateProducts() {
  const inputFileRef = useRef<InputFileHandle>(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData>({
    resolver: yupResolver(createFormSchema),
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<CreateFormData> = async (values: CreateFormData) => {
    try {
      await createProduct({
        name: values.name,
        description: values.description,
        price: values.price,
        debitPoints: values.debitPoints,
        creditPoints: values.creditPoints,
        photos: inputFileRef.current.images,
      });
      
      inputFileRef.current?.setImages([])
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
    <Flex
      onSubmit={handleSubmit(onSubmit)}
      as="form"
      w={400}
      bg="gray.800"
      p="8"
      h={'48rem'}
      borderRadius={8}
      flexDir="column"
    >
      <Text fontSize="2xl">Novo Produto</Text>
      <Stack spacing="0.5">
        <Input error={errors.name} name="name" label="Nome" {...register('name')} />
        <Input error={errors.price} type={'number'} name="price" label="Preço" {...register('price')} />
        <Textarea error={errors.description} name="description" label="Descrição" {...register('description')} />
        <Input
          type={'number'}
          error={errors.debitPoints}
          name="debitPoints"
          label="Débito de Pontos"
          {...register('debitPoints')}
        />
        <Input
          type={'number'}
          error={errors.creditPoints}
          name="creditPoints"
          label="Crédito de Pontos"
          {...register('creditPoints')}
        />
        </Stack>
        <Flex justify={'center'}>
          <InputFile mt={'1rem'} ref={inputFileRef} />
        </Flex>     
      <Button bg={'#FF6B00'}  _hover={{bg: 'orangeHover'}} type="submit" mt="6" colorScheme="orange" size="lg">
        Cadastrar
      </Button>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
