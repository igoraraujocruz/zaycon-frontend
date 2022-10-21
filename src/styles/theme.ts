import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    gray: {
      '900': '#181B23',
      '50': '#EEEEF2',
    },
    orange: '#FF6B00',
    orangeHover: '#FF4500',
  },
  fonts: {
    heading: 'Righteous',
    body: 'Righteous',
  },

  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.50',
      },
    },
  },
});
