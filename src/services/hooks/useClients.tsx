import { useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

export interface Client {
  id: string;
  name: string;
  email: string;
  mobilePhone: string;
  birthday: string;
  createdAt: string;
  shop: [{
    id: string;
    quantity: number;
    typeOfPayment: string;
    product: {
      id: string;
      name: string;
      price: number;
      creditPoints: number;
      debitPoints: number;
      description: string;
      createdAt: string;
      photos: [{
        id: string;
        url: string;
      }]
    }
    createdAt: string;
  }]
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

  const clients = data.map((client: Client) => {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      mobilePhone: client.mobilePhone,
      birthday: new Date(client.birthday).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      shop: client.shop,
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

export async function deleteClient(clientId: string) {
  await api.delete(`/clients/${clientId}`);

  queryClient.invalidateQueries('clients');
}
