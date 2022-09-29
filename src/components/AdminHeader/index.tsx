import { Box, Button, Flex, HStack, Image, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { signOut } from '../../services/hooks/useAuth'

export const AdminHeader = () => {
    return (
        <Flex
        w={'100vw'}
      as="header"
      borderRadius={'0 0 3rem 3rem'}
      align="center"
      style={{
        boxShadow: '0 0 0 0.5rem #FF6B00'
      }}
      h={['50px', '100px']}
      bg='gray.700'
    >
        <Flex w={'100%'} justify={'center'}>
          <Image w={'10rem'} src="../logo.svg"/>
          
        </Flex>
        <Flex>
          <HStack mt={'1rem'} spacing={'2rem'}>
              <Link href={'/admin/products'}>
                <Text cursor={'pointer'}>Produtos</Text>
              </Link>
              <Link href={'/admin/clients'}>
                <Text cursor={'pointer'}>Clientes</Text>
              </Link>
          </HStack>
        </Flex>
        <Flex w={'100%'} justify={'end'}>
        <Button onClick={() => signOut()} p='1.5rem' mr='2rem' bg={'gray.800'} _hover={{ bg: 'orangeHover'}}>Sair</Button>
        </Flex>
    </Flex>
    )
}