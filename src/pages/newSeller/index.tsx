import { Flex, Button, Stack, Heading, useToast, Text } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '../../components/Form/Input';
import { createSeller } from '../../services/hooks/useUsers';

type SignInFormData = {
  name: string;
  username: string;
  password: string;
  email: string;
  numberPhone: string;
  birthday: Date;
};

const signInFormSchema = yup.object().shape({
  name: yup.string().required('O nome necessário'),
  username: yup.string().required('O nome de usuário é necessário'),
  password: yup.string().required('A senha é necessária'),
  email: yup.string().email().required('O email é necessário'),
  numberPhone: yup.string().required('O numero de celular é necessário'),
  birthday: yup.date().required('A data de nascimento é necessária'),
});

function Login() {
  const [formSended, setFormSended] = useState(false);
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const toast = useToast();

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    try {
      await createSeller({
        name: values.name,
        username: values.username,
        password: values.password,
        email: values.email,
        numberPhone: values.numberPhone,
        birthday: values.birthday,
      });
      setFormSended(!formSended);
      toast({
        position: 'top',
        title: 'Sucesso!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Não foi possível acessar a plataforma',
        description: err.response?.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Head>
        <title>Novo Vendedor | Snap</title>
      </Head>
      <Flex flexDir="column" w="100vw" h="100vh" align="center">
        {!formSended ? (
          <Flex
            flexDir="column"
            w="100vw"
            h="100vh"
            align="center"
            justify="center"
          >
            <Flex alignItems="center" justify="center" flexDir="column">
              <Heading color="white">Zaycon</Heading>
              <Text>Seja um vendedor</Text>
            </Flex>
            <Flex
              onSubmit={handleSubmit(handleSignIn)}
              as="form"
              w="100%"
              maxWidth={[270, 270, 360]}
              bg="gray.800"
              p={['4', '4', '8']}
              borderRadius={8}
              flexDir="column"
            >
              <Stack spacing="4">
                <Input name="name" label="Nome" {...register('name')} />
                <Input
                  name="username"
                  label="Nome de usuário"
                  {...register('username')}
                />
                <Input
                  name="password"
                  type="password"
                  label="Senha"
                  {...register('password')}
                />
                <Input name="email" label="Email" {...register('email')} />
                <Input
                  name="numberPhone"
                  label="Celular"
                  {...register('numberPhone')}
                />
                <Input
                  name="birthday"
                  label="Data de nascimento"
                  type="date"
                  {...register('birthday')}
                />
              </Stack>
              <Button
                type="submit"
                mt={['4', '4', '6']}
                bg="orange"
                _hover={{ bg: '#953e00' }}
                color="white"
                size="lg"
              >
                Cadastrar
              </Button>

              <Link href="/admin">
                <Text mt="2rem" textAlign="center">
                  Já possuo uma conta
                </Text>
              </Link>
            </Flex>
          </Flex>
        ) : (
          <Flex w="30rem" mt="5rem" justify="center" flexDir="column">
            <Heading size="md" color="green">
              Sucesso!
            </Heading>
            <Text>
              Agora só precisamos que confirme o seu email para que o seu
              cadastro seja liberado!
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
}

export default Login;
