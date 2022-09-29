import {
    Input,
    InputProps as ChakraInputProps,
  } from '@chakra-ui/react'
import { forwardRef } from 'react';

 interface InputProps extends ChakraInputProps {
    name: string;
  } 

const ProductQuantityBase = ({name, ...rest}: InputProps, ref) => {
    return (
      <Input type='number' name={name} {...rest} ref={ref} />
    )
  }

  export const ProductQuantity = forwardRef(ProductQuantityBase)