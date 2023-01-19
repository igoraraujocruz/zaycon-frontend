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
  AspectRatio,
  Img,
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
    category: string;
    destaque: boolean;
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
  const { addProduct } = useCart();

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
      <Modal size={['md', 'md', '2xl']} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="bg">
          <ModalCloseButton />
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
                    <VStack align="flex-start">
                      <HStack>
                        <Text
                          fontSize={['1.2rem', '1.2rem', '3xl']}
                          maxW="15rem"
                        >
                          {product.name}
                        </Text>
                        <Text
                          w={['15rem', '15rem', '26rem']}
                          maxH="5rem"
                          fontWeight={400}
                          overflow="scroll"
                          sx={{
                            '::-webkit-scrollbar': {
                              display: 'none',
                            },
                          }}
                        >
                          {product.description}
                        </Text>
                      </HStack>

                      <HStack>
                        <Text fontSize="1.5rem">
                          R${Number(product.price).toFixed(2).replace('.', ',')}
                        </Text>
                        <Flex
                          p="0.5rem"
                          borderRadius="0.2rem"
                          onClick={() => addProduct(product.id)}
                          cursor="pointer"
                          align="center"
                          color="white"
                          bg="itemColor"
                        >
                          <Text>Comprar</Text>
                          <FiShoppingCart cursor="pointer" size={30} />
                        </Flex>
                      </HStack>

                      <VStack spacing={2}>
                        <AspectRatio
                          w={['18rem', '18rem', '30rem']}
                          ratio={[1 / 1]}
                        >
                          <Img
                            src={
                              showImage === ''
                                ? product.photos[0].url
                                : showImage
                            }
                            objectFit="cover"
                          />
                        </AspectRatio>
                      </VStack>
                      <Flex
                        flexWrap="wrap"
                        justify="center"
                        flexDir="row"
                        gap={2}
                        p={2}
                      >
                        {product.photos.map(photo => (
                          <AspectRatio
                            w={['5rem', '5rem', '7rem']}
                            ratio={1 / 1}
                          >
                            <Img
                              src={photo.url}
                              cursor="pointer"
                              objectFit="cover"
                              onClick={() => setShowImage(photo.url)}
                            />
                          </AspectRatio>
                        ))}
                      </Flex>
                    </VStack>
                  )}
                </VStack>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(DetailsProductModal);
