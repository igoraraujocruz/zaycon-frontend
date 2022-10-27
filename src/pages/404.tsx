import { Flex, Image, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 Página não encontrada</title>
      </Head>
      <Flex flexDir="column" h="100vh" align="center" justify="center">
        <Text fontSize={['1rem', '1rem', '2rem']}>Página não encontrada</Text>
        <Image
          w={['10rem', '10rem', '20rem']}
          src="esqueletoPageNotFound.svg"
        />
        <Link href="/">
          <Text
            fontSize={['1rem', '1rem', '2rem']}
            color="orange"
            cursor="pointer"
            mt="2rem"
          >
            Clique aqui para voltar para a loja!
          </Text>
        </Link>
      </Flex>
    </>
  );
};

export default NotFound;
