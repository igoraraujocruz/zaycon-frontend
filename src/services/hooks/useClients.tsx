import { useMutation, useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

interface Client {
  id: string;
  name: string;
  email: string;
  mobilePhone: string;
  birthday: string;
  createdAt: string;
}

interface CreateClientProps {
  name: string;
  cpf: string;
  birthday: string;
  mobilePhone: string;
  email: string;
}

export const getClients = async (): Promise<Client[]> => {
  const { data } = await api.get('/clients');

  const clients = data.map(client => {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      mobilePhone: client.mobilePhone,
      birthday: new Date(client.birthday).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      createdAt: new Date(client.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return clients;
};

export function useClients() {
  return useQuery(['clients'], () => getClients());
}

export async function createClients(client: CreateClientProps) {
  await api.post('/clients', client);

  queryClient.invalidateQueries('clients');
}

export async function deleteProducts(clientId: string) {
  await api.delete(`/clients/${clientId}`);

  queryClient.invalidateQueries('clients');
}
