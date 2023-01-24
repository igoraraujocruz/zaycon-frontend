import {
  Flex,
  Button,
  Stack,
  Heading,
  useToast,
  Text,
  Link,
  Spinner,
  Image,
  Box,
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
  username: yup
    .string()
    .required('O nome de usuário é necessário')
    .matches(/^[a-zA-Z0-9]+$/, 'não é permitido espaço e caracteres especiais'),
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
    setFormSended(true);
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
        title: 'Não foi possível registrar-se',
        description: err.response?.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setFormSended(false);
    }
  };
  return (
    <Flex>
      <Head>
        <title>Novo Vendedor | Snap</title>
      </Head>
      <Flex
        w="100vw"
        flexDir={['column', 'column', 'row']}
        bg="gray.600"
        bgImage="vendedor.jpg"
        h={['100%', '100%', '100vh']}
        bgSize={['contain', 'contain', 'contain', 'cover']}
        bgRepeat="no-repeat"
        justify="space-between"
        align="center"
      >
        <Flex
          flexDir="column"
          color={['#fff', '#fff', 'gray.800']}
          w={['20rem', '20rem', '45rem']}
          mt={['18rem', '18rem', 0]}
          ml={[0, 0, '5rem']}
          align="center"
        >
          <Heading fontSize={['2rem', '2rem', '2rem', '8rem']}>
            Seja um vendedor
          </Heading>
          <Text
            fontSize={['1.5rem', '1.5rem', '1.5rem', '3rem']}
            fontWeight="600"
          >
            Trabalhe como e onde quiser...
          </Text>
          <Text
            fontSize={['1.5rem', '1.5rem', '1.5rem', '2rem']}
            w={['15rem', '15rem', '30rem']}
            fontWeight="600"
          >
            Você acumula pontos que podem ser trocados por dinheiro ou produtos.
          </Text>
        </Flex>
        {!formSended ? (
          <Stack
            onSubmit={handleSubmit(handleSignIn)}
            as="form"
            color="#fff"
            bg="gray.700"
            borderRadius={8}
            p="2rem"
            mr={[0, 0, 0, '15rem']}
            w={['19rem', '19rem', '25rem']}
            mb={['2rem', '2rem', 0]}
          >
            <Heading>Registre-se aqui 👇</Heading>
            <Input
              color="black"
              name="name"
              label="Nome"
              error={errors.name}
              {...register('name')}
            />
            <Input
              color="black"
              name="username"
              label="Nome de usuário"
              error={errors.username}
              {...register('username')}
            />
            <Input
              color="black"
              name="password"
              type="password"
              label="Senha"
              error={errors.password}
              {...register('password')}
            />
            <Input
              color="black"
              name="email"
              label="Email"
              error={errors.email}
              {...register('email')}
            />
            <MaskedInput
              color="black"
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
              color="black"
              name="birthday"
              label="Data de nascimento"
              type="date"
              error={errors.birthday}
              {...register('birthday')}
            />
            <Flex justify="center" mt={['4', '4', '6']} h="2rem">
              {!formSended ? (
                <Button
                  mt="1rem"
                  type="submit"
                  bg="#04070D"
                  _hover={{ bg: '#04070D' }}
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
              <Text cursor="pointer" mt="3rem" textAlign="center">
                Já possuo uma conta
              </Text>
            </Link>
          </Stack>
        ) : (
          <Flex
            bg="gray.700"
            borderRadius={8}
            p="2rem"
            mr="15rem"
            w="30rem"
            mt="5rem"
            justify="center"
            flexDir="column"
          >
            <Heading size="md" color="white">
              Conta criada com sucesso!
            </Heading>
            <Text color="white">
              Agora precisamos que você confirme seu email. Clique no link que
              te encaminhamos por email.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default NewSeller;
