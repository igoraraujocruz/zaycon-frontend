import {
  Button,
  Flex,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClients } from '../../../services/hooks/useClients';
import { Input } from '../../../components/Form/Input';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { css } from '@emotion/react';

type CreateFormData = {
  name: string;
  cpf: string;
  birthday: string;
  mobilePhone: string;
  email: string;
};

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('Cpf é obrigatório').min(11).max(11),
  birthday: yup.string().required('Data de Nascimento é obrigatório'),
  mobilePhone: yup.string().required('Nº de Celular é obrigatório').min(11).max(11),
  email: yup.string().required('Email é obrigatório').email(),
});

export function CreateClients() {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<CreateFormData> = async values => {
    try {
      await createClients({
        name: values.name,
        cpf: values.cpf,
        birthday: values.birthday,
        mobilePhone: values.mobilePhone,
        email: values.email,
      });

      reset();
      toast({
        title: 'Cliente cadastrado com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o cliente',
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
      w={400}
      maxWidth={500}
      bg="gray.800"
      p="8"
      borderRadius={8}
      flexDir="column"
    >
      <Text fontSize="3xl">Novo Cliente</Text>

      <Stack spacing="0.5">
        <Input name="name" label="Nome" {...register('name')} />
        <Input name="cpf" label="Cpf" {...register('cpf')} />
        <Input
          type="date"
          name="birthday"
          label="Data da Nascimento"
          css={css`
                        ::-webkit-calendar-picker-indicator {
                            background: url(https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/calendar-16.png) center/80% no-repeat;
                            color: black;
                        }
                    `}
          {...register('birthday')}
        />
        <Input
          name="mobilePhone"
          label="Nº de celular"
          {...register('mobilePhone')}
        />
        <Input name="email" label="Email" {...register('email')} />
      </Stack>
      <Button bg={'#FF6B00'} _hover={{bg: 'orangeHover'}} type="submit" mt="6" size="lg">
        Cadastrar
      </Button>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
