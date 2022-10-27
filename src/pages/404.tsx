import { Flex, Text } from '@chakra-ui/react';
import Head from 'next/head';

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 Página não encontrada</title>
      </Head>
      <Flex h="100vh" align="center" justify="center">
        <Text>Página não encontrada</Text>
      </Flex>
    </>
  );
};

export default NotFound;
