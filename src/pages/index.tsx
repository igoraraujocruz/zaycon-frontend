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
  VStack,
  Stack,
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
import { NavBar } from '../components/NavBar/Navbar';

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

        <Flex justify="center" align="center" mt={['2rem', '2rem', '3rem']}>
          <Heading>Zaycon</Heading>
          <Link href="https://www.instagram.com/zaycon.connect" isExternal>
            <Flex mt="-0.5rem" ml="1rem" cursor="pointer">
              <GrInstagram color="white" size={25} />
            </Flex>
          </Link>
          <NavBar />
        </Flex>

        <HStack
          mt={[0, 0, '1rem']}
          pr={[0, 0, '1rem']}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          justify={['center', 'center', 'end']}
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
          <Button bg="gray.800" _hover={{ bg: 'orangeHover' }} type="submit">
            Pesquisar
          </Button>
        </HStack>

        <Flex justify="center" minH="50vh">
          {(!isLoading && isFetching) || isLoading ? (
            <Flex justify="center" align="center">
              <Spinner color="orange" />
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center">
              <Text>Falha ao obter dados</Text>
            </Flex>
          ) : (
            <Grid
              mt="2rem"
              templateColumns={[
                '1fr',
                '1fr',
                '1fr 1fr',
                '1fr 1fr',
                '1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr',
              ]}
              gap="2rem"
            >
              {data.map(product => (
                <Flex flexDir="column" alignItems="center">
                  <Flex
                    cursor="pointer"
                    onClick={() => openUploadModal(product)}
                    key={product.id}
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
