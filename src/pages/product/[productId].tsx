import { Box, Flex, Heading, Image, Spinner, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { api } from '../../services/apiClient';
import 'react-medium-image-zoom/dist/styles.css';
import { useProduct } from '../../services/hooks/useProducts';

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    creditPoints: number;
    debitPoints: number;
    photos: [
      {
        id: string;
        name: string;
        url: string;
      },
    ];
  };
}

export default function Product({ product }: ProductProps) {
  const [showImage, setShowImage] = useState('');

  const { data, isLoading, error, isFetching } = useProduct(product.slug);

  return (
    <Box>
      <Header />
      <Link href="/">
        <Flex w="80vw" justify="end">
          <Image
            ml="1rem"
            cursor="pointer"
            alignSelf={['end', 'end', 'flex-start']}
            w={['4rem', '4rem', '5rem']}
            src="../flexaSair.svg"
          />
        </Flex>
      </Link>
      <Flex minH="100vh" flexDir="column" justify="center" align="center">
        {(!isLoading && isFetching) || isLoading ? (
          <Spinner color="orange" />
        ) : error ? (
          <Text>Falha ao obter dados</Text>
        ) : (
          <Flex flexDir="column">
            <Heading>{data.name}</Heading>

            <Text w={['25rem', '25rem', '30rem']} fontSize="1.2rem" p="0.5rem">
              {data.description}
            </Text>
            <Flex flexDir={['column', 'column', 'row']}>
              {!data.photos[0] ? (
                <Box maxW={['350px', '350px', '650px']}>
                  <Image src="../imageNotFound.svg" />
                </Box>
              ) : (
                <Zoom overlayBgColorEnd="gray.900">
                  <Box maxW={['350px', '350px', '650px']}>
                    <Image
                      src={showImage === '' ? data.photos[0].url : showImage}
                    />
                  </Box>
                </Zoom>
              )}

              <Flex flexDir="column" justify="space-between" w="30rem">
                <Box bg="black" w="20rem" h="2rem">
                  <Text fontSize="4xl" bg="black">
                    R${data.price} ou {data.debitPoints} pontos
                  </Text>
                  <Text as="mark" fontSize="3xl">
                    Comprando {data.name}, você recebe {data.creditPoints}{' '}
                    pontos
                  </Text>
                </Box>

                <Flex mt="15rem" flexWrap="wrap" flexDir="row">
                  {data.photos.map(photo => (
                    <Image
                      key={photo.id}
                      cursor="pointer"
                      onClick={() => setShowImage(photo.url)}
                      p="0.3rem"
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
  const { productId } = params;

  const response = await api.get(`products/${productId}`);

  const product = response.data;

  return {
    props: { product },
  };
};
