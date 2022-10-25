import { Box, Flex, HStack, Text, useMediaQuery } from '@chakra-ui/react';
import { RiMapPin2Fill } from 'react-icons/ri';
import { GrInstagram } from 'react-icons/gr';
import { BsWhatsapp } from 'react-icons/bs';
import Link from 'next/link';

export function Footer() {
  const [isNotLargerThan500] = useMediaQuery('(max-width: 500px)');
  return (
    <Box>
      <Box bg="black" h="2rem" w="100%" />
      <Flex h="11rem" bg="#FF6B00" flexDir="column" alignItems="center">
        <HStack mt="1rem" align="center" spacing={5}>
          <Link href="/">
            <Flex cursor="pointer">
              <GrInstagram color="white" size={isNotLargerThan500 ? 28 : 35} />
            </Flex>
          </Link>
          <Link href="/">
            <Flex cursor="pointer">
              <BsWhatsapp size={isNotLargerThan500 ? 28 : 35} />
            </Flex>
          </Link>
        </HStack>
        <Flex
          mt="0.2rem"
          fontSize={['0.9rem', '0.9rem', '1rem']}
          flexDir="column"
          align="flex-start"
        >
          <Text color="#fff">Vantagem válida para compras na loja física.</Text>
          <Text color="#fff">Shopping Mestre Álvaro - 2º piso</Text>
          <HStack>
            <RiMapPin2Fill color="#fff" size={isNotLargerThan500 ? 28 : 35} />
            <Text color="#fff">Av. João Palácio, 300 - Eurico Salles</Text>
          </HStack>
          <Text alignSelf="center" color="#fff">
            Serra - ES, 29160-161
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
