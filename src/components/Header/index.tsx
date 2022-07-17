import { Box, Flex, Heading, Image } from '@chakra-ui/react';

export function Header() {
  return (
    <Flex
      as="header"
      w="100%"
      align="center"
      mt="2rem"
      justify="center"
      h={['50px', '100px']}
    >
      <Box>
        <Flex alignItems="center">
          <Image
            mt="2rem"
            mb="2rem"
            maxW={[225, 225, 300]}
            src="../logo.svg"
            sizes="10rem"
            alt="Snap Logo"
          />
          <Heading ml={-4} color="white">
            oints
          </Heading>
        </Flex>
      </Box>
    </Flex>
  );
}
