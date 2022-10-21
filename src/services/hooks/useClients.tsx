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
  points: number;
  shop: [
    {
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
        photos: [
          {
            id: string;
            url: string;
          },
        ];
      };
      createdAt: string;
    },
  ];
}

interface CreateClientProps {
  name: string;
  cpf: string;
  birthday: string;
  mobilePhone: string;
  email: string;
}

interface ClientsAndQuantityOfClients {
  clients: Client[];
  quantityOfClients: number;
}

export const getClients = async (
  page: number,
  clientsPerPage: number,
): Promise<ClientsAndQuantityOfClients> => {
  if (page) {
    const { data } = await api.get(
      `/clients?page=${page}&clientsPerPage=${clientsPerPage}`,
    );
    const { data: total } = await api.get(`/clients`);

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
        points: client.points,
        shop: client.shop,
        createdAt: new Date(client.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      };
    });

    return { clients, quantityOfClients: total.length };
  }

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
      points: client.points,
      shop: client.shop,
      createdAt: client.createdAt,
    };
  });

  return { clients, quantityOfClients: data.length };
};

export function useClients(page?: number, clientsPerPage?: number) {
  return useQuery(['clients', page, clientsPerPage], () =>
    getClients(page, clientsPerPage),
  );
}

const getClientById = async (clientId: string): Promise<Client> => {
  if (clientId) {
    const { data } = await api.get(`/clients/?clientId=${clientId}`);

    return data;
  }
};

export function useClient(clientId: string) {
  return useQuery(['client', clientId], () => getClientById(clientId));
}

export async function createClients(client: CreateClientProps) {
  await api.post('/clients', client);

  queryClient.invalidateQueries('clients');
}

export async function deleteClient(clientId: string) {
  await api.delete(`/clients/${clientId}`);

  queryClient.invalidateQueries('clients');
}
