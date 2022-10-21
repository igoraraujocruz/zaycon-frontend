import { Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { AdminHeader } from '../../../components/AdminHeader';
import { Can } from '../../../components/Can';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import CreateClients from './create';
import GetClients from './get';
import { useClients } from '../../../services/hooks/useClients';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const Clients = () => {
  const { data } = useClients();
  const clientsCreatedAt = [];
  const count = [];
  const week = [];

  function dates(current: Date) {
    current.setDate(current.getDate() - current.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      week.push(
        new Date(current).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      );
      current.setDate(current.getDate() + 1);
    }
    return week;
  }

  dates(new Date());

  data?.clients.map(client =>
    clientsCreatedAt.push(
      new Date(client.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    ),
  );

  const chartFilter = clientsCreatedAt.filter(element =>
    week.includes(element),
  );

  chartFilter.forEach(element => {
    count[element] = (count[element] || 0) + 1;
  });

  const options: ApexOptions = {
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
      categories: week,
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
      data: [
        count[week[0]] === undefined ? 0 : count[week[0]],
        count[week[1]] === undefined ? 0 : count[week[1]],
        count[week[2]] === undefined ? 0 : count[week[2]],
        count[week[3]] === undefined ? 0 : count[week[3]],
        count[week[4]] === undefined ? 0 : count[week[4]],
        count[week[5]] === undefined ? 0 : count[week[5]],
        count[week[6]] === undefined ? 0 : count[week[6]],
      ],
    },
  ];

  return (
    <Box>
      <AdminHeader />
      <Can permissions={['Listar Cliente']}>
        <Chart options={options} series={series} type="line" height={194} />
      </Can>
      <Flex justify="center" flexDir={['column', 'column', 'row']}>
        <Can permissions={['Cadastrar Cliente']}>
          <Flex mt="2rem" justify="center">
            <CreateClients />
          </Flex>
        </Can>
        <Can permissions={['Listar Cliente']}>
          <Flex justify="center" pl="2rem">
            <GetClients />
          </Flex>
        </Can>
      </Flex>
    </Box>
  );
};

export default Clients;

export const getServerSideProps = withSSRAuth(
  async ctx => {
    return {
      props: {},
    };
  },
  {
    permissions: [
      'Cadastrar Cliente',
      'Deletar Cliente',
      'Editar Cliente',
      'Listar Cliente',
    ],
  },
);
