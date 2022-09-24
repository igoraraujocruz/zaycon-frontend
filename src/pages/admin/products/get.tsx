import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { BsTrashFill } from 'react-icons/bs';
import { ImagesModal } from '../../../components/Modais/ImagesModal';
import { useProducts } from '../../../services/hooks/useProducts';
import { useCallback, useRef, useState } from 'react';
import DeleteModal, { ModalDeleteHandle } from '../../../components/Modais/DeleteModal';

export function GetProducts() {
  const { data, isLoading, error, isFetching } = useProducts();
  const modalDelete = useRef<ModalDeleteHandle>(null);
  const [productId, setProductId] = useState('')

  const openDeleteModal = useCallback((productId: string) => {
    setProductId(productId)
    modalDelete.current.onOpen()
  }, [])

  return (
    <Flex w="70vw" flexDir="column">
      <DeleteModal productId={productId} ref={modalDelete} />
      <Heading alignSelf="center" size="lg" fontWeight="normal">
        Produtos Cadastrados
      </Heading>
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
              <Th>Capa</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {data.map(product => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.description}</Td>
                <Td>R$ {product.price}</Td>
                <Td color="#c30000">- {product.debitPoints}</Td>
                <Td color="#0064cf">+ {product.creditPoints}</Td>
                <Td>{product.slug}</Td>
                <Td>{product.user.name}</Td>
                <Td>{product.createdAt}</Td>
                <Td>
                  <Flex flexDir="column" align="center">
                    {!product.photos[0] ? (
                      <Box>
                        <Image maxW="6rem" src="../imageNotFound.svg" />
                      </Box>
                    ) : (
                      <Zoom overlayBgColorEnd="gray.900">
                        <Image
                          maxW="6rem"
                          cursor="pointer"
                          src={product.photos[0].url}
                        />
                      </Zoom>
                    )}

                    <ImagesModal product={product} />
                  </Flex>
                </Td>
                <Td>
                  <BsTrashFill color="orange" size={25} onClick={() => openDeleteModal(product.id)} cursor="pointer" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
}
