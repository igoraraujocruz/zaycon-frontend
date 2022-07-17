import { useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  creditPoints: number;
  debitPoints: number;
  createdAt: string;
  photos: [
    {
      id: string;
      name: string;
      url: string;
    },
  ];
  user: {
    id: string;
    name: string;
  };
}

interface CreateProductProps {
  name: string;
  description: string;
  price: number;
  creditPoints: number;
  debitPoints: number;
  photos: File[];
}

interface PhotosProps {
  photos: File[];
  productId: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products');

  const products = data.map(product => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      slug: product.slug,
      creditPoints: product.creditPoints,
      debitPoints: product.debitPoints,
      photos: product.photos,
      createdAt: new Date(product.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      user: product.user,
    };
  });

  return products;
};

export function useProducts() {
  return useQuery(['products'], () => getProducts());
}

export const getProduct = async (productSlug: string): Promise<Product> => {
  const { data } = await api.get(`/products/${productSlug}`);

  return data;
};

export function useProduct(productSlug: string) {
  return useQuery(['product'], () => getProduct(productSlug));
}

export async function createProduct(product: CreateProductProps) {
  const formData = new FormData();

  formData.append('name', product.name);
  formData.append('price', product.price.toString());
  formData.append('description', product.description);
  formData.append('debitPoints', product.debitPoints.toString());
  formData.append('creditPoints', product.creditPoints.toString());

  product.photos.forEach(file => {
    formData.append('photos', file);
  });

  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  await api.post('/products', formData, config);

  queryClient.invalidateQueries('products');
}

export async function deleteProducts(productId: string) {
  await api.delete(`/products/${productId}`);

  queryClient.invalidateQueries('products');
}

export async function createPhotos({ productId, photos }: PhotosProps) {
  const formData = new FormData();

  photos.forEach(file => {
    formData.append('photos', file);
  });

  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  await api.post(`/photos/${productId}`, formData, config);

  queryClient.invalidateQueries('products');
}
