import { Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRef } from 'react';

import BagModal, { IBagModal } from '../Modais/BagModal';

export const Footer = () => {
  const bagModal = useRef<IBagModal>(null);
  return (
    <Flex
      bg="itemColor"
      boxShadow="15px 2px 6px rgba(0,0,0,0.4)"
      position="fixed"
      bottom="0px"
      h={['3rem']}
      w="100%"
    >
      <BagModal ref={bagModal} />
      <Flex justify="center" w="100%">
        <HStack
          mt="-2rem"
          justify="center"
          spacing="1rem"
          cursor="pointer"
          align="center"
        >
          <VStack
            p="0.5rem"
            bg="itemColor"
            color="white"
            borderRadius="1rem"
            onClick={() => bagModal.current.onOpen()}
          >
            <Image alt="carrinho-de-compras" src="carrinho-de-compras.png" />
            <Text>Meu Carrinho</Text>
          </VStack>
          <VStack p="0.5rem" bg="itemColor" color="white" borderRadius="1rem">
            <Image alt="minhas-compras" src="minhas-compras.png" />
            <Text color="white">Minhas Compras</Text>
          </VStack>
        </HStack>
      </Flex>
    </Flex>
  );
};
