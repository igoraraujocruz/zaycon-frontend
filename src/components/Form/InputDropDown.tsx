import {
  Input as ChakraInput,
  Text,
  VStack,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useState,
} from 'react';
import { api } from '../../services/apiClient';

interface InputProps extends ChakraInputProps {
  name: string;
}

const InputDropDown: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, ...rest },
  ref,
) => {
  const [sellers, setSellers] = useState([] as any);
  const [seller, setSeller] = useState({} as any);
  const [inputSearch, setInputSearch] = useState('');
  const [optionSelected, setOptionSelected] = useState(false);

  useEffect(() => {
    if (inputSearch) {
      const getData = async () => {
        const response = await api.get(`/sellers?sellerName=${inputSearch}`);
        setSellers(response.data);
      };

      getData();
    }
  }, [inputSearch]);

  const handleFilter = event => {
    setSeller({});
    setOptionSelected(false);
    setInputSearch(event.target.value);

    const newFilter = sellers.filter(value => {
      return value.name.toLowerCase().includes(inputSearch.toLowerCase());
    });

    setSellers(newFilter);
  };

  const handleSelectOption = seller => {
    setSeller(seller);
    setOptionSelected(true);
  };

  return (
    <VStack>
      <ChakraInput
        name={seller.id}
        id={name}
        ref={ref}
        {...rest}
        value={seller.name}
        onChange={handleFilter}
        placeholder="Nome do vendedor(a)"
      />
      {sellers && !optionSelected && (
        <VStack w="100%" textAlign="center">
          {sellers.map(seller => (
            <Text
              p="0.5rem"
              width="100%"
              bg="#2d3748"
              borderRadius="1rem"
              cursor="pointer"
              key={seller.id}
              onClick={() => handleSelectOption(seller)}
            >
              {seller.name}
            </Text>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export const Input = forwardRef(InputDropDown);
