import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { GrInstagram } from 'react-icons/gr';

export const Header = () => {
  return (
    <Grid
      color="#fff"
      bg="itemColor"
      templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(3, 1fr)']}
    >
      <GridItem w="100%" h={[0, 0, '3rem']} />
      <GridItem w="100%" h={['2rem', '2rem', '3rem']}>
        <Flex justify="center">
          <Heading pr="0.5rem" mt="0.4rem" color="#fff" fontWeight="hairline">
            Zaycon
          </Heading>
          <HStack spacing="1rem">
            <Link href="https://www.instagram.com/zaycon.connect" isExternal>
              <Flex cursor="pointer">
                <GrInstagram color="#fff" size={20} />
              </Flex>
            </Link>
            <Link
              isExternal
              href="https://api.whatsapp.com/send?phone=5527999147896&text=Olá, gostaria de saber mais sobre os produtos"
            >
              <Image
                cursor="pointer"
                w="1.4rem"
                src="whatsapp.svg"
                alt="whatsapp"
              />
            </Link>
          </HStack>
        </Flex>
      </GridItem>
      <GridItem w="100%" h="3rem">
        <HStack h="100%" justify="center" align="center">
          <Link href="/newSeller">
            <Text cursor="pointer">Quero ser um vendedor</Text>
          </Link>
          <Link href="/admin">
            <Text cursor="pointer">Acessar</Text>
          </Link>
        </HStack>
      </GridItem>
    </Grid>
  );
};
