import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Flex,
  Stack,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/apiClient';

type SignInFormData = {
  email: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().email().required('O E-mail é obrigatório'),
});

export function ForgotPasswordModal() {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const toast = useToast();

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    setIsSendingEmail(true);
    try {
      await api.post('/sellers/forgotPassword', {
        email: values.email,
      });

      toast({
        title: 'E-mail enviado com sucesso.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setIsSendingEmail(false);
      onClose();
      reset();
    } catch (err) {
      setIsSendingEmail(false);
      toast({
        title: 'E-mail não pode ser enviado.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex mt="2rem" justify="center">
      <Text color="itemColor" onClick={onOpen} cursor="pointer">
        Esqueci minha senha
      </Text>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="itemColor" alignItems="center" textAlign="center">
          <ModalHeader fontSize="1.2rem" fontWeight="normal" color="#ffffff">
            Recuperação de senha
          </ModalHeader>
          <ModalCloseButton color="#fff" />
          <ModalBody>
            <Text color="#fff">
              Insira seu e-mail e clique em enviar para que receba as instruções
              de recuperação de senha.
            </Text>
            <Flex
              onSubmit={handleSubmit(handleSignIn)}
              as="form"
              p="8"
              borderRadius={8}
              flexDir="column"
            >
              <Stack spacing="4">
                <Input name="email" {...register('email')} />
              </Stack>
              <Flex h="3rem" mt="1rem" justify="center" align="center">
                {!isSendingEmail ? (
                  <Button
                    type="submit"
                    mt="6"
                    bg="#04070D"
                    _hover={{ bg: '04070D' }}
                    color="white"
                    size="lg"
                  >
                    Enviar
                  </Button>
                ) : (
                  <Spinner size="lg" color="#fff" />
                )}
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              color="#fff"
              bg="#04070D"
              _hover={{ bg: '#04070D' }}
              onClick={onClose}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
