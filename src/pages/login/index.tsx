import { Flex, Button, Stack, Image, Heading } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    await signIn({
      username: values.username,
      password: values.password,
    });
  };
  return (
    <Flex flexDir="column" w="100vw" h="100vh" align="center" justify="center">
      <Flex alignItems="center">
        <Image
          mt="2rem"
          mb="2rem"
          maxW={[225, 225, 300]}
          src="../logo.svg"
          sizes="10rem"
          alt="Snap Logo"
        />
        <Heading ml={-4} color="white">
          oints
        </Heading>
      </Flex>
      <Flex
        onSubmit={handleSubmit(handleSignIn)}
        as="form"
        w="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Input name="username" label="Username" {...register('username')} />
          <Input name="password" label="Senha" {...register('password')} />
        </Stack>
        <Button
          type="submit"
          mt="6"
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
  );
}

export default Login;

export const getServerSideProps = withSSRGuest(async ctx => ({
  props: {},
}));
