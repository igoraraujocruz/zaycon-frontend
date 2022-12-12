import { Button, Flex, Heading, useToast, VStack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Head from 'next/head';
import { Input } from '../components/Form/Input';
import { api } from '../services/apiClient';

type ValuesProps = {
  newPassword: string;
  newPasswordConfirm: string;
};

type TokenProps = {
  token: string;
};

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, 'Mínimo de 6 dígitos')
    .required('A nova senha é obrigatória'),
  newPasswordConfirm: yup
    .string()
    .min(6, 'Mínimo de 6 dígitos')
    .required('A Confirmação da nova senha é obrigatória'),
});

export default function ResetPassword({ token }: TokenProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValuesProps>({
    resolver: yupResolver(schema),
  });
  const toast = useToast();

  const onSubmit = async (values: ValuesProps) => {
    try {
      await api.post(`/sellers/reset/${token}`, {
        password: values.newPassword,
        password_confirmation: values.newPasswordConfirm,
      });

      toast({
        title: 'Senha alterada com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      Router.push('/admin');
    } catch (error) {
      toast({
        title: 'Sua senha não pode ser alterada',
        description: error.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Resetar Senha | Snap</title>
      </Head>
      <Flex
        w="100vw"
        flexDir="column"
        h="100vh"
        justify="center"
        align="center"
      >
        <Heading>Zaycon</Heading>
        <VStack
          mt="2rem"
          as="form"
          p="8"
          borderRadius={8}
          onSubmit={handleSubmit(onSubmit)}
          bg="gray.800"
          w="23rem"
        >
          <Input
            icon={RiLockPasswordLine}
            error={errors.newPassword}
            type="password"
            label="Nova Senha"
            name="newPassword"
            {...register('newPassword')}
          />
          <Input
            icon={RiLockPasswordLine}
            error={errors.newPasswordConfirm}
            type="password"
            label="Confirme a nova senha"
            name="newPasswordConfirm"
            {...register('newPasswordConfirm')}
          />
          <Button bg="orange" _hover={{ bg: '#FF4500' }} type="submit">
            Salvar nova Senha
          </Button>
        </VStack>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { token } = query;

  return {
    props: { token },
  };
};
