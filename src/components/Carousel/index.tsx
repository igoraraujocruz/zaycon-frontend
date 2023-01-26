import {
  AspectRatio,
  Flex,
  Heading,
  Img,
  Spinner,
  Text,
} from '@chakra-ui/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../services/apiClient';
import DetailsProductModal, {
  DetailsProductModalHandle,
} from '../Modais/DetailsProductModal';

interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  slug: string;
  points: number;
  createdAt: string;
  destaque: boolean;
  category: string;
  photos: [
    {
      id: string;
      url: string;
    },
  ];
}

export const MyCarousel = () => {
  const [productsDestaque, setProductsDestaque] = useState([]);
  const [productSelected, setProductSelected] = useState({} as ProductProps);

  const modalDetails = useRef<DetailsProductModalHandle>(null);

  useEffect(() => {
    api.get('/products').then(response => setProductsDestaque(response.data));
  }, []);

  const handleSelectProduct = (product: ProductProps) => {
    setProductSelected(product);
    modalDetails.current.onOpen();
  };

  return (
    <>
      <DetailsProductModal product={productSelected} ref={modalDetails} />

      {productsDestaque.length <= 0 && (
        <Flex
          h={['30rem', '30rem', '42.5rem']}
          justify="center"
          align="center"
          w="100%"
        >
          <Spinner size="lg" color="orangeHover" />
        </Flex>
      )}
      <Carousel autoPlay infiniteLoop>
        {productsDestaque
          .filter(e => e.destaque === true)
          .map(product => (
            <Flex
              onClick={() => handleSelectProduct(product)}
              cursor="pointer"
              key={product.id}
              flexDir="column"
              align="center"
              mb="2rem"
            >
              <AspectRatio w={['50%', '50%', '20%']} ratio={1 / 1}>
                <Img src={product.photos[0]?.url} objectFit="fill" />
              </AspectRatio>

              <Heading
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w="25rem"
                mt="1rem"
              >
                {product.name}
              </Heading>
              <Text
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w="25rem"
              >
                {product.description}
              </Text>
              <Heading
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w="25rem"
              >
                R$ {product.price}
              </Heading>
            </Flex>
          ))}
      </Carousel>
    </>
  );
};
