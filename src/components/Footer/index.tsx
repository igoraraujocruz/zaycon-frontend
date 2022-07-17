import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { RiMapPin2Fill } from 'react-icons/ri';
import { GrInstagram } from 'react-icons/gr';
import { BsWhatsapp } from 'react-icons/bs';

export function Footer() {
  return (
    <Box>
      <Box mt="-3rem" bg="black" opacity={1} h="5rem" w="100%" />
      <Flex bg="#FF6B00" flexDir="column" alignItems="center" p="5rem">
        <Text mt="-2.5rem" color="black" textShadow="1px 1px #ffffff" mb="1rem">
          Vantagem válida para compras na loja física.
        </Text>
        <HStack ml={10} spacing={5}>
          <Text color="black" textShadow="1px 1px #ffffff">
            Shopping Mestre Álvaro - 2º piso
          </Text>
          <GrInstagram color="black" size={43} />
          <BsWhatsapp color="black" size={43} />
        </HStack>
        <Flex align="center">
          <RiMapPin2Fill color="#000000" size={35} />
          <Text color="black" textShadow="1px 1px #ffffff">
            Av. João Palácio, 300 - Eurico Salles, Serra - ES, 29160-161
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
