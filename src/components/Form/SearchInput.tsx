import {
  Input as ChakraSearchInput,
  InputProps as ChakraSearchInputProps,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface SearchInputProps extends ChakraSearchInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
}

const SearchInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  SearchInputProps
> = ({ name, label, error = null, bg, ...rest }, ref) => (
  <ChakraSearchInput
    name={name}
    id={name}
    focusBorderColor="#fff"
    bgColor="gray.900"
    variant="filled"
    _hover={{
      bgColor: 'gray.900',
    }}
    size="lg"
    {...rest}
    ref={ref}
  />
);

export const SearchInput = forwardRef(SearchInputBase);
