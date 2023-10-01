import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    bg: '#f5f5fd',
    white: '#fff',
    bgItems: '#f5f5fd',
    itemColor: '#14213D',
    inputBg: '#E5E5E5',
    inputColor: '#fff',
    gray: {
      '900': '#181B23',
      '50': '#EEEEF2',
    },
    orange: '#FF6B00',
    orangeHover: '#FF4500',
  },
  fonts: {
    heading: 'Anek Devanagari',
    body: 'Anek Devanagari',
  },
  styles: {
    global: {
      body: {
        bg: 'bg',
        color: '#000',
      },
    },
  },
});
