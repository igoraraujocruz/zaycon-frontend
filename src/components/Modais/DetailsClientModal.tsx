import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalHeader,
  Text,
  Heading,
  ListItem,
  UnorderedList,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle } from 'react';

export interface ModalDetailsClient {
  onOpen: () =>  void;
  onClose: () => void;
}

interface ClientProps {
  client: {
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
}

const DetailsClientModal: ForwardRefRenderFunction<ModalDetailsClient, ClientProps> = ({client}: ClientProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="#ff6a0099"
            _hover={{ bg: 'orange' }}
            color="black"
          />
          <ModalHeader>
            <Heading>{client.name}</Heading>
            <Text>{client.mobilePhone}</Text>
            <Text>{client.birthday}</Text>
            <Text>{client.email}</Text>
          </ModalHeader>
          <ModalBody>
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    Quantidade
                  </Th>
                  <Th>
                    Produto
                  </Th>
                  <Th>
                    Preço
                  </Th>
                  <Th>
                    Pontos
                  </Th>
                  <Th>
                    Data da Compra
                  </Th>
                  <Th>
                    Pontos por compra
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {client.shop?.map(purchase => 
                  <Tr>
                    <Td>
                      {purchase.quantity}
                    </Td>
                    <Td>
                      {purchase.product.name}
                    </Td>
                    <Td>
                      R${purchase.product.price}
                    </Td>
                    <Td>
                      {purchase.product.creditPoints}
                    </Td>
                    <Td>
                      {
                        new Date(purchase.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      }
                    </Td>
                    <Td>
                      {purchase.quantity * purchase.product.creditPoints}
                    </Td>
                  </Tr>
                )}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Total de Pontos</Th>
                  <Td border={'0'}>{client.shop?.map(purchase => purchase.quantity * purchase.product.creditPoints).reduce((prev, curr) => prev + curr, 0)}</Td>
                </Tr>
              </Tfoot>
            </Table>
            {/* <Heading size={'md'}>Pontuação Total</Heading>
            <Text>{client.shop?.map(purchase => purchase.quantity * purchase.product.creditPoints).reduce((prev, curr) => prev + curr, 0)}</Text>
            <Text>Produtos Comprados</Text>
            <UnorderedList>
              {client.shop?.map(purchase => <ListItem>
                {purchase.quantity} x {purchase.product.name} {purchase.product.creditPoints} - {
                  new Date(purchase.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                }
            </ListItem>)}
            </UnorderedList> */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="white"
              bg="#ff6a0099"
              _hover={{ bg: 'orange' }}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}

export default forwardRef(DetailsClientModal)
