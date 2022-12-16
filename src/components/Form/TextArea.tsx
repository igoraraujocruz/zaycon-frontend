import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface TextareaProps extends ChakraTextareaProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
}

const TextAreaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, label, error = null, bg, ...rest }, ref) => {
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
        <ChakraTextarea
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

export const Textarea = forwardRef(TextAreaBase);
