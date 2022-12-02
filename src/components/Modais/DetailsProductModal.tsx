import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Image,
  Flex,
  ModalHeader,
  Text,
  VStack,
  Stack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react';

import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../services/hooks/useCart';
import { Product } from '../../services/hooks/useProducts';

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    amount: number;
    slug: string;
    points: number;
    createdAt: string;
    photos: [
      {
        id: string;
        url: string;
      },
    ];
    user: {
      id: string;
      name: string;
    };
  };
}

export interface DetailsProductModalHandle {
  onOpen: () => void;
  onClose: () => void;
}

const DetailsProductModal: ForwardRefRenderFunction<
  DetailsProductModalHandle,
  ProductProps
> = ({ product }: ProductProps, ref) => {
  const toast = useToast();
  const { addToCart } = useCart();

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

  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const [showImage, setShowImage] = useState('');

  const onClose = () => {
    closeModal();
    setShowImage('');
  };

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
    <Flex>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="orange"
            _hover={{ bg: 'orangeHover' }}
            color="#fff"
          />
          <ModalHeader />
          <ModalBody>
            <Flex flexDir={['column', 'column', 'row']}>
              {product.id && (
                <VStack justify="space-between" align="center">
                  <Stack
                    w="100%"
                    flexDir={['column', 'column', 'row']}
                    align={['center', 'center', 'flex-start']}
                  >
                    {!product.photos[0] ? (
                      <VStack spacing={0} mb="2rem">
                        <Text
                          flexWrap="wrap"
                          fontSize={['1.5rem', '2xl', '3xl']}
                        >
                          R${product.price}
                        </Text>
                      </VStack>
                    ) : (
                      <VStack>
                        <Text fontSize="2xl">{product.name}</Text>
                        <HStack>
                          <Text
                            flexWrap="wrap"
                            fontSize={['1.5rem', '2xl', '3xl']}
                          >
                            R${product.price}
                          </Text>
                          <FiShoppingCart cursor="pointer" size={30} />
                        </HStack>

                        <VStack spacing={0}>
                          <Image
                            border="0.5rem solid #FF6B00"
                            h={['60vh', '60vh', '65vh']}
                            minW="20rem"
                            w={['70vw', '70vw', '28vw']}
                            src={
                              showImage === ''
                                ? product.photos[0].url
                                : showImage
                            }
                          />
                        </VStack>
                        <Flex
                          flexWrap="wrap"
                          justify="center"
                          flexDir="row"
                          gap={2}
                          p={2}
                        >
                          {product.photos.map(photo => (
                            <Image
                              _hover={{ opacity: 1 }}
                              transition="opacity 200ms"
                              key={photo.id}
                              opacity={0.9}
                              cursor="pointer"
                              onClick={() => setShowImage(photo.url)}
                              borderRadius="1rem 1rem 0"
                              h="5rem"
                              w={['4rem', '6rem']}
                              src={photo.url}
                            />
                          ))}
                        </Flex>
                      </VStack>
                    )}
                  </Stack>
                </VStack>
              )}
              <VStack flexDir="column">
                <Text
                  fontFamily="Anek Devanagari"
                  fontWeight={400}
                  w="28rem"
                  ml="2rem"
                  pt="6rem"
                  maxH="15rem"
                >
                  {product.description}
                </Text>
                <Flex
                  p="0.5rem"
                  borderRadius="0.2rem"
                  onClick={() =>
                    saveOnCookie({
                      id: product.id,
                      name: product.name,
                      amount: product.amount,
                      description: product.description,
                      price: product.price,
                      slug: product.slug,
                      user: product.user,
                      points: product.points,
                      photos: product.photos,
                      createdAt: product.createdAt,
                    })
                  }
                  cursor="pointer"
                  align="center"
                  fontFamily="Anek Devanagari"
                  bg="gray.800"
                >
                  <Text>Comprar</Text>
                  <FiShoppingCart cursor="pointer" size={30} />
                </Flex>
              </VStack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              color="#fff"
              bg="orange"
              _hover={{ bg: 'orangeHover' }}
              mr={3}
              onClick={onClose}
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(DetailsProductModal);
