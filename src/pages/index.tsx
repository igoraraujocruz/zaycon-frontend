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

export default function Home() {
  const { addProduct } = useCart();
  const { isLoading, error, isFetching } = useProducts();
  const { register } = useForm();

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
          <Stack ml={[0, 0, '10rem']} flexDir="row">
            <Heading>Zaycon</Heading>
            <Link href="https://www.instagram.com/zaycon.connect" isExternal>
              <Flex ml="0.5rem" cursor="pointer">
                <GrInstagram color="white" size={28} />
              </Flex>
            </Link>
          </Stack>

          <HStack
            mr={[0, 0, '10rem']}
            justify={['center', 'center', 'flex-end']}
            w="100%"
            spacing={['1.5rem', '1.5rem', '3rem']}
          >
            <Link href="/newSeller">
              <Text cursor="pointer">Quero ser um vendedor</Text>
            </Link>
            <Link href="/admin">
              <Text cursor="pointer">Acessar</Text>
            </Link>
          </HStack>
        </Flex>

        <MyCarousel />
        <SearchInput
          w={['11rem', '11rem', '15rem', '18rem']}
          borderColor="gray.600"
          border="0.1rem solid black"
          name="search"
          {...register('search')}
        />
        <Flex justify="center" mt="-2rem">
          <Select
            mt="1rem"
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
              {category.map(product => (
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

                    <AspectRatio w={['19rem']} ratio={1 / 1}>
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

                  <HStack mb="1rem" mt="0.5rem" spacing="0.5rem" align="center">
                    <Text align="center" fontSize="1.5rem">
                      R${Number(product.price).toFixed(2).replace('.', ',')}
                    </Text>
                    <Flex
                      p="0.5rem"
                      borderRadius="0.2rem"
                      onClick={() => addProduct(product.id)}
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
