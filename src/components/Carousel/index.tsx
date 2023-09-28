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
        <Img
          src={imag.url}
          objectFit="cover"
          h="60vh"
          borderRadius="0 0 2rem 2rem"
        />
      ))}
    </Carousel>
  );
};
