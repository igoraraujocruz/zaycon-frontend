import {
  AspectRatio,
  Button,
  Flex,
  HStack,
  Img,
  Input as ChakraSearchInput,
  InputProps as ChakraSearchInputProps,
  ScaleFade,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useRef,
  useState,
} from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { FiShoppingCart } from 'react-icons/fi';
import { api } from '../../services/apiClient';
import { useCart } from '../../services/hooks/useCart';
import { getProduct, Product } from '../../services/hooks/useProducts';
import DetailsProductModal, {
  DetailsProductModalHandle,
} from '../Modais/DetailsProductModal';

interface SearchInputProps extends ChakraSearchInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
}

const SearchInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  SearchInputProps
> = ({ name, label, error = null, bg, ...rest }, ref) => {
  const [noProductFound, setNoProductFound] = useState(false);
  const [itemFilters, setItemFilters] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({} as Product);
  const { addProduct } = useCart();

  const { handleSubmit, register } = useForm();
  const modalDetails = useRef<DetailsProductModalHandle>(null);

  const onSubmit = useCallback(async ({ search }: any) => {
    if (search !== '') {
      setIsLoading(true);
      try {
        await api
          .get(`/products?option=${search}`)
          .then(response => setItemFilters(response.data));
        setNoProductFound(false);
        setIsLoading(false);
      } catch (err) {
        setItemFilters([]);
        setNoProductFound(true);
      }
    }
  }, []);

  const verifyInputValues = () => {
    setItemFilters([]);
    setNoProductFound(false);
  };

  const getProduct = (product: Product) => {
    setProduct(product);
    modalDetails.current.onOpen();
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      justify={['center', 'center', 'end']}
      align="center"
      w="100%"
      flexDir="column"
      mb="3rem"
    >
      <DetailsProductModal product={product} ref={modalDetails} />
      <HStack mb="1rem">
        <ChakraSearchInput
          name={name}
          id={name}
          _hover={{ bg: 'inputBg' }}
          _focus={{ bg: 'inputBg', border: '0.1rem solid #14213D' }}
          bgColor="inputBg"
          variant="filled"
          size="lg"
          {...rest}
          {...register('search', {
            onChange: () => verifyInputValues(),
          })}
        />
        <Button
          ml="1rem"
          bg="itemColor"
          color="white"
          _hover={{ bg: 'itemColor' }}
          type="submit"
        >
          Pesquisar
        </Button>
      </HStack>
      {itemFilters.length > 0 && (
        <Text>{itemFilters.length} Produtos encontrados</Text>
      )}
      <Flex
        w="80vw"
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF6B00',
            borderRadius: '24px',
          },
        }}
        align="center"
        justify="flex-start"
      >
        {!noProductFound ? (
          <Flex w="100%" justify="flex-start" align="center">
            {isLoading && (
              <Flex justify="center" w="100%">
                <Spinner color="orangeHover" size="lg" />
              </Flex>
            )}
            {itemFilters.map(product => (
              <ScaleFade initialScale={0.9} in>
                <VStack p="1rem" maxH="25rem" justify="center" key={product.id}>
                  <VStack cursor="pointer" onClick={() => getProduct(product)}>
                    <Text h="1rem">{product.name}</Text>
                    <AspectRatio w="10rem" ratio={1 / 1}>
                      <Img src={product.photos[0]?.url} objectFit="cover" />
                    </AspectRatio>
                    <Text>R$ {product.price}</Text>
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      w="15rem"
                    >
                      {product.description}
                    </Text>
                  </VStack>
                  <Flex
                    p="0.5rem"
                    borderRadius="0.2rem"
                    onClick={() => addProduct(product.id)}
                    cursor="pointer"
                    align="center"
                    bg="itemColor"
                    color="white"
                    _hover={{
                      background: 'itemColor',
                    }}
                  >
                    <Text>Comprar</Text>
                    <FiShoppingCart cursor="pointer" size={30} />
                  </Flex>
                </VStack>
              </ScaleFade>
            ))}
          </Flex>
        ) : (
          <Flex justify="center" overflow="hidden" align="center" w="100%">
            <Text>Nenhum produto encontrado</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export const SearchInput = forwardRef(SearchInputBase);
