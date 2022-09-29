import {
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import 'react-medium-image-zoom/dist/styles.css';
import { BsTrashFill } from 'react-icons/bs';
import UploadImageModal, { UploadImageModalHandle } from '../../../components/Modais/UploadImageModal';
import { Product, useProducts } from '../../../services/hooks/useProducts';
import { useCallback, useRef, useState } from 'react';
import DeleteModal, { ModalDeleteHandle } from '../../../components/Modais/DeleteModal';
import { SearchInput } from '../../../components/Form/SearchInput';
import { useForm } from 'react-hook-form';
import { api } from '../../../services/apiClient';

interface SearchProps {
  search: string;
}

export function GetProducts() {
  const { data, isLoading, error, isFetching } = useProducts();
  const modalDelete = useRef<ModalDeleteHandle>(null);
  const modalUploadImage = useRef<UploadImageModalHandle>(null);
  const [productId, setProductId] = useState('')
  const [product, setProduct] = useState({} as Product)
  const [itemFilters, setItemFilters] = useState<Product[]>([])
  const { register, handleSubmit } = useForm()

  const openDeleteModal = useCallback((productId: string) => {
    setProductId(productId)
    modalDelete.current.onOpen()
  }, [])

  const openUploadModal = useCallback((product: Product) => {
    setProduct(product)
    modalUploadImage.current.onOpen()
  }, [])

  const onSubmit = async ({search}: SearchProps) => {
    try {
      await api.get(`/products/search/${search}`)
      .then(response => setItemFilters(response.data))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Flex w="70vw" flexDir="column">
      <DeleteModal productId={productId} ref={modalDelete} />
      <UploadImageModal product={product} ref={modalUploadImage} />
      <Heading alignSelf="flex-start" size="lg" borderBottom={'0.5rem solid #FF6B00'} fontWeight="normal">
        Produtos
      </Heading>
      <HStack as={'form'} onSubmit={handleSubmit(onSubmit)} justify={'flex-end'}>
        <SearchInput w={'18rem'} borderColor='gray.600' name='search' {...register('search', {
          onChange() {
            setItemFilters([])
          },
        })} />
        <Button bg={'orange'} _hover={{ bg: 'orangeHover' }} type={'submit'}>Procurar</Button>
      </HStack>
      <Flex h={'2rem'}>  
      {!isLoading && isFetching && (
          <Spinner size="sm" color="gray.500" ml="4" />
      )}
      </Flex>

      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Falha ao obter dados dos produtos.</Text>
        </Flex>
      ) : (
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Nome do Produto</Th>
              <Th>Descrição</Th>
              <Th>Preço</Th>
              <Th>Pontos Débito</Th>
              <Th>Pontos Crédito</Th>
              <Th>Slug</Th>
              <Th>Cadastrado por:</Th>
              <Th>Data do cadastro</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {itemFilters.length ? itemFilters.map(product => 
              <Tr key={product.id}>
              <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.name}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.description}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer'>R$ {product.price}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer' color="#c30000">- {product.debitPoints}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer' color="#0064cf">+ {product.creditPoints}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.slug}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.user.name}</Td>
              <Td onClick={() => openUploadModal(product)} cursor='pointer'>
                {
                  new Date(product.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                }
              </Td>
              <Td color={'gray.600'} _hover={{ color: '#FF6B00'}} transition="color 200ms" cursor='pointer'>
                  <BsTrashFill size={25} onClick={() => openDeleteModal(product.id)} cursor="pointer" />
              </Td>
            </Tr>
            ) :
            data.map(product => (
              <Tr key={product.id}>
                <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.name}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.description}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer'>R$ {product.price}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer' color="#c30000">- {product.debitPoints}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer' color="#0064cf">+ {product.creditPoints}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.slug}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.user.name}</Td>
                <Td onClick={() => openUploadModal(product)} cursor='pointer'>{product.createdAt}</Td>
                <Td color={'gray.600'} _hover={{ color: '#FF6B00'}} transition="color 200ms">
                  <BsTrashFill size={25} onClick={() => openDeleteModal(product.id)} cursor="pointer" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
