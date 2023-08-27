import { AspectRatio, Flex, Img } from '@chakra-ui/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { BannerProps } from '../../pages';

export const MyCarousel = ({ banners }: BannerProps) => {
  const imgs = [
    {
      key: 1,
      url: 'teste/10.svg',
    },
    {
      key: 2,
      url: 'teste/2.jpg',
    },
    {
      key: 3,
      url: 'teste/3.png',
    },
  ];
  return (
    <Carousel autoPlay infiniteLoop showStatus={false}>
      {imgs.map(imag => (
        <Flex key={imag.key} flexDir="column" align="center">
          <AspectRatio w="100%" minH={0} flex={['50vw', '50vw', '25vw']}>
            <Img src={imag.url} objectFit="cover" />
          </AspectRatio>
        </Flex>
      ))}
    </Carousel>
  );
};
