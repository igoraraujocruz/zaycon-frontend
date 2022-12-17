import {
  Flex,
  Button,
  Stack,
  Heading,
  useToast,
  Text,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { useState } from 'react';
import { Input } from '../../components/Form/Input';
import { createSeller } from '../../services/hooks/useUsers';
import { MaskedInput } from '../../components/Form/MaskedInput';

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
  password: yup
    .string()
    .required('A senha é necessária')
    .min(6, 'Mínimo de 6 dígitos'),
  email: yup.string().email().required('O email é necessário'),
  numberPhone: yup
    .string()
    .required('Nº de Celular é obrigatório')
    .matches(
      /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
      'Número de telefone inválido',
    ),
  birthday: yup.date().required('A data de nascimento é necessária'),
});

function NewSeller() {
  const [formSended, setFormSended] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  const toast = useToast();

  const handleSignIn: SubmitHandler<SignInFormData> = async (
    values: SignInFormData,
  ) => {
    setFormSended(!formSended);
    try {
      await createSeller({
        name: values.name,
        username: values.username,
        password: values.password,
        email: values.email,
        numberPhone: values.numberPhone,
        birthday: values.birthday,
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
      <Flex flexDir="column" align="center">
        {!formSended ? (
          <Flex flexDir="column" align="center" justify="center">
            <Flex
              alignItems="center"
              mt="1rem"
              justify="center"
              flexDir="column"
            >
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
                <Input
                  name="name"
                  label="Nome"
                  error={errors.name}
                  {...register('name')}
                />
                <Input
                  name="username"
                  label="Nome de usuário"
                  error={errors.username}
                  {...register('username')}
                />
                <Input
                  name="password"
                  type="password"
                  label="Senha"
                  error={errors.password}
                  {...register('password')}
                />
                <Input
                  name="email"
                  label="Email"
                  error={errors.email}
                  {...register('email')}
                />
                <MaskedInput
                  label="Celular"
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
                  error={errors.numberPhone}
                  name="numberPhone"
                  {...register('numberPhone')}
                />
                <Input
                  name="birthday"
                  label="Data de nascimento"
                  type="date"
                  error={errors.birthday}
                  {...register('birthday')}
                />
              </Stack>
              <Flex justify="center" mt={['4', '4', '6']} h="2rem">
                {!formSended ? (
                  <Button
                    type="submit"
                    bg="orange"
                    _hover={{ bg: '#953e00' }}
                    color="white"
                    size="lg"
                  >
                    Cadastrar
                  </Button>
                ) : (
                  <Spinner size="lg" />
                )}
              </Flex>

              <Link href="/admin">
                <Text cursor="pointer" mt="2rem" textAlign="center">
                  Já possuo uma conta
                </Text>
              </Link>
            </Flex>
          </Flex>
        ) : (
          <Flex w="30rem" mt="5rem" justify="center" flexDir="column">
            <Heading size="md" color="green">
              Conta criada com sucesso!
            </Heading>
            <Text>
              Agora precisamos que você confirme seu email. Clique no link que
              te encaminhamos por email.
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
}

export default NewSeller;
