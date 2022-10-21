import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClients } from '../../../services/hooks/useClients';
import { Input } from '../../../components/Form/Input';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { MaskedInput } from '../../../components/Form/MaskedInput';

type CreateFormData = {
  name: string;
  cpf: string;
  birthday: string;
  mobilePhone: string;
  email: string;
};

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  cpf: yup
    .string()
    .required('Cpf é obrigatório')
    .matches(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/, 'CPF Invalido'),
  birthday: yup.string().required('Data de Nascimento é obrigatório'),
  mobilePhone: yup
    .string()
    .required('Nº de Celular é obrigatório')
    .matches(
      /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
      'Número de telefone inválido',
    ),
  email: yup.string().required('Email é obrigatório').email(),
});

export function CreateClients() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(createFormSchema),
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<CreateFormData> = async (
    values: CreateFormData,
  ) => {
    try {
      await createClients({
        name: values.name,
        cpf: values.cpf.replace(/\D/g, ''),
        birthday: values.birthday,
        mobilePhone: values.mobilePhone.replace(/\D/g, ''),
        email: values.email,
      });

      reset();
      toast({
        title: 'Cliente cadastrado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o cliente',
        description: error.response.data.message,
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
      maxWidth={500}
      bg="gray.800"
      p="8"
      h="39rem"
      borderRadius={8}
      flexDir="column"
    >
      <Text fontSize="2xl">Novo Cliente</Text>

      <Stack spacing="0.5">
        <Input
          name="name"
          error={errors.name}
          label="Nome"
          {...register('name')}
        />
        <MaskedInput
          mask={[
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
          ]}
          name="cpf"
          error={errors.cpf}
          label="Cpf"
          {...register('cpf')}
        />
        <Input
          error={errors.birthday}
          type="date"
          name="birthday"
          label="Data da Nascimento"
          max="2999-12-31"
          {...register('birthday')}
        />
        <MaskedInput
          mask={[
            '(',
            /\d/,
            /\d/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]}
          error={errors.mobilePhone}
          name="mobilePhone"
          label="Celular"
          {...register('mobilePhone')}
        />
        <Input
          error={errors.email}
          name="email"
          label="Email"
          {...register('email')}
        />
      </Stack>
      <Button
        bg="#FF6B00"
        _hover={{ bg: 'orangeHover' }}
        type="submit"
        mt="6"
        size="lg"
      >
        Cadastrar
      </Button>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
