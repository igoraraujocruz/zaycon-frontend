import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Textarea as ChakraTextarea,
    TextareaProps as ChakraTextareaProps,
  } from '@chakra-ui/react';
  import { forwardRef, ForwardRefRenderFunction } from 'react';
  import { FieldError } from 'react-hook-form';
  
  interface TextareaProps extends ChakraTextareaProps {
    name: string;
    label?: string;
    error?: FieldError;
    bg?: string;
  }
  
  const TextAreaBase: ForwardRefRenderFunction<HTMLTextAreaElement, TextareaProps> = (
    { name, label, error = null, bg, ...rest },
    ref,
  ) => (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel id={`label-${name}`} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <ChakraTextarea
        name={name}
        id={name}
        focusBorderColor="orange"
        bgColor="gray.900"
        variant="filled"
        _hover={{
          bgColor: 'gray.900',
        }}
        size="lg"
        {...rest}
        ref={ref}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
  
  export const Textarea = forwardRef(TextAreaBase);
  