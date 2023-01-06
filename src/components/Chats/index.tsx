import {
  Box,
  Button,
  Flex,
  HStack,
  Img,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/apiClient';
import { useAccount, useChatByAccount } from '../../services/hooks/useChats';
import { SocketContext } from '../../services/hooks/useSocket';
import { queryClient } from '../../services/queryClient';

type MessageValidate = {
  message: string;
};

interface Account {
  id: string;
  name: string;
  platform: string;
  referencePoint: string;
  createdAt: string;
}

const messageSchema = yup.object().shape({
  message: yup.string().required(),
});

export const Chats = () => {
  const [infoAccount, setInfoAccount] = useState({} as Account);
  const { data } = useAccount();
  const { data: dataChatByAccount } = useChatByAccount(infoAccount.id);
  const socket = useContext(SocketContext);
  const messageEndRef = useRef(null);

  const { register, handleSubmit, reset } = useForm<MessageValidate>({
    resolver: yupResolver(messageSchema),
  });

  const getData = useCallback((account: Account) => {
    setInfoAccount(account);
  }, []);

  socket.on('newMessage', async () => {
    await queryClient.invalidateQueries('account');
    await queryClient.invalidateQueries('ChatByAccount');
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [dataChatByAccount]);

  const onSubmit: SubmitHandler<MessageValidate> = async ({
    message,
  }: MessageValidate) => {
    try {
      await api.post('/chat/webhook', {
        name: infoAccount.name,
        message,
        platform: infoAccount.platform,
        referencePoint: infoAccount.referencePoint,
      });

      reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex bg="red" w="100%" h="100%">
      <VStack bg="gray.800" h="100%" w="25rem">
        {data?.map(chat => (
          <HStack
            key={chat.id}
            align="center"
            bg={infoAccount.id === chat.id && 'gray.700'}
            _hover={{ background: 'gray.700' }}
            p="2rem"
            justifyContent="space-between"
            onClick={() => getData(chat)}
            transition={['background 200ms']}
            cursor="pointer"
            justify="center"
            w="100%"
            h="3.5rem"
          >
            <Text>{chat.name}</Text>
            {chat.platform === 'Whatsapp' && (
              <Box
                fill="white"
                bg="#4dc247"
                borderRadius={50}
                w="2rem"
                h="2rem"
              >
                <svg viewBox="0 0 32 32">
                  <path
                    d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
                    fillRule="evenodd"
                  />
                </svg>
              </Box>
            )}
            {chat.platform === 'Instagram' && (
              <Img src="instagram-icon.svg" w="2rem" alt="instagram icon" />
            )}
          </HStack>
        ))}
      </VStack>

      <VStack bg="gray.700" w="100%">
        <VStack
          p="2rem"
          align="flex-start"
          w="100%"
          h="100%"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#FF6B00',
              borderRadius: '24px',
            },
          }}
        >
          {dataChatByAccount?.map(message => (
            <HStack
              key={message._id}
              bg={message.isClient ? 'gray.800' : 'gray.600'}
              borderRadius="2rem"
              pr="2rem"
            >
              <Text fontSize="0.7rem">({message.createdAt}) : </Text>
              <Text>{message.message}</Text>
            </HStack>
          ))}

          <Flex ref={messageEndRef} />
        </VStack>
        <HStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          align="center"
          w="100%"
          justify="center"
          h="4rem"
        >
          <Input w="80%" h="3rem" {...register('message')} />
          <Button type="submit" bg="orangeHover">
            Enviar
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};
