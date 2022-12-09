import { Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
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
    <Flex flexDir="column">
      <HStack mt="2rem">
        <Heading size="lg">Zaycon</Heading>
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
      <Text>{seller.name}</Text>
      <Text>Meus pontos: {seller.points}</Text>
      <HStack mt="1rem">
        <Text>Meu Link:</Text>
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
      </HStack>
    </Flex>
  );
};
