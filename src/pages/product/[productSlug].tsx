import { Box, Flex, Heading, Image, Spinner, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import 'react-medium-image-zoom/dist/styles.css';
import { ProductSlug, useProduct } from '../../services/hooks/useProducts';

export default function Product(productSlug: ProductSlug) {
  const [showImage, setShowImage] = useState('');

  const { data, isLoading, error, isFetching } = useProduct(productSlug);

  return (
    <Box>
      <Header />

      <Flex w="80vw" justify="end">
        <Link href="/">
          <Image
            ml="1rem"
            cursor="pointer"
            alignSelf={['end', 'end', 'flex-start']}
            w={['4rem', '4rem', '5rem']}
            src="../flexaSair.svg"
          />
        </Link>
      </Flex>

      <Flex minH="100vh" flexDir="column" justify="center" align="center">
        {(!isLoading && isFetching) || isLoading ? (
          <Spinner color="orange" />
        ) : error ? (
          <Text>Falha ao obter dados</Text>
        ) : (
          <Flex flexDir="column" align={['center', 'center', 'flex-start']}>
            <Heading>{data.name}</Heading>

            <Text w={['25rem', '25rem', '30rem']} fontSize="1.2rem" p="0.5rem">
              {data.description}
            </Text>
            <Flex h="100vh" flexDir={['column', 'column', 'row']} align={['center', 'center', 'flex-start']}>
              {!data.photos[0] ? (
                <Box maxW={['350px', '350px', '650px']}>
                  <Image w={'50rem'} src="../imageNotFound2.svg" />
                </Box>
              ) : (
                <Zoom overlayBgColorEnd="gray.900">
                  <Box h="40rem" maxW={['350px', '350px', '650px']}>
                    <Image
                      maxH={"70vh"}
                      w={['90vw']}
                      src={showImage === '' ? data.photos[0].url : showImage}
                    />
                    <Text fontSize={['1.5rem', '1.5rem', '4xl']} bg="black">
                    R${data.price} ou {data.debitPoints} pontos
                  </Text>
                  <Text as="mark" fontSize={['1.2rem', '1.2rem', '3xl']}>
                    Comprando {data.name}, você recebe {data.creditPoints}{' '}
                    pontos
                  </Text>
                  </Box>
                </Zoom>
              )}

              <Flex flexDir="column" justify="space-between" w="30rem" align={['center', 'center', 'flex-start']}>
                <Flex flexWrap="wrap" flexDir="row">
                  {data.photos.map(photo => (
                    <Image
                    _hover={{ opacity: 1 }} transition="opacity 200ms"
                      mr='0.5rem'
                      ml={['0', '0', '1rem']}
                      mb='0.5rem'
                      key={photo.id}
                      opacity={0.9}
                      cursor="pointer"
                      onClick={() => setShowImage(photo.url)}
                      borderRadius={'1rem 1rem 0'}
                      w="7rem"
                      h="7rem"
                      src={photo.url}
                    />
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
     <Footer />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { productSlug } = params;

  return {
    props: { productSlug },
  };
};
