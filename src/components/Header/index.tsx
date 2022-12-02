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
          <Heading color="white">
            sss
          </Heading>
        </Flex>
      </Box>
    </Flex>
  );
}
