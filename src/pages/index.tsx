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
import { useCart } from '../services/hooks/useCart';
import { MyCarousel } from '../components/Carousel';
import { Footer } from '../components/Footer';

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

        <Flex
          justify="center"
          flexDir={['column', 'column', 'row']}
          align="center"
          p="0.5rem"
        >
          <HStack color="itemColor">
            <Heading color="itemColor">Zaycon</Heading>
            <Link href="https://www.instagram.com/zaycon.connect" isExternal>
              <Flex cursor="pointer">
                <GrInstagram color="#14213D" size={28} />
              </Flex>
            </Link>
            <Link
              isExternal
              href="https://api.whatsapp.com/send?phone=5527999147896&text=Olá, gostaria de saber mais sobre os produtos"
            >
              <Image
                cursor="pointer"
                w="2.2rem"
                src="whatsapp2.svg"
                alt="whatsapp"
              />
            </Link>
          </HStack>
          <HStack ml={[0, 0, '1rem']}>
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
          border="itemColor"
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
              mt="2rem"
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
                      p="0.2rem"
                      borderRadius="0.2rem"
                      onClick={() => addProduct(product.id)}
                      cursor="pointer"
                      align="center"
                      bg="itemColor"
                      _hover={{
                        background: 'itemColor',
                      }}
                      transition={['background 200ms']}
                    >
                      <Text color="white">Comprar</Text>
                      <Image alt="carrinho" src="carrinho.png" />
                    </Flex>
                  </HStack>
                </Flex>
              ))}
            </Grid>
          )}
        </Flex>
        <Flex h="10rem" />
        <Footer />
      </Flex>
    </>
  );
}
