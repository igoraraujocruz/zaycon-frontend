import {
  Box,
  Spinner,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  HStack,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Footer } from '../components/Footer';
import { SearchInput } from '../components/Form/SearchInput';
import { Header } from '../components/Header';
import { api } from '../services/apiClient';
import { Product, useProducts } from '../services/hooks/useProducts';

interface SearchProps {
  search: string;
}

export default function Home() {
  const { data, isLoading, error, isFetching } = useProducts();
  const { register, handleSubmit } = useForm();
  const [itemFilters, setItemFilters] = useState<Product[]>([]);

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/products?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex flexDir="column">
      <Header />
      <HStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        justify="center"
        align="center"
      >
        <SearchInput
          w="18rem"
          borderColor="gray.600"
          name="search"
          {...register('search', {
            onChange() {
              setItemFilters([]);
            },
          })}
        />
        <Button bg="orange" _hover={{ bg: 'orangeHover' }} type="submit">
          Procurar
        </Button>
      </HStack>
      <Flex justify="center" minH="70vh">
        {(!isLoading && isFetching) || isLoading ? (
          <Flex justify="center" align="center" mt="2rem">
            <Spinner color="orange" />
          </Flex>
        ) : error ? (
          <Text>Falha ao obter dados</Text>
        ) : itemFilters.length ? (
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
            {itemFilters.map(product => (
              <Link key={product.id} href={`/product/${product.slug}`}>
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
                        ? 'imageNotFound2.svg'
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
                    <Text align="center" fontSize="1.5rem">
                      R${product.price} ou {product.debitPoints} pontos
                    </Text>
                    <HStack justify="center">
                      <Text color="orange" align="center" fontSize="1.5rem">
                        Recebe
                      </Text>
                      <Text
                        align="center"
                        fontSize="1.5rem"
                        borderBottom="0.1rem solid #FF6B00"
                      >
                        {product.creditPoints} pontos
                      </Text>
                    </HStack>
                  </Box>
                </Flex>
              </Link>
            ))}
          </Grid>
        ) : (
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
            {data.products.map(product => (
              <Link key={product.id} href={`/product/${product.slug}`}>
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
                        ? 'imageNotFound2.svg'
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
                    <Text align="center" fontSize="1.5rem">
                      R${product.price} ou {product.debitPoints} pontos
                    </Text>
                    <HStack justify="center">
                      <Text color="orange" align="center" fontSize="1.5rem">
                        Recebe
                      </Text>
                      <Text
                        align="center"
                        fontSize="1.5rem"
                        borderBottom="0.1rem solid #FF6B00"
                      >
                        {product.creditPoints} pontos
                      </Text>
                    </HStack>
                  </Box>
                </Flex>
              </Link>
            ))}
          </Grid>
        )}
      </Flex>
      <Footer />
    </Flex>
  );
}
