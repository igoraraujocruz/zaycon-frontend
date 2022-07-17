import { Flex, Icon, Text } from '@chakra-ui/react';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { AiFillCloseCircle } from 'react-icons/ai';

type FileUploadProps = InputHTMLAttributes<HTMLInputElement>;

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const inputRef = useRef(null);
  const [imgName, setImgName] = useState([]);

  useEffect(() => {
    if (inputRef.current.files !== undefined) {
      setImgName(inputRef.current.files.name);
    }
  }, [inputRef.current]);

  const handleClick = () => {
    inputRef.current.click();
  };
  return (
    <Flex
      onClick={handleClick}
      h="full"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Icon as={FiPlus} w={14} h={14} cursor="pointer" />

      <Text as="span" pt={2} textAlign="center">
        {imgName || 'Adicione a capa'}
        {imgName && <AiFillCloseCircle />}
      </Text>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </Flex>
  );
};
