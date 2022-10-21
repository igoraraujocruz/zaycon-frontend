import {
  Flex,
  Input as ChakraFileInput,
  InputProps as ChakraFileInputProps,
  Text,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FcAddImage } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';

interface InputFileProps extends ChakraFileInputProps {
  children?: ReactNode;
}

export interface InputFileHandle {
  images: File[];
  setImages: (file: []) => void;
}

const InputFileBase: ForwardRefRenderFunction<
  InputFileHandle,
  InputFileProps
> = ({ children, ...rest }: InputFileProps, ref) => {
  const [images, setImages] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    images,
    setImages,
  }));

  const handleClick = () => inputRef.current?.click();

  const onFileChange = useCallback(() => {
    const uploadImages = [];

    for (let i = 0; i < inputRef.current.files.length; i += 1) {
      uploadImages.push(inputRef.current.files[i]);
      setImages(uploadImages);
    }
  }, []);

  return (
    <Flex
      flexDir="column"
      justify="center"
      align="center"
      w="10rem"
      h="6rem"
      onChange={onFileChange}
      {...rest}
      bg="#181B23"
      borderRadius="2rem"
      border={`0.2rem solid ${images.length > 0 ? '#FF6B00' : '#181B23'}`}
    >
      <ChakraFileInput
        accept="image/png, image/jpeg, image/jpg"
        multiple
        type="file"
        hidden
        ref={inputRef}
      />
      <Flex justify="space-evenly" w="100%">
        {images.length > 0 && <p>{images.length}</p>}
        <FcAddImage size="48" onClick={handleClick} cursor="pointer" />
        {images.length > 0 && (
          <AiFillCloseCircle
            size="20"
            cursor="pointer"
            onClick={() => setImages([])}
          />
        )}
      </Flex>
      {images.length > 1 && (
        <Text
          key={images[0].name}
          w="7rem"
          align="center"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {images[0].name}
        </Text>
      )}
      {images.length === 1 &&
        images.map(image => (
          <Text
            key={image.name}
            w="7rem"
            align="center"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {image.name}
          </Text>
        ))}
    </Flex>
  );
};

export const InputFile = forwardRef(InputFileBase);
