import { Box, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useSearchProduct } from '../../services/hooks/useSeachProducts';

export function Search() {
  const { searchValueInput, teste, searchProduct } = useSearchProduct();

  return (
    <Flex justify="center" h="5rem" alignItems="center">
      <Box mr={3}>
        <FiSearch size={25} />
      </Box>
      <Input
        onChange={e => teste(e.target.value)}
        w={['27rem']}
        fontSize={['1.3rem', '1.3rem', '1.5rem']}
        variant="unstyled"
        _placeholder={{ textAlign: 'center' }}
        placeholder="Pesquisar por nome, preço ou pontos"
      />
      {searchValueInput && (
        <Flex textAlign="center" flexDir={['column', 'column', 'row']}>
          <Text mr="0.5rem" color="orange">
            [ {searchProduct.length} ]
          </Text>
          <Text>Resultados Encontrados</Text>
        </Flex>
      )}
    </Flex>
  );
}
