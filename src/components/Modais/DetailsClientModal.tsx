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
  VStack,
  Flex,
  Box,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useClient } from '../../services/hooks/useClients';
import ModalNewBuy, { ModalNewBuyHandle } from './NewBuy';

export interface ModalDetailsClient {
  onOpen: () => void;
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
  };
}

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const DetailsClientModal: ForwardRefRenderFunction<
  ModalDetailsClient,
  Client
> = ({ client }: Client, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const newBuyModalRef = useRef<ModalNewBuyHandle>(null);
  const { data: clientData } = useClient(client.id);
  const shopsCreatedAt = [];
  const shopsCreatedAtRemoveDuplicateDays = [];
  const shopResults = [];
  const count = [];

  clientData?.shop.map(shop =>
    shopsCreatedAt.push(
      new Date(shop.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    ),
  );

  clientData?.shop.map(shop =>
    shopsCreatedAtRemoveDuplicateDays.push(
      new Date(shop.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    ),
  );

  const duplicateDaysRemoved = shopsCreatedAtRemoveDuplicateDays.filter(
    (item, index) => shopsCreatedAtRemoveDuplicateDays.indexOf(item) === index,
  );

  shopsCreatedAt.forEach(element => {
    count[element] = (count[element] || 0) + 1;
  });

  duplicateDaysRemoved.forEach(item => shopResults.push(count[item]));

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        columnWidth: '20%',
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: '#FF6B00',
    },
    colors: ['#FF6B00'],
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      type: 'category',
      axisBorder: {
        color: '#FF6B00',
      },
      axisTicks: {
        color: '#FF6B00',
      },
      categories: duplicateDaysRemoved,
    },
    yaxis: {
      labels: {
        formatter(val) {
          return val.toFixed();
        },
      },
    },
    fill: {
      opacity: 0.6,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityFrom: 0.6,
        opacityTo: 0.9,
      },
    },
  };

  const series = [
    {
      name: 'Clients',
      data: shopResults,
    },
  ];

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalNewBuy ref={newBuyModalRef} client={client} />
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalCloseButton
          bg="orange"
          _hover={{ bg: 'orange', cursor: 'pointer' }}
          color="#fff"
        />
        <ModalHeader>
          <VStack align="flex-start">
            <Heading>{client.name}</Heading>
            <Text>{client.mobilePhone}</Text>
            <Text>{client.birthday}</Text>
            <Text>{client.email}</Text>
            <Button
              bg="orange"
              _hover={{ bg: 'gray.900' }}
              onClick={() => newBuyModalRef.current.onOpen()}
            >
              Nova Compra
            </Button>
          </VStack>
        </ModalHeader>
        <Chart
          options={options}
          series={series}
          type="bar"
          height={180}
          width={875}
        />
        <ModalBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Quantidade</Th>
                <Th>Produto</Th>
                <Th>Preço</Th>
                <Th>Pontos</Th>
                <Th>Data da Compra</Th>
                <Th>Forma de pagamento</Th>
                <Th>Total de pontos ganhos ou retirados</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientData?.shop.map(purchase => (
                <Tr
                  key={purchase.id}
                  color={purchase.typeOfPayment === 'creditPoints' && 'orange'}
                >
                  <Td>{purchase.quantity}</Td>
                  <Td>{purchase.product.name}</Td>
                  <Td>R${purchase.product.price}</Td>
                  <Td>
                    {purchase.typeOfPayment === 'creditPoints'
                      ? purchase.product.debitPoints
                      : purchase.product.creditPoints}
                  </Td>
                  <Td>
                    {new Date(purchase.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Td>
                  <Td>
                    {purchase.typeOfPayment === 'creditCard' &&
                      'Cartão de Crédito'}
                    {purchase.typeOfPayment === 'debitCard' &&
                      'Cartão de Debito'}
                    {purchase.typeOfPayment === 'money' && 'Dinheiro'}
                    {purchase.typeOfPayment === 'pix' && 'Pix'}
                    {purchase.typeOfPayment === 'picpay' && 'Picpay'}
                    {purchase.typeOfPayment === 'creditPoints' && 'SnapPoints'}
                  </Td>
                  <Td>
                    {purchase.typeOfPayment === 'creditPoints'
                      ? `- ${purchase.quantity * purchase.product.debitPoints}`
                      : `+ ${
                          purchase.quantity * purchase.product.creditPoints
                        }`}
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total de Pontos</Th>
                <Td border="0">{clientData?.points}</Td>
              </Tr>
            </Tfoot>
          </Table>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(DetailsClientModal);
