import {
  Button,
  Flex,
  Grid,
  Stack,
  Text,
  useToast,
  Checkbox
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUser } from '../../../services/hooks/useUsers';
import { Input } from '../../../components/Form/Input';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { ReactElement, useEffect, useState } from 'react';
import { api } from '../../../services/apiClient';
import InputMask from 'react-input-mask'

type CreateFormData = {
  name: string;
  mobilePhone: string;
  email: string;
  username: string;
  password: string;
  permissions: string[];
};

type Permission = {
  id: string;
  name: string;
}

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  mobilePhone: yup.string().required('Nº de Celular é obrigatório').matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/, 'Número de telefone inválido'),
  email: yup.string().required('Email é obrigatório').email(),
  username: yup.string().required('Nome é obrigatório'),
  password: yup.string().required('Nome é obrigatório').min(5),
});

export function CreateUser() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(createFormSchema)
  });

  const [permissions, setPermissions] = useState<Permission[]>([])

    useEffect(() => {
        api.get('/permissions')
        .then(response => setPermissions(response.data))
      }, [])
    
  
  const toast = useToast();
  const onSubmit: SubmitHandler<CreateFormData> = async (values: CreateFormData) => {
    const removeAllFalsyValues = [
      values['Listar Produto'] === true && 'Listar Produto',
      values['Editar Produto'] === true && 'Editar Produto',
      values['Cadastrar Produto'] === true && 'Cadastrar Produto',
      values['Deletar Produto'] === true && 'Deletar Produto',
      values['Listar Cliente'] === true && 'Listar Cliente',
      values['Editar Cliente'] === true && 'Editar Cliente',
      values['Cadastrar Cliente'] === true && 'Cadastrar Cliente',
      values['Deletar Cliente'] === true && 'Deletar Cliente',
      values['Listar Usuario'] === true && 'Listar Usuario',
      values['Editar Usuario'] === true && 'Editar Usuario',
      values['Cadastrar Usuario'] === true && 'Cadastrar Usuario',
      values['Deletar Usuario'] === true && 'Deletar Usuario',
    ].filter(Boolean)
    try {
      await createUser({
        name: values.name,
        username: values.username,
        password: values.password,
        mobilePhone: values.mobilePhone.replace(/\D/g, ''),
        email: values.email,
        permissions: removeAllFalsyValues
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
      borderRadius={8}
      flexDir="column"
    >
      <Text fontSize="2xl">Novo Usuário</Text>

      <Stack spacing="0.5">
        <Input name="name" label="Nome" {...register('name')} />
        <Input name="username" label="Username" {...register('username')} />
        <Input name="password"  type={'password'} label="Senha" {...register('password')} />
        <Input name="email" label="E-mail" {...register('email')} />
        <Input name="mobilePhone" label="Celular"
          as={InputMask}
         mask="(99) 99999-9999"
         placeholder="(DD) 99999-9999"
         {...register('mobilePhone')} />
      </Stack>
      <Grid templateColumns='repeat(3, 1fr)' columnGap={3} rowGap={2} mb={'2rem'}>
      {permissions.map(
              (permission): ReactElement => {
                return (
                  <Controller
                    control={control}
                    name={permission.name}
                    key={permission.id}
                    defaultValue={false}
                    render={({ field: { onChange, value, ref } }) => (
                      <Checkbox
                        onChange={onChange}
                        textTransform="capitalize"
                        ref={ref}
                        isChecked={value}
                      >
                        {permission.name}
                      </Checkbox>
                    )}
                  />
                );
              }
            )}
      </Grid>
      <Button bg={'#FF6B00'} _hover={{bg: 'orangeHover'}} type="submit" size="lg">
        Cadastrar
      </Button>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => ({
  props: {},
}));
