import nookies from 'nookies';
import axios from 'axios';

export default function Painel() {
  return '';
}

export const getServerSideProps = async ctx => {
  const cookies = nookies.get(ctx);

  const response = await axios.get('http://localhost:3333/sellers/me', {
    headers: {
      Authorization: `Bearer ${cookies['snap.token']}`,
    },
  });

  const seller = response.data;

  if (seller.isAdmin === false) {
    return {
      redirect: {
        destination: '/painelSeller',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/painelAdm',
      permanent: false,
    },
  };
};
