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
  Select,
  AspectRatio,
  Img,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { MyCarousel } from '../components/Carousel';

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
  const [category, setCategory] = useState<Product[]>([]);

  useEffect(() => {
    api.get('products').then(products => setCategory(products.data));
  }, []);

  const modalDetails = useRef<DetailsProductModalHandle>(null);
  const bagModal = useRef<IBagModal>(null);

  const openUploadModal = useCallback((product: Product) => {
    setProduct(product);
    modalDetails.current.onOpen();
  }, []);

  console.log(itemFilters);

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

  const getProductByCategory = async (value: string) => {
    if (value === 'all') {
      const products = await api.get('products');
      setCategory(products.data);
    } else {
      const products = await api.get(`products?category=${value}`);

      setCategory(products.data);
    }
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

        <Flex
          justify="center"
          flexDir={['column', 'column', 'row']}
          align="center"
          mt={['2rem', '2rem', '1rem']}
          mb={['1rem', '1rem', '0.5rem']}
        >
          <Stack flexDir="row">
            <Heading>Zaycon</Heading>
            <Link href="https://www.instagram.com/zaycon.connect" isExternal>
              <Flex mt="-0.5rem" ml="1rem" cursor="pointer">
                <GrInstagram color="white" size={25} />
              </Flex>
            </Link>
          </Stack>

          <HStack justify="flex-end" w="70%">
            <Link href="/newSeller">
              <Text cursor="pointer">Quero ser um vendedor</Text>
            </Link>
            <Link href="/admin">
              <Text cursor="pointer">Acessar</Text>
            </Link>
          </HStack>
        </Flex>

        <MyCarousel />
        <Flex justify="center" mt="-2rem">
          <Select
            mb={['1rem', '1rem', 0]}
            w="12rem"
            focusBorderColor="none"
            onChange={e => getProductByCategory(e.target.value)}
          >
            <option style={{ background: '#181B23' }} value="all">
              Todos os Produtos
            </option>
            <option style={{ background: '#181B23' }} value="televisoes">
              Televisões
            </option>
            <option style={{ background: '#181B23' }} value="informatica">
              Informática
            </option>
            <option style={{ background: '#181B23' }} value="som">
              Audio
            </option>
            <option style={{ background: '#181B23' }} value="utilitarios">
              Utilitários
            </option>
          </Select>
        </Flex>

        <HStack
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
              {itemFilters.length > 0
                ? itemFilters.map(item => (
                    <Flex key={item.id} flexDir="column" alignItems="center">
                      <Flex
                        cursor="pointer"
                        onClick={() => openUploadModal(item)}
                        flexDir="column"
                        justify="center"
                        alignItems="center"
                      >
                        <Text w="15rem" fontWeight="600" cursor="pointer">
                          {item.name}
                        </Text>

                        <AspectRatio w="20rem" ratio={1 / 1}>
                          <Img src={item.photos[0]?.url} objectFit="cover" />
                        </AspectRatio>
                        <Text
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          mt="0.5rem"
                          w={['15.7rem', '15.7rem', '18.8rem']}
                          maxH="5rem"
                        >
                          {item.description}
                        </Text>
                      </Flex>

                      <HStack
                        mb="1rem"
                        mt="0.5rem"
                        spacing="0.5rem"
                        align="center"
                      >
                        <Text align="center" fontSize="1.5rem">
                          R${Number(item.price).toFixed(2).replace('.', ',')}
                        </Text>
                        <Flex
                          p="0.5rem"
                          borderRadius="0.2rem"
                          onClick={() => saveOnCookie(item)}
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
                  ))
                : category.map(product => (
                    <Flex key={product.id} flexDir="column" alignItems="center">
                      <Flex
                        cursor="pointer"
                        onClick={() => openUploadModal(product)}
                        key={product.id}
                        flexDir="column"
                        justify="center"
                        alignItems="center"
                      >
                        <Text w="15rem" fontWeight="600" cursor="pointer">
                          {product.name}
                        </Text>

                        <AspectRatio w="20rem" ratio={1 / 1}>
                          <Img src={product.photos[0]?.url} objectFit="cover" />
                        </AspectRatio>
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

                      <HStack
                        mb="1rem"
                        mt="0.5rem"
                        spacing="0.5rem"
                        align="center"
                      >
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
