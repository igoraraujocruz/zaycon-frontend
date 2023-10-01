import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { GrInstagram } from 'react-icons/gr';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { TbShoppingBagCheck } from 'react-icons/tb';
import BagModal, { IBagModal } from '../Modais/BagModal';
import { useCart } from '../../services/hooks/useCart';
import MyShops, { ContractMyShopsModal } from '../Modais/MyShops';

export const Header = () => {
  const bagModal = useRef<IBagModal>(null);
  const modalMyShops = useRef<ContractMyShopsModal>(null);
  const [totalDeItems, setTotalDeItems] = useState(0);
  const { cart } = useCart();

  useEffect(() => {
    const totalItems = cart?.reduce((acc, next) => acc + next.amount, 0);

    setTotalDeItems(totalItems);
  }, [cart]);
  return (
    <Grid
      color="#fff"
      bg="itemColor"
      templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(3, 1fr)']}
      position="fixed"
      zIndex={1}
      w="100%"
    >
      <BagModal ref={bagModal} />
      <MyShops ref={modalMyShops} />
      <GridItem w="100%" h={[0, 0, '5rem']} />
      <GridItem w="100%" h={['2rem', '2rem', '5rem']} mt="1rem">
        <Flex gap={5} justify="center" align="center">
          <Heading mt="0.5rem" fontWeight="hairline">
            Zaycon
          </Heading>
          <HStack spacing="1rem">
            <Link href="https://www.instagram.com/zaycon.connect" isExternal>
              <Flex cursor="pointer">
                <GrInstagram color="#fff" size={20} />
              </Flex>
            </Link>
            <Link
              isExternal
              href="https://api.whatsapp.com/send?phone=5527999147896&text=Olá, gostaria de saber mais sobre os produtos"
            >
              <Image
                cursor="pointer"
                minW="1.4rem"
                maxW="1.4rem"
                src="whatsapp.svg"
                alt="whatsapp"
              />
            </Link>
            <VStack
              spacing={0}
              cursor="pointer"
              onClick={() => bagModal.current.onOpen()}
            >
              <Text pos="absolute" mt={-3}>
                {totalDeItems}
              </Text>
              <AiOutlineShoppingCart size={28} />
              <Text>Meu Carrinho</Text>
            </VStack>
            <VStack
              spacing={0}
              color="white"
              onClick={() => modalMyShops.current.onOpen()}
              cursor="pointer"
            >
              <TbShoppingBagCheck size={28} />
              <Text>Minhas Compras</Text>
            </VStack>
          </HStack>
        </Flex>
      </GridItem>
      <GridItem mt={['1.5rem', '1.5rem', 0]}>
        <HStack
          spacing="1rem"
          h="100%"
          pr={[0, 0, '4rem']}
          pl={['0.5rem', '0.5rem']}
          justify={['center', 'center', 'end']}
          align={['flex-end', 'flex-end', 'center']}
        >
          <Link href="/newSeller" w="10rem">
            <Text cursor="pointer">Quero ser um vendedor</Text>
          </Link>
          <Link href="/admin">
            <Text cursor="pointer">Acessar</Text>
          </Link>
        </HStack>
      </GridItem>
    </Grid>
  );
};
