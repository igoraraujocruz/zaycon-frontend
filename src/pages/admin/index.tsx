import {
  Flex,
  Button,
  Stack,
  Image,
  Heading,
  useToast,
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
      >
        <Flex alignItems="center">
          <Image
            mt="2rem"
            mb="2rem"
            maxW={[180, 180, 225, 300]}
            src="../logo.svg"
            sizes="10rem"
            alt="Snap Logo"
          />
          <Heading ml={[-2, -2, -4]} color="white">
            oints
          </Heading>
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
              icon={AiOutlineUser}
              name="username"
              label="Username"
              {...register('username')}
            />
            <Input
              icon={RiLockPasswordLine}
              name="password"
              type="password"
              label="Senha"
              {...register('password')}
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
