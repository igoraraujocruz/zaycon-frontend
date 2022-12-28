import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';

import Router from 'next/router';
import { useEffect, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import {
  createWhatsappInstance,
  logoutWhatsappInstance,
  useInfoWhatsappInstance,
} from '../../services/hooks/useWhatsapp';

export const WhatsappClient = () => {
  const { data } = useInfoWhatsappInstance();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [linkInstance, setLinkInstance] = useState('');

  const toast = useToast();

  const createInstance = async () => {
    try {
      const instance = await createWhatsappInstance();
      toast({
        title: 'Instancia criada com sucesso!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setLinkInstance(instance.qrcode.url);
    } catch (error) {
      toast({
        title: 'Não foi possível criar a instancia',
        description: error.response?.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex justify="center" align="center">
      {data?.instanceConnection ? (
        <Text mr="0.5rem" fontWeight={600} color="green">
          Conectado
        </Text>
      ) : (
        <Text mr="0.5rem" fontWeight={600} color="red">
          Desconectado
        </Text>
      )}
      <Box
        fill="white"
        bg="#4dc247"
        cursor="pointer"
        borderRadius={50}
        w={['3rem']}
        h={['3rem']}
        onClick={() => onOpen()}
      >
        <svg viewBox="0 0 32 32">
          <path
            d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
            fillRule="evenodd"
          />
        </svg>

        <Modal size="xs" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="gray.900">
            <ModalCloseButton
              bg="orange"
              _hover={{ bg: 'orangeHover' }}
              color="#fff"
            />
            <ModalHeader />
            <ModalBody>
              {!linkInstance ? (
                <Flex justify="center">
                  <Button
                    onClick={() => createInstance()}
                    bg="gray.800"
                    _hover={{ bg: 'orangeHover' }}
                  >
                    Criar Instancia
                  </Button>
                </Flex>
              ) : (
                <Flex justify="center">
                  <Link href={linkInstance} isExternal>
                    <Button bg="gray.800" _hover={{ bg: 'orangeHover' }}>
                      Ler Qrcode
                    </Button>
                  </Link>
                </Flex>
              )}
              <VStack>
                <Heading mt="1rem" size="md">
                  Instancia
                </Heading>
                {data?.instanceConnection ? (
                  <HStack key={data.instanceKey} spacing="0.5rem">
                    <Text>{data.instanceKey}</Text>
                    <BsTrashFill
                      cursor="pointer"
                      onClick={() => logoutWhatsappInstance(data.instanceKey)}
                      size={18}
                    />
                  </HStack>
                ) : (
                  <Text>Instancia não conectada</Text>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};
