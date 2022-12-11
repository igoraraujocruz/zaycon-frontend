import {
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { signOut } from '../../services/hooks/useAuth';

interface Client {
  name: string;
}

interface Product {
  name: string;
}

interface Shop {
  id: string;
  quantity: number;
  createdAt: string;
  client: Client;
  product: Product;
}

interface Seller {
  seller: {
    id: string;
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
    numberPhone: string;
    points: number;
    birthday: string;
    shop: Shop[];
  };
}

export const HeaderPainel = ({ seller }: Seller) => {
  const myLink = `https://zaycon.shop/?seller=${seller?.username.replace(
    / /g,
    '%20',
  )}`;

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

  const handleCopyClick = () => {
    copyTextToClipboard(myLink);
  };

  return (
    <Flex
      mt="1rem"
      flexDir={['column', 'column', 'column', 'row']}
      justify="space-between"
      w="100%"
    >
      <Flex align="center" justify="center" flexDir="row" ml="2rem">
        <Heading size="lg">Zaycon</Heading>
        <HStack ml="1rem">
          <Link href="/">
            <Button
              fontSize="0.8rem"
              bg="gray.800"
              size={['xs', 'md']}
              _hover={{ bg: 'orangeHover' }}
            >
              Ir para a Loja
            </Button>
          </Link>
          <Button
            fontSize="0.8rem"
            onClick={() => signOut()}
            bg="gray.800"
            size={['xs', 'md']}
            _hover={{ bg: 'orangeHover' }}
          >
            Sair
          </Button>
        </HStack>
      </Flex>

      <Flex align="center" justify="center" mt={['1rem', '1rem', '1rem', 0]}>
        <VStack>
          <Text>Olá, {seller.name}</Text>
          <Text>Meus pontos: {seller.points}</Text>
        </VStack>
      </Flex>

      <Flex align="center" mt="1rem">
        <Flex
          flexDir={['column', 'column', 'column', 'row']}
          justify="center"
          align="center"
          w="100%"
          mr={[0, 0, 0, '2rem']}
        >
          <Text mr={[0, 0, 0, '0.5rem']}>Meu Link:</Text>
          <HStack color="#000" bg="orange" p="0.5rem" borderRadius="1rem">
            <Text>{myLink}</Text>
            <Button
              _hover={{
                bg: '#1a202c',
              }}
              bg="#181b23"
              color="#fff"
              onClick={handleCopyClick}
            >
              Copiar
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};
