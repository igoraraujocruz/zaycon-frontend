import { Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useContext } from 'react';
import { signOut } from '../../services/hooks/useAuth';
import { SocketContext } from '../../services/hooks/useSocket';
import { useSeller } from '../../services/hooks/useSellers';
import { queryClient } from '../../services/queryClient';

export const HeaderPainel = () => {
  const { data } = useSeller();

  const myLink = `https://zaycon.shop/?seller=${data?.username.replace(
    / /g,
    '%20',
  )}`;

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

  const handleCopyClick = () => {
    copyTextToClipboard(myLink);
  };

  const socket = useContext(SocketContext);

  socket.on('receivePaimentAdmin', async () => {
    await queryClient.invalidateQueries('seller');
  });

  return (
    <Flex
      mt="1rem"
      flexDir={['column', 'column', 'column', 'row']}
      justify="space-evenly"
      align="center"
      w="100%"
      color="white"
    >
      <Flex align="center" justify="center" flexDir="row" w="33%">
        <HStack>
          <Heading size="lg">Zaycon</Heading>
          <Link href="/">
            <Button bg="gray.800" _hover={{ bg: 'orangeHover' }}>
              Ir para a Loja
            </Button>
          </Link>
          <Button
            onClick={() => signOut()}
            bg="gray.800"
            _hover={{ bg: 'orangeHover' }}
          >
            Sair
          </Button>
        </HStack>
      </Flex>

      <Flex
        align="center"
        justify="center"
        w="33%"
        mt={['1rem', '1rem', '1rem', 0]}
      >
        <VStack>
          <Text>Olá, {data?.name}</Text>
          <Text>Meus pontos: {data?.points}</Text>
        </VStack>
      </Flex>

      <Flex
        flexDir={['column', 'column', 'column', 'row']}
        justify="center"
        align="center"
        w="33%"
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
  );
};
