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
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { SearchInput } from '../components/Form/SearchInput';
import { api } from '../services/apiClient';
import { Product, useProducts } from '../services/hooks/useProducts';
import DetailsProductModal, {
  DetailsProductModalHandle,
} from '../components/Modais/DetailsProductModal';
import { useCart } from '../services/hooks/useCart';
import { MyCarousel } from '../components/Carousel';

import { Header } from '../components/Header';

export type BannerProps = {
  banners: [
    {
      id: string;
      productOrTagUrl: string;
      url: string;
    },
  ];
};

export default function Home({ banners }: BannerProps) {
  const { addProduct } = useCart();
  const { isLoading, error, isFetching } = useProducts();
  const { register } = useForm();

  const [product, setProduct] = useState({} as Product);
  const [category, setCategory] = useState<Product[]>([]);

  useEffect(() => {
    api.get('products').then(products => setCategory(products.data));
  }, []);

  const modalDetails = useRef<DetailsProductModalHandle>(null);

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
        <DetailsProductModal product={product} ref={modalDetails} />
        <Header />

        <MyCarousel banners={banners} />
        <SearchInput
          w={['11rem', '11rem', '15rem', '18rem']}
          border="itemColor"
          name="search"
          {...register('search')}
        />
        <Flex justify="center" mt="-3.5rem">
          <Select
            mt="1rem"
            mb={['1rem', '1rem', 0]}
            w="12rem"
            borderColor="itemColor"
            focusBorderColor="none"
            onChange={e => getProductByCategory(e.target.value)}
          >
            <option style={{ background: '#E5E5E5' }} value="all">
              Todos os Produtos
            </option>
            <option style={{ background: '#E5E5E5' }} value="televisoes">
              Televisões
            </option>
            <option style={{ background: '#E5E5E5' }} value="informatica">
              Informática
            </option>
            <option style={{ background: '#E5E5E5' }} value="som">
              Audio
            </option>
            <option style={{ background: '#E5E5E5' }} value="utilitarios">
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
              mt="1rem"
              templateColumns={[
                '1fr',
                '1fr',
                '1fr 1fr',
                '1fr 1fr',
                '1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr',
              ]}
              bg="bgItems"
              gap="2rem"
            >
              {category.map(product => (
                <Flex
                  key={product.id}
                  flexDir="column"
                  alignItems="center"
                  bg="#fff"
                  borderRadius={5}
                >
                  <Flex
                    cursor="pointer"
                    onClick={() => openUploadModal(product)}
                    key={product.id}
                    flexDir="column"
                    justify="center"
                    alignItems="center"
                  >
                    <Text
                      w="15rem"
                      color="#000"
                      align="center"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      fontWeight="600"
                      cursor="pointer"
                      fontSize="1.5rem"
                      mb="1rem"
                      mt="1rem"
                    >
                      {product.name}
                    </Text>

                    <AspectRatio w="100%" minH={0} flex={1}>
                      <Img src={product.photos[0]?.url} objectFit="cover" />
                    </AspectRatio>
                    <Text
                      overflow="auto"
                      css={{
                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#14213D',
                          borderRadius: '0px',
                        },
                      }}
                      align="center"
                      textOverflow="ellipsis"
                      whiteSpace="normal"
                      w={['15.7rem', '15.7rem', '18.8rem']}
                      h="9rem"
                      color="#000"
                    >
                      {product.description}
                    </Text>
                  </Flex>

                  <HStack
                    spacing="0.5rem"
                    align="center"
                    bg="#080C26"
                    w="100%"
                    h="100%"
                    justify="center"
                  >
                    <Text
                      fontSize="1.5rem"
                      align="center"
                      w="100%"
                      color="#fff"
                    >
                      R${Number(product.price).toFixed(2).replace('.', ',')}
                    </Text>
                    <Flex
                      onClick={() => addProduct(product.id)}
                      cursor="pointer"
                      align="center"
                      bg="itemColor"
                      p={2}
                      justify="center"
                      w="100%"
                      _hover={{
                        background: '#080C26',
                      }}
                      transition={['background 200ms']}
                    >
                      <Text color="white">Comprar</Text>
                      <AiOutlineShoppingCart color="#fff" size={32} />
                    </Flex>
                  </HStack>
                </Flex>
              ))}
            </Grid>
          )}
        </Flex>
        <Flex h="10rem" />
      </Flex>
    </>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   const response = await api.get('/banners');

//   const banners = response.data;

//   return {
//     props: {
//       banners,
//     },
//     revalidate: 60 * 60 * 24, // 24 hours
//   };
// };
