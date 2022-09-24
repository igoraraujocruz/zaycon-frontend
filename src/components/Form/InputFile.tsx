import { Flex, Input as ChakraFileInput, InputProps as ChakraFileInputProps, Text  } from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, ReactNode, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { FcAddImage } from 'react-icons/fc'

interface InputFileProps extends ChakraFileInputProps {
    children?: ReactNode;
}

export interface ModalDetalhesHandle {
    images: File[];
    setImages: (value) => void;
}


const InputFileBase: ForwardRefRenderFunction<ModalDetalhesHandle, InputFileProps>  = ({children, ...rest}: InputFileProps, ref) => {
    const [images, setImages] = useState([]);

    useImperativeHandle(ref, () => ({
        images,
        setImages,
      }));


      console.log(images)


    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => inputRef.current?.click()

    const onFileChange = useCallback(e => {
        const uploadImages = [];
        for (let i = 0; i < e.target.files.length; i += 1) {
          uploadImages.push(e.target.files[i]);
          setImages(uploadImages);
        }
      }, []);
    
    return (
        <Flex flexDir={'column'} justify={'center'} align={'center'} w={'10rem'} h={'6rem'} cursor={'pointer'} onClick={handleClick} onChange={onFileChange} {...rest} bg={'#181B23'} borderRadius={'2rem'} border={`0.2rem solid ${images.length > 0 ? '#FF6B00' : '#181B23'}`}>
            <ChakraFileInput type={'file'} hidden ref={(e) => {
            (e)
            inputRef.current = e
          }} />
                <FcAddImage size={'48'} />
                    {images.length > 0  && images.map(image => <Text key={image.name} w={'7rem'} align={'center'} overflow={'hidden'} whiteSpace={'nowrap'} textOverflow={'ellipsis'}>{image.name}</Text>)}
        </Flex>
    )
}

export const InputFile = forwardRef(InputFileBase);