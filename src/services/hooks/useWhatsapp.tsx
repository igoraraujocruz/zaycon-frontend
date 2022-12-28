import axios from 'axios';
import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';

export async function instanceIsConnected() {
  const response = await axios.get(
    `https://whatsapp.zaycon.shop/instance/info?key=1&token=a6d54a5w6d65`,
  );

  return {
    instanceConnection: response.data.instance_data.phone_connected,
    instanceKey: response.data.instance_data.instance_key,
  };
}

export function useInfoWhatsappInstance() {
  return useQuery(['infoWhatsappInstance'], () => instanceIsConnected());
}

export async function createWhatsappInstance() {
  const response = await axios.get(
    `https://whatsapp.zaycon.shop/instance/init?key=1&token=a6d54a5w6d65`,
  );

  queryClient.invalidateQueries('infoWhatsappInstance');

  return response.data;
}

export async function scanQrcodeWhatsappInstance(instanceName: string) {
  const response = await axios.get(
    `https://whatsapp.zaycon.shop/instance/qr?key=${instanceName}&token=a6d54a5w6d65`,
  );

  return response.data;
}

export async function logoutWhatsappInstance(instanceName: string) {
  await axios.delete(
    `https://whatsapp.zaycon.shop/instance/logout?key=${instanceName}`,
  );

  queryClient.invalidateQueries('infoWhatsappInstance');
}
