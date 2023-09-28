import { AspectRatio, Flex, Img } from '@chakra-ui/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { BannerProps } from '../../pages';

export const MyCarousel = ({ banners }: BannerProps) => {
  const imgs = [
    {
      key: 1,
      url: 'celular.jpg',
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
        <AspectRatio mt="0.05rem" ratio={[3 / 1, 3 / 1, 4 / 1]}>
          <Img
            src={imag.url}
            objectFit="cover"
            h="70vh"
            borderRadius="0 0 2rem 2rem"
          />
        </AspectRatio>
      ))}
    </Carousel>
  );
};
