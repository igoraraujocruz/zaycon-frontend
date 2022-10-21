import { render, screen } from '@testing-library/react';
import { NavLink } from './index';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        to: '/',
      };
    },
  };
});

describe('ActiveLink Component', () => {
  it('renders correctly', () => {
    render(<NavLink to="/products">Products</NavLink>);

    expect(screen.getByText('Products')).toBeInTheDocument();
  });
});
