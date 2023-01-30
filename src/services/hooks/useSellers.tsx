import { useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

interface Photo {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  photos: Photo[];
}

interface SellerOrder {
  id: string;
  answered: boolean;
  productId: string;
  product: Product;
  points: number;
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  username: string;
  points: number;
  email: string;
  numberPhone: string;
  emailConfirm: boolean;
  isAdmin: boolean;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  sellerOrders: SellerOrder[];
}

interface CreateSellerProps {
  name: string;
  username: string;
  password: string;
  numberPhone: string;
  email: string;
  birthday: Date;
}

export const getSellers = async (): Promise<Seller[]> => {
  const { data } = await api.get('sellers');

  const sellers = data.map((seller: Seller) => {
    return {
      id: seller.id,
      name: seller.name,
      username: seller.username,
      points: seller.points,
      email: seller.email,
      numberPhone: seller.numberPhone,
      emailConfirm: seller.emailConfirm,
      isAdmin: seller.isAdmin,
      birthday: new Date(seller.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      createdAt: new Date(seller.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      updatedAt: new Date(seller.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      sellerOrders: seller.sellerOrders,
    };
  });

  return sellers;
};

export function useSellers() {
  return useQuery(['sellers'], () => getSellers());
}

export const getSeller = async (): Promise<any> => {
  const { data } = await api.get('/sellers/me');

  return data;
};

export function useSeller() {
  return useQuery(['seller'], () => getSeller());
}

export const getOneSeller = async (sellerId: string): Promise<Seller> => {
  if (sellerId.length > 0) {
    const { data } = await api.get(`/sellers?sellerId=${sellerId}`);

    return data;
  }
};

export function useOneSeller(sellerId: string) {
  return useQuery(['getOneseller', sellerId], () => getOneSeller(sellerId));
}

export async function createSeller(seller: CreateSellerProps) {
  await api.post('/sellers', seller);

  queryClient.invalidateQueries('users');
}

export async function deleteSeller(sellerId: string) {
  await api.delete(`/sellers/${sellerId}`);

  queryClient.invalidateQueries('sellers');
}

export async function resetPassword(
  token: string,
  newPassword: string,
  newPasswordConfirm: string,
) {
  await api.post(`password/reset/${token}`, {
    password: newPassword,
    password_confirmation: newPasswordConfirm,
  });
}
