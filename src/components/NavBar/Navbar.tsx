import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  Collapse,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  Stack,
  VStack,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiMenu } from 'react-icons/fi';

export const NavBar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Box as="section">
      <Box as="nav" boxShadow={useColorModeValue('sm', 'sm-dark')}>
        <Flex justify="center">
          <HStack spacing="10" justify="space-between">
            {isDesktop ? (
              <HStack spacing="1rem" color="fff" ml="1rem">
                <Text cursor="pointer" fontWeight={600}>
                  Todos os Produtos
                </Text>
                <Text cursor="pointer" fontWeight={600}>
                  Televisões
                </Text>
                <Text cursor="pointer" fontWeight={600}>
                  Informática
                </Text>
                <Text cursor="pointer" fontWeight={600}>
                  Utilitários
                </Text>
                <HStack>
                  <Link href="/newSeller">
                    <Text cursor="pointer">Quero ser um vendedor</Text>
                  </Link>
                  <Link href="/admin">
                    <Text cursor="pointer">Acessar</Text>
                  </Link>
                </HStack>
              </HStack>
            ) : (
              <IconButton
                ml="1rem"
                mt="-0.5rem"
                variant="ghost"
                onClick={onToggle}
                _hover={{
                  bg: 'orangeHover',
                }}
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </HStack>
        </Flex>

        {!isDesktop && (
          <Collapse
            in={isOpen}
            animateOpacity
            style={{ marginTop: '0!important' }}
          >
            <VStack
              mb="1rem"
              ml="1rem"
              w="9rem"
              bg="inputBg"
              borderRadius="1rem"
              align="center"
              color="fff"
            >
              <Text cursor="pointer" fontWeight={600}>
                Todos os Produtos
              </Text>
              <Text cursor="pointer" fontWeight={600}>
                Televisões
              </Text>
              <Text cursor="pointer" fontWeight={600}>
                Informática
              </Text>
              <Text cursor="pointer" fontWeight={600}>
                Utilitários
              </Text>
              <Link href="/newSeller">
                <Text cursor="pointer">Quero ser um vendedor</Text>
              </Link>
              <Link href="/admin">
                <Text cursor="pointer">Acessar</Text>
              </Link>
            </VStack>
          </Collapse>
        )}
      </Box>
    </Box>
  );
};
