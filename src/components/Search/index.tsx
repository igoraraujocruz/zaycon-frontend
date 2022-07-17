import { Box, Flex, Input } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

export function Search() {
  return (
    <Flex justify="center" h="5rem" alignItems="center">
      <Box mr={3}>
        <FiSearch size={25} />
      </Box>
      <Input
        w={['27rem']}
        fontSize={['1.3rem', '1.3rem', '1.5rem']}
        variant="unstyled"
        _placeholder={{ textAlign: 'center' }}
        placeholder="Pesquisar por nome, preço ou pontos"
      />
    </Flex>
  );
}
