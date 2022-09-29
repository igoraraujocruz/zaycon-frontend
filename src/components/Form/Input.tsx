import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  Text,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
  labelInside?: string;
  mask?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, labelInside, label, error = null, mask, bg, ...rest },
  ref,
) => {
  const [focus, setFocus] = useState(false)
  const teste = () => {
    setFocus(!focus)
  }

  return (
  <FormControl isInvalid={!!error}>
    {!!label && (
      <FormLabel id={`label-${name}`} htmlFor={name}>
        {label}
      </FormLabel>
    )}
    <Flex onBlur={() => teste()} onFocus={() => teste()} align={'center'} bg="gray.900" border={focus ? '0.15rem solid #FF6B00' : '0.15rem solid transparent'} borderRadius='0.3rem'>
      <Text ml='0.7rem'>{labelInside}</Text>
        <ChakraInput
          mask={mask}
          name={name}
          id={name}
          border='0'
          bgColor="gray.900"
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
  )
};

export const Input = forwardRef(InputBase);
