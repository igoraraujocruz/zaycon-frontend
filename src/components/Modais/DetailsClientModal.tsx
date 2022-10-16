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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from 'react';
import { useClient } from '../../services/hooks/useClients';
import ModalNewBuy, { ModalNewBuyHandle } from './NewBuy'

export interface ModalDetailsClient {
  onOpen: () =>  void;
  onClose: () => void;
}

interface Client {
  client: {
    id: string;
    name: string;
    email: string;
    mobilePhone: string;
    birthday: string;
    createdAt: string;
    points: number;
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


const DetailsClientModal: ForwardRefRenderFunction<ModalDetailsClient, Client> = ({ client }: Client, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const newBuyModalRef = useRef<ModalNewBuyHandle>(null)
  const { data: clientData } = useClient(client.id)


  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalNewBuy ref={newBuyModalRef} client={client} />
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="orange"
            _hover={{ bg: 'orange' }}
            color="#fff"
          />
          <ModalHeader>
            <Heading>{client.name}</Heading>
            <Text>{client.mobilePhone}</Text>
            <Text>{client.birthday}</Text>
            <Text>{client.email}</Text>
            <Button bg={'orange'} _hover={{ bg: 'gray.900'}} onClick={() => newBuyModalRef.current.onOpen()}>Nova Compra</Button>
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
                    Forma de pagamento
                  </Th>
                  <Th>
                    Total de pontos ganhos ou retirados
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {clientData?.shop.map(purchase => 
                  <Tr key={purchase.id} color={purchase.typeOfPayment == 'creditPoints' && 'orange'}>
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
                    {purchase.typeOfPayment == 'creditPoints' ? purchase.product.debitPoints : 
                      purchase.product.creditPoints}
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
                      {purchase.typeOfPayment === 'creditCard' && 'Cartão de Crédito'}
                      {purchase.typeOfPayment === 'debitCard' && 'Cartão de Debito'}
                      {purchase.typeOfPayment === 'money' && 'Dinheiro'}
                      {purchase.typeOfPayment === 'pix' && 'Pix'}
                      {purchase.typeOfPayment === 'picpay' && 'Picpay'}
                      {purchase.typeOfPayment === 'creditPoints' && 'SnapPoints'}
                    </Td>
                    <Td>
                      {purchase.typeOfPayment == 'creditPoints' ? `- ${purchase.quantity * purchase.product.debitPoints}`
                       : `+ ${purchase.quantity * purchase.product.creditPoints}`}
                    </Td>
                  </Tr>
                )}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Total de Pontos</Th>
                  <Td border={'0'}>{clientData?.points}</Td>
                </Tr>
              </Tfoot>
            </Table>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}

export default forwardRef(DetailsClientModal)
