import { useQuery } from 'react-query';
import { api } from '../apiClient';

interface Account {
  _id: string;
  name: string;
  plataform: string;
  numberPhone: string;
  createdAt: string;
}

interface NewAccount {
  id: string;
  name: string;
  plataform: string;
  numberPhone: string;
  createdAt: string;
}

interface Message {
  _id: string;
  accountId: string;
  message: string;
  createdAt: string;
  isClient: boolean;
}

export const getAccounts = async (): Promise<NewAccount[]> => {
  const { data } = await api.get('/chat');

  const chat = data.map((account: Account) => {
    return {
      id: account._id,
      name: account.name,
      plataform: account.plataform,
      numberPhone: account.numberPhone,
      createdAt: new Date(account.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });

  return chat;
};

export function useAccount() {
  return useQuery(['account'], () => getAccounts());
}

export const getChatByAccount = async (
  accountId: string,
): Promise<Message[]> => {
  if (accountId) {
    console.log(accountId);
    const { data } = await api.get(`/chat/chatByAccount?account=${accountId}`);

    console.log(data);

    const chat = data.map((message: Message) => {
      return {
        _id: message._id,
        accountId: message.accountId,
        message: message.message,
        isClient: message.isClient,
        createdAt: new Date(message.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });

    return chat;
  }
};

export function useChatByAccount(accountId: string) {
  return useQuery(['ChatByAccount', accountId], () =>
    getChatByAccount(accountId),
  );
}
