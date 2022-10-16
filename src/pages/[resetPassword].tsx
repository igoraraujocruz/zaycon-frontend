import { Button, Flex, Image, useToast, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { Input } from "../components/Form/Input";
import { resetPassword } from "../services/hooks/useUsers";
import { RiLockPasswordLine } from 'react-icons/ri'
import Router from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type ValuesProps = {
  newPassword: string;
  newPasswordConfirm: string;
}

type TokenProps = {
  token: string;
}

const schema = yup.object().shape({
  newPassword: yup.string().min(5, 'Mínimo de 5 dígitos').required('A nova senha é obrigatória'),
  newPasswordConfirm: yup.string().min(5 , 'Mínimo de 5 dígitos').required('A Confirmação da nova senha é obrigatória'),
});

export default function ResetPassword ({token}: TokenProps) {
  const { handleSubmit, register, formState: { errors } } = useForm<ValuesProps>({
    resolver: yupResolver(schema),
  })
  const toast = useToast();

  const onSubmit = async (values: ValuesProps) => {
    try {
      await resetPassword(token, values.newPassword, values.newPasswordConfirm)
      toast({
        title: 'Senha alterada com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      Router.push('/admin')
    } catch(error) {
      toast({
        title: 'Sua senha não pode ser alterada',
        description: error.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
    
  }

    return (
      <Flex  w="100vw" flexDir={'column'} h="100vh" justify={'center'} align={'center'}>
          <Image w={'10rem'} src="../logo.svg"/>
        <VStack mt={'2rem'} as={'form'} p="8"
        borderRadius={8} onSubmit={handleSubmit(onSubmit)} bg="gray.800" w={'23rem'}>
          <Input icon={RiLockPasswordLine} error={errors.newPassword} type={'password'} label="Nova Senha" name='newPassword' {...register('newPassword')} />
          <Input icon={RiLockPasswordLine} error={errors.newPasswordConfirm} type={'password'} label="Confirme a nova senha" name='newPasswordConfirm' {...register('newPasswordConfirm')} />
          <Button bg={'orange'} _hover={{ bg: '#FF4500' }} type="submit">Salvar nova Senha</Button>
        </VStack>
      </Flex>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { token } = query;
  
    return {
      props: { token },
    };
  };
  