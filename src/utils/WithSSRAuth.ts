import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../errors/AuthTokenError';
import { validateUserPermissions } from './validateUserPermissions';
import { setupAPIClient } from '../services/api';

type withSSRAuthOptions = {
  permissions?: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: withSSRAuthOptions,
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies['snap.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }

    if (options) {
      const apiClient = setupAPIClient(ctx);
      const response = await apiClient.get('/users/get/me');
      const user = response.data;

      const { permissions } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/admin/products',
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'snap.token');
        destroyCookie(ctx, 'snap.refreshToken');

        return {
          redirect: {
            destination: '/admin',
            permanent: false,
          },
        };
      }
    }
  };
}
