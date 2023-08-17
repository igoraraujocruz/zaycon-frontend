import { AspectRatio, Flex, Img } from '@chakra-ui/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export const MyCarousel = () => {
  const imgs = ['01.png', '02.png'];

  return (
    <Carousel autoPlay infiniteLoop>
      {imgs.map(imag => (
        <Flex key={imag} flexDir="column" align="center">
          <AspectRatio w="100%" minH={0} flex={['50vw', '50vw', '30vw']}>
            <Img src={imag} objectFit="cover" />
          </AspectRatio>
        </Flex>
      ))}
    </Carousel>
  );
};
