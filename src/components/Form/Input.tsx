import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import {
  ComponentType,
  forwardRef,
  ForwardRefRenderFunction,
  useState,
} from 'react';
import { FieldError } from 'react-hook-form';
import { IconBaseProps } from 'react-icons';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
  icon?: ComponentType<IconBaseProps>;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, icon: Icon, bg, ...rest },
  ref,
) => {
  const [focus, setFocus] = useState(false);
  const changeFocus = () => {
    setFocus(!focus);
  };

  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel id={`label-${name}`} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Flex
        onBlur={() => changeFocus()}
        onFocus={() => changeFocus()}
        align="center"
        bg="gray.900"
        border={focus ? '0.15rem solid #FF6B00' : '0.15rem solid #2d3748'}
        borderRadius="0.3rem"
      >
        {Icon && (
          <Flex ml="1rem">
            <Icon size={20} />
          </Flex>
        )}
        <ChakraInput
          name={name}
          id={name}
          border="0"
          bgColor={bg || 'gray.900'}
          variant="filled"
          _hover={{
            bgColor: 'gray.900',
          }}
          size="lg"
          {...rest}
          ref={ref}
        />
      </Flex>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
