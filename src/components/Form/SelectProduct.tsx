import {
    Flex,
    Image,
    Select,
    SelectProps as ChakraSelectProps,
  } from '@chakra-ui/react';
import { forwardRef, useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

interface SelectProps extends ChakraSelectProps {
    name: string;
}

interface ProductsProps {
    id: string;
    name: string;
    photos: [
        {
            id: string;
            url: string;
        }
    ]
}

const SelectProductBase = ({w, name, ...rest}: SelectProps, ref) => {
    const [products, setProducts] = useState<ProductsProps[]>([])
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        api.get('products')
        .then(response => setProducts(response.data))
    }, [])

    const handleOnchange = (imageUrl: string) => {
        console.log('teste')
        setImageUrl(imageUrl)
    }
    
    return (
            <Select name={name} w={w} placeholder='Selecione um produto' {...rest} ref={ref}>
                {products.map(product => 
                    <option style={{ background: '#181B23' }} key={product.id} value={product.id}>{product.name}</option>
                )}
            </Select>
        
    )
}

export const SelectProduct = forwardRef(SelectProductBase);