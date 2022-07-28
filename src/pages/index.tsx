import {
  Box,
  Spinner,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Search } from '../components/Search';
import { useProducts } from '../services/hooks/useProducts';
import { useSearchProduct } from '../services/hooks/useSeachProducts';

export default function Home() {
  const { data, isLoading, error, isFetching } = useProducts();
  const { searchProduct } = useSearchProduct();
  return (
    <Box>
      <Header />
      <Search />
      <Flex justify="center" minH="70vh">
        <Grid
          templateColumns={[
            '1fr',
            '1fr',
            '1fr 1fr',
            '1fr 1fr',
            '1fr 1fr 1fr',
            '1fr 1fr 1fr 1fr',
            '1fr 1fr 1fr 1fr',
          ]}
        >
          {(!isLoading && isFetching) || isLoading ? (
            <Flex justify="center">
              <Spinner color="orange" />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados</Text>
            </Flex>
          ) : searchProduct.length ? (
            searchProduct.map(productFound => (
              <Link
                key={productFound.slug}
                href={`/product/${productFound.slug}`}
              >
                <Flex
                  key={productFound.id}
                  p="2rem"
                  flexDir="column"
                  alignItems="center"
                >
                  <Heading cursor="pointer">{productFound.name}</Heading>

                  <Image
                    cursor="pointer"
                    w="300px"
                    zIndex={1}
                    h="324.29px"
                    src={
                      !productFound.photos[0]
                        ? 'imageNotFound.svg'
                        : productFound.photos[0].url
                    }
                  />
                  <Box
                    cursor="pointer"
                    mt="-1rem"
                    zIndex={0}
                    bg="black"
                    p="1rem"
                    w="22rem"
                  >
                    <Text ml="2rem" align="center" fontSize="1.5rem">
                      R${productFound.price} ou {productFound.debitPoints}{' '}
                      pontos
                    </Text>
                    <Image
                      mt="-1.2rem"
                      ml="0.15rem"
                      w="3.5rem"
                      src="flexa.svg"
                    />
                    <Text
                      align="center"
                      ml="3rem"
                      mt="-2.2rem"
                      fontSize="1.5rem"
                    >
                      Recebe {productFound.creditPoints} pontos
                    </Text>
                  </Box>
                </Flex>
              </Link>
            ))
          ) : (
            data.map(product => (
              <Link key={product.slug} href={`/product/${product.slug}`}>
                <Flex
                  key={product.id}
                  p="2rem"
                  flexDir="column"
                  alignItems="center"
                >
                  <Heading cursor="pointer">{product.name}</Heading>

                  <Image
                    cursor="pointer"
                    w="300px"
                    zIndex={1}
                    h="324.29px"
                    src={
                      !product.photos[0]
                        ? 'imageNotFound.svg'
                        : product.photos[0].url
                    }
                  />
                  <Box
                    cursor="pointer"
                    mt="-1rem"
                    zIndex={0}
                    bg="black"
                    p="1rem"
                    w="22rem"
                  >
                    <Text ml="2rem" align="center" fontSize="1.5rem">
                      R${product.price} ou {product.debitPoints} pontos
                    </Text>
                    <Image
                      mt="-1.2rem"
                      ml="0.15rem"
                      w="3.5rem"
                      src="flexa.svg"
                    />
                    <Text
                      align="center"
                      ml="3rem"
                      mt="-2.2rem"
                      fontSize="1.5rem"
                    >
                      Recebe {product.creditPoints} pontos
                    </Text>
                  </Box>
                </Flex>
              </Link>
            ))
          )}
        </Grid>
      </Flex>
      <Footer />
    </Box>
  );
}
