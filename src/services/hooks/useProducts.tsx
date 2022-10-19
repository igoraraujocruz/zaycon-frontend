import { useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

export interface Product {
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

interface UpdateProductProps {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  creditPoints?: number;
  debitPoints?: number;
}

interface PhotosProps {
  photos: File[];
  productId: string;
}

export interface ProductSlug {
  productSlug: string;
}

interface ProductsAndQuantityOfProducts {
  quantityOfProduct: number;
  products: Product[]
}

export const getProducts = async (page: number, perPage: number): Promise<ProductsAndQuantityOfProducts> => {  
  if(page) {
    const { data } = await api.get(`/products?page=${page}&perPage=${perPage}`);
    const { data: total } = await api.get(`/products`);

    const products = data.map((product: Product) => {
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
            month: '2-digit',
            year: 'numeric',
          }),
          user: product.user,
        };
      });

    return {products, quantityOfProduct: total.length};
  }

    const { data } = await api.get('/products');

    const products = data.map((product: Product) => {
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
            month: '2-digit',
            year: 'numeric',
          }),
          user: product.user,
        };
      });

    return {products, quantityOfProduct: data.length};
}

export function useProducts(page?: number, perPage?: number) {
  return useQuery(['products', page, perPage], () => getProducts(page, perPage));
}

export const getProduct = async ({ productSlug }: ProductSlug): Promise<Product> => {
  if (productSlug) {
    const { data } = await api.get(`/products/?productSlug=${productSlug}`);

    return data;
  }
};

export function useProduct(productSlug: ProductSlug) {
  return useQuery(['product', productSlug], () => getProduct(productSlug));
}

export const getProductById = async (productId: string): Promise<Product> => {
  if (productId) {
    const { data } = await api.get(`/products/?productId=${productId}`);

    return data;
  }
};

export function useProductById(productId: string) {
  return useQuery(['productById', productId], () => getProductById(productId));
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

  queryClient.invalidateQueries('productById');
}

export async function updateProduct(product: UpdateProductProps) {

  await api.put('/products/', product);

  queryClient.invalidateQueries('products');
}

export async function deletePhoto(photosId: string) {
  await api.delete(`/photos/${photosId}`);

  queryClient.invalidateQueries('productById');
}
