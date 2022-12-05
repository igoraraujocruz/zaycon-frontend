import {
  Input as ChakraInput,
  ComponentWithAs,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import ReactMaskedInput from 'react-text-mask';

interface MaskedInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
  mask: any;
  icon?: ComponentType<IconBaseProps>;
}

interface MaskedChakraInputProps extends Omit<ChakraInputProps, 'ref'> {
  ref?: React.RefCallback<
    (HTMLInputElement & { inputElement: HTMLInputElement }) | null
  >;
}

const MaskedChakraInput: ComponentWithAs<'input', MaskedChakraInputProps> =
  ChakraInput;

const MaskedInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  MaskedInputProps
> = ({ name, label, error = null, icon: Icon, bg, mask, ...rest }, ref) => {
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
      <MaskedChakraInput
        as={ReactMaskedInput}
        onBlur={() => changeFocus()}
        onFocus={() => changeFocus()}
        guide={false}
        mask={mask}
        name={name}
        id={name}
        borderColor="#2d3748"
        border={focus ? '0.15rem solid #FF6B00' : '0.15rem solid #2d3748'}
        bgColor={bg || 'gray.900'}
        variant="filled"
        _hover={{
          bgColor: 'gray.900',
        }}
        size="lg"
        ref={data => {
          if (typeof ref === 'function') {
            if (data && data.inputElement) {
              ref(data.inputElement);
            } else {
              ref(data);
            }
          }
        }}
        {...rest}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const MaskedInput = forwardRef(MaskedInputBase);
