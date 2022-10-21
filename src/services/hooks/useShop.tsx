import { api } from '../apiClient';
import { queryClient } from '../queryClient';

interface CreateNewShop {
  quantity: number;
  productId: string;
  clientId: string;
  typeOfPayment: string;
}

export async function createShop({
  clientId,
  productId,
  quantity,
  typeOfPayment,
}: CreateNewShop) {
  await api.post('/shop', {
    clientId,
    productId,
    quantity,
    typeOfPayment,
  });

  queryClient.invalidateQueries('client');
}
