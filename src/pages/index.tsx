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
  useToast,
  useMediaQuery,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiShoppingCart } from 'react-icons/fi';
import { GrInstagram } from 'react-icons/gr';
import io from 'socket.io-client';
import nookies from 'nookies';
import { SearchInput } from '../components/Form/SearchInput';
import { api } from '../services/apiClient';
import { Product, useProducts } from '../services/hooks/useProducts';
import TesteDetailsProductModal, {
  DetailsProductModalHandle,
} from '../components/Modais/DetailsProductModal';
import BagModal, { IBagModal } from '../components/Modais/BagModal';
import { useCart } from '../services/hooks/useCart';
import { WhatsApp } from '../components/Whatsapp';

interface SearchProps {
  search: string;
}

export default function Home() {
  const { addToCart } = useCart();
  const [isNotLargerThan500] = useMediaQuery('(max-width: 500px)');
  const toast = useToast();
  const { data, isLoading, error, isFetching } = useProducts();
  const { register, handleSubmit } = useForm();
  const [itemFilters, setItemFilters] = useState<Product[]>([]);
  const [product, setProduct] = useState({} as Product);

  const modalDetails = useRef<DetailsProductModalHandle>(null);
  const bagModal = useRef<IBagModal>(null);

  const openUploadModal = useCallback((product: Product) => {
    setProduct(product);
    modalDetails.current.onOpen();
  }, []);

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/products?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      // fine
    }
  };

  const saveOnCookie = (product: Product) => {
    toast({
      position: 'bottom-right',
      title: 'Adicionado no carrinho de compras',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    addToCart(product);
  };

  return (
    <>
      <Head>
        <title>Loja | Zaycon</title>
      </Head>
      <Flex flexDir="column" w="100%">
        <BagModal ref={bagModal} />
        <WhatsApp />
        <TesteDetailsProductModal product={product} ref={modalDetails} />
        <HStack h="4rem" spacing="1rem" w="100%" pr="2rem" justify="end">
          <Text>Zaycon</Text>
          <Link href="https://www.instagram.com/zaycon.connect">
            <Flex cursor="pointer">
              <GrInstagram color="white" size={isNotLargerThan500 ? 28 : 35} />
            </Flex>
          </Link>
          <Link href="/newSeller">
            <Text cursor="pointer" fontFamily="Anek Devanagari">
              Quero ser um vendedor
            </Text>
          </Link>
          <Link href="/admin">
            <Text cursor="pointer" fontFamily="Anek Devanagari">
              Login
            </Text>
          </Link>
        </HStack>

        <HStack
          mt={['2rem', '2rem', '0rem']}
          pr="1rem"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          justify="end"
          align="center"
        >
          <SearchInput
            w={['11rem', '11rem', '15rem', '18rem']}
            borderColor="gray.600"
            border="0.1rem solid black"
            name="search"
            {...register('search', {
              onChange() {
                setItemFilters([]);
              },
            })}
          />
          <Button bg="#000" _hover={{ bg: 'orangeHover' }} type="submit">
            Procurar
          </Button>
        </HStack>
        <Flex justify="center" minH="70vh">
          {(!isLoading && isFetching) || isLoading ? (
            <Flex justify="center" align="center">
              <Spinner color="orange" />
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center">
              <Text>Falha ao obter dados</Text>
            </Flex>
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
                <Flex
                  key={product.id}
                  p="2rem"
                  flexDir="column"
                  alignItems="center"
                >
                  <Heading cursor="pointer">{product.name}</Heading>

                  <Image
                    onClick={() => openUploadModal(product)}
                    cursor="pointer"
                    w="300px"
                    zIndex={1}
                    h="324.29px"
                    src={
                      !product.photos[0]
                        ? 'placeholder.png'
                        : product.photos[0].url
                    }
                  />
                  <Box
                    cursor="pointer"
                    mt="-1rem"
                    zIndex={0}
                    bg="black"
                    p="1rem"
                  >
                    <Text align="center" fontSize="1.5rem">
                      R${product.price}
                    </Text>
                    <HStack justify="center">
                      <Text color="orange" align="center" fontSize="1.5rem">
                        Recebe
                      </Text>
                    </HStack>
                  </Box>
                </Flex>
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
                <Flex
                  key={product.id}
                  p="2rem"
                  flexDir="column"
                  alignItems="center"
                >
                  <Text fontSize="2xl" cursor="pointer">
                    {product.name}
                  </Text>

                  <Image
                    onClick={() => openUploadModal(product)}
                    cursor="pointer"
                    w={['250px', '250px', '300px']}
                    zIndex={1}
                    h="324.29px"
                    src={
                      !product.photos[0]
                        ? 'placeholder.png'
                        : product.photos[0].url
                    }
                  />
                  <Text
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    mt="0.5rem"
                    w={['15.7rem', '15.7rem', '18.8rem']}
                    maxH="5rem"
                  >
                    {product.description}
                  </Text>
                  <HStack mt="1rem" spacing="0.5rem" align="center">
                    <Text align="center" fontSize="1.5rem">
                      R${String(product.price).replace('.', ',')}
                    </Text>
                    <Flex
                      p="0.5rem"
                      borderRadius="0.2rem"
                      onClick={() => saveOnCookie(product)}
                      cursor="pointer"
                      align="center"
                      fontFamily="Anek Devanagari"
                      bg="gray.800"
                    >
                      <Text>Comprar</Text>
                      <FiShoppingCart cursor="pointer" size={30} />
                    </Flex>
                  </HStack>
                </Flex>
              ))}
            </Grid>
          )}
        </Flex>
      </Flex>
    </>
  );
}
