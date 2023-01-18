import { Button, Flex, Heading, Link, Text } from '@chakra-ui/react';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { api } from '../services/apiClient';

type TokenProps = {
  token: string;
};

export default function EmailConfirmation({ token }: TokenProps) {
  useEffect(() => {
    async function Confirmation() {
      try {
        await api.post(`/sellers/confirmEmail/${token}`);
      } catch (err) {
        console.log(err);
      }
    }

    Confirmation();
  }, [token]);

  return (
    <>
      <Head>
        <title>Confirmação de Email | Zaycon</title>
      </Head>
      <Flex
        w="100vw"
        flexDir="column"
        h="100vh"
        justify="center"
        align="center"
        bg="itemColor"
      >
        <Flex
          w="30rem"
          mt="5rem"
          align="center"
          justify="center"
          flexDir="column"
          color="white"
        >
          <Heading>Zaycon</Heading>
          <Text>Email Confirmado com Sucesso</Text>
          <Text>Agora você pode acessar a plataforma do vendedor</Text>
          <Link href="/admin">
            <Button
              fontSize="0.8rem"
              bg="white"
              size={['xs', 'md']}
              _hover={{ bg: 'white' }}
              color="itemColor"
            >
              Clique aqui para acessar a plataforma
            </Button>
          </Link>
        </Flex>
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
