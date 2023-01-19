import { Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../services/hooks/useCart';

import BagModal, { IBagModal } from '../Modais/BagModal';
import MyShops, { ContractMyShopsModal } from '../Modais/MyShops';

export const Footer = () => {
  const bagModal = useRef<IBagModal>(null);
  const modalMyShops = useRef<ContractMyShopsModal>(null);
  const [totalDeItems, setTotalDeItems] = useState(0);
  const { cart } = useCart();

  useEffect(() => {
    const totalItems = cart?.reduce((acc, next) => acc + next.amount, 0);

    setTotalDeItems(totalItems);
  }, [cart]);

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
      <MyShops ref={modalMyShops} />
      <Flex justify="center" w="100%">
        <HStack
          mt="-2rem"
          justify="center"
          spacing="1rem"
          cursor="pointer"
          align="center"
        >
          <VStack
            p="1rem"
            bg="itemColor"
            color="white"
            borderRadius="1rem"
            onClick={() => bagModal.current.onOpen()}
            h="100%"
          >
            <Flex mt="-0.9rem" flexDir="column" align="center">
              <Text>{totalDeItems}</Text>
              <Image
                mt="-1.2rem"
                alt="carrinho-de-compras"
                src="carrinho-de-compras.png"
              />
              <Text>Meu Carrinho</Text>
            </Flex>
          </VStack>
          <VStack
            p="0.5rem"
            bg="itemColor"
            color="white"
            borderRadius="1rem"
            onClick={() => modalMyShops.current.onOpen()}
          >
            <Image alt="minhas-compras" src="minhas-compras.png" />
            <Text color="white">Minhas Compras</Text>
          </VStack>
        </HStack>
      </Flex>
    </Flex>
  );
};
