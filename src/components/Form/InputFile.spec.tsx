import { render } from '@testing-library/react';
import { InputFile } from './InputFile';

describe('Footer Component', () => {
  it('renders correctly', () => {
    const { container } = render(<InputFile />);
    expect(container.querySelector('#sandbox > div > div > input')).toBe(null);
  });
});
