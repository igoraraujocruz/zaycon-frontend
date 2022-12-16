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
      <Modal size={['md', 'md', 'md']} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="orange"
            _hover={{ bg: 'orangeHover' }}
            color="#fff"
          />
          <ModalHeader />
          <ModalBody>
            <Flex justify="center" flexDir={['column', 'column', 'row']}>
              {product.id && (
                <VStack align="center">
                  {!product.photos[0] ? (
                    <VStack spacing={0}>
                      <Text flexWrap="wrap" fontSize={['1.5rem', '2xl', '3xl']}>
                        R${Number(product.price).toFixed(2).replace('.', ',')}
                      </Text>
                    </VStack>
                  ) : (
                    <VStack>
                      <Text fontSize={['1.2rem', '1.2rem', '2xl']}>
                        {product.name}
                      </Text>
                      <HStack>
                        <Text fontSize="1.5rem">
                          R${Number(product.price).toFixed(2).replace('.', ',')}
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
                              points: product.points,
                              photos: product.photos,
                              createdAt: product.createdAt,
                            })
                          }
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

                      <VStack spacing={2}>
                        <Text
                          w={['15rem', '15rem', '26rem']}
                          maxH="5rem"
                          fontWeight={400}
                          overflowY="auto"
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
                        >
                          {product.description}
                        </Text>

                        <Image
                          maxW={['45vh', '45vh', '60vh']}
                          src={
                            showImage === '' ? product.photos[0].url : showImage
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
                            w={['4rem', '4rem']}
                            src={photo.url}
                          />
                        ))}
                      </Flex>
                    </VStack>
                  )}
                </VStack>
              )}
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
