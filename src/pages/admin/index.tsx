import {
  Flex,
  Button,
  Stack,
  Image,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlineUser } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import Head from 'next/head';
import { Input } from '../../components/Form/Input';
import { useAuth } from '../../services/hooks/useAuth';
import { withSSRGuest } from '../../utils/WithSSRGuest';
import { ForgotPasswordModal } from '../../components/Modais/ForgotPasswordModal';

type SignInFormData = {
  username: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  username: yup.string().required('Username obrigatório'),
  password: yup.string().required('Senha obrigatória'),
});

function Login() {
  const { signIn } = useAuth();

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const toast = useToast();

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    try {
      await signIn({
        username: values.username,
        password: values.password,
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
        <title>Admin | Snap</title>
      </Head>
      <Flex
        flexDir="column"
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        bg="itemColor"
      >
        <Flex alignItems="center">
          <Heading color="white">Zaycon</Heading>
        </Flex>
        <Flex
          onSubmit={handleSubmit(handleSignIn)}
          as="form"
          w="100%"
          maxWidth={[270, 270, 360]}
          p={['4', '4', '8']}
          borderRadius={8}
          flexDir="column"
          bg="#E5E5E5"
        >
          <Stack color="itemColor">
            <Input
              color="itemColor"
              icon={AiOutlineUser}
              name="username"
              label="Username"
              border="0.1rem solid"
              borderColor="itemColor"
              {...register('username')}
            />
            <Input
              color="itemColor"
              icon={RiLockPasswordLine}
              name="password"
              type="password"
              label="Senha"
              border="0.1rem solid"
              borderColor="itemColor"
              {...register('password')}
            />
          </Stack>
          <Button
            type="submit"
            mt={['4', '4', '6']}
            bg="itemColor"
            _hover={{ bg: 'itemColor' }}
            color="white"
            size="lg"
          >
            Entrar
          </Button>

          <ForgotPasswordModal />
        </Flex>
      </Flex>
    </>
  );
}

export default Login;

export const getServerSideProps = withSSRGuest(async ctx => ({
  props: {},
}));
