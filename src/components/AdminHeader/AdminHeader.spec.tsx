import { render, screen } from '@testing-library/react';
import { AdminHeader } from './index';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        to: '/',
      };
    },
  };
});

describe('AdminHeader Component', () => {
  it('renders correctly', () => {
    render(<AdminHeader />);

    expect(screen.getByText('Sair')).toBeInTheDocument();
  });
});
