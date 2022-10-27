import {
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import Head from 'next/head';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import 'react-medium-image-zoom/dist/styles.css';
import { ProductSlug, useProduct } from '../../services/hooks/useProducts';

export default function Product(productSlug: ProductSlug) {
  const [showImage, setShowImage] = useState('');

  const { data, isLoading, error, isFetching } = useProduct(productSlug);

  return (
    <>
      <Head>
        <title>{data?.name || 'Produto'} | Snap</title>
      </Head>
      <Box>
        <Header />
        <Flex w={['95vw', '95vw', '80vw']} justify="flex-end">
          <Link href="/">
            <Image
              cursor="pointer"
              alignSelf={['end', 'end', 'flex-start']}
              w={['3rem', '4rem', '6rem']}
              src="../flexaSair.svg"
            />
          </Link>
        </Flex>

        <Flex minH="50vh" flexDir="column" justify="center" align="center">
          {(!isLoading && isFetching) || isLoading ? (
            <Spinner color="orange" />
          ) : error ? (
            <Text>Falha ao obter dados</Text>
          ) : (
            <Flex flexDir="column" align={['center', 'center', 'flex-start']}>
              <Heading fontSize={['2xl', '4xl']}>{data.name}</Heading>
              <Text
                w={['17.4rem', '17.4rem', '22.2rem', '33.8rem']}
                fontSize={['0.8rem', '1.2rem']}
              >
                {data.description}
              </Text>
              <Flex
                flexDir={['column', 'column', 'row']}
                align={['center', 'center', 'flex-start']}
              >
                {!data.photos[0] ? (
                  <Box maxW={['350px', '350px', '650px']}>
                    <Image w={['90vw']} src="../imageNotFound2.svg" />
                  </Box>
                ) : (
                  <Zoom overlayBgColorEnd="gray.900">
                    <VStack spacing={0} mb="2rem">
                      <Image
                        border="0.5rem solid #FF6B00"
                        maxH={['50vh', '50vh', '75vh']}
                        src={showImage === '' ? data.photos[0].url : showImage}
                      />
                      <Text
                        p={['1.3rem', '1.3rem']}
                        flexWrap="wrap"
                        fontSize={['1.5rem', '2xl', '3xl']}
                        bg="black"
                      >
                        R${data.price} ou {data.debitPoints} pontos
                      </Text>
                      <Text
                        p={['1rem', '1rem']}
                        border="0.5rem solid black"
                        flexWrap="wrap"
                        as="mark"
                        fontSize={['0.8rem', '1rem', '2xl']}
                      >
                        Comprando {data.name}, você recebe {data.creditPoints}{' '}
                        pontos
                      </Text>
                    </VStack>
                  </Zoom>
                )}
                <Flex
                  flexWrap="wrap"
                  mt="1rem"
                  mb="1rem"
                  justify="center"
                  flexDir="row"
                  gap={2}
                  p={2}
                >
                  {data.photos.map(photo => (
                    <Image
                      _hover={{ opacity: 1 }}
                      transition="opacity 200ms"
                      key={photo.id}
                      opacity={0.9}
                      cursor="pointer"
                      onClick={() => setShowImage(photo.url)}
                      borderRadius="1rem 1rem 0"
                      w={['6rem', '11rem']}
                      src={photo.url}
                    />
                  ))}
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
        <Footer />
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { productSlug } = params;

  return {
    props: { productSlug },
  };
};
