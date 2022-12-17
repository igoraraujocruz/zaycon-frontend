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
  Link,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiShoppingCart } from 'react-icons/fi';
import { GrInstagram } from 'react-icons/gr';
import { SearchInput } from '../components/Form/SearchInput';
import { api } from '../services/apiClient';
import { Product, useProducts } from '../services/hooks/useProducts';
import DetailsProductModal, {
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
        <DetailsProductModal product={product} ref={modalDetails} />
        <HStack h="4rem" w="100%" spacing="0.8rem" justify="center">
          <Link href="https://www.instagram.com/zaycon.connect" isExternal>
            <Flex cursor="pointer">
              <GrInstagram color="white" size={25} />
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

        <Flex justify="center" mt={['2rem', '2rem', 0]}>
          <Heading>Zaycon</Heading>
        </Flex>

        <Flex justify="center" minH="50vh" mt="1rem">
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
              {data.map(product => (
                <Flex flexDir="column" alignItems="center">
                  <Flex
                    cursor="pointer"
                    onClick={() => openUploadModal(product)}
                    key={product.id}
                    pt="2rem"
                    pl="2rem"
                    pr="2rem"
                    flexDir="column"
                    alignItems="center"
                  >
                    <Text w="15rem" fontWeight="600" cursor="pointer">
                      {product.name}
                    </Text>

                    <Image
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
                  </Flex>
                  <HStack mb="1rem" mt="0.5rem" spacing="0.5rem" align="center">
                    <Text align="center" fontSize="1.5rem">
                      R${Number(product.price).toFixed(2).replace('.', ',')}
                    </Text>
                    <Flex
                      p="0.5rem"
                      borderRadius="0.2rem"
                      onClick={() => saveOnCookie(product)}
                      cursor="pointer"
                      align="center"
                      bg="gray.800"
                      _hover={{
                        background: '#FF6B00',
                      }}
                      transition={['background 200ms']}
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
