import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { createProduct } from '../../../services/hooks/useProducts';
import { Input } from '../../../components/Form/Input';
import { withSSRAuth } from '../../../utils/WithSSRAuth';

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

export function CreateProducts() {
  const [images, setImages] = useState([]);
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const toast = useToast();

  const onFileChange = useCallback(e => {
    const uploadImages = [];
    for (let i = 0; i < e.target.files.length; i += 1) {
      uploadImages.push(e.target.files[i]);
      setImages(uploadImages);
    }
  }, []);

  const onSubmit: SubmitHandler<CreateFormData> = async values => {
    try {
      await createProduct({
        name: values.name,
        description: values.description,
        price: values.price,
        debitPoints: values.debitPoints,
        creditPoints: values.creditPoints,
        photos: images,
      });

      reset();
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o produto',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      onSubmit={handleSubmit(onSubmit)}
      as="form"
      maxWidth={360}
      bg="gray.800"
      p="8"
      borderRadius={8}
      flexDir="column"
    >
      <Text fontSize="3xl">Novo Produto</Text>
      <Stack spacing="0.5">
        <Input name="name" label="Nome" {...register('name')} />
        <Input name="price" label="Preço" {...register('price')} />
        <Input
          name="description"
          label="Descrição"
          {...register('description')}
        />
        <Input
          name="debitPoints"
          label="Débito de Pontos"
          {...register('debitPoints')}
        />
        <Input
          name="creditPoints"
          label="Crédito de Pontos"
          {...register('creditPoints')}
        />
        <input type="file" multiple onChange={onFileChange} />
      </Stack>
      <Button type="submit" mt="6" colorScheme="orange" size="lg">
        Cadastrar
      </Button>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
