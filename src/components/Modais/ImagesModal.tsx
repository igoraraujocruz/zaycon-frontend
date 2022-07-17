import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Image,
  useToast,
  Flex,
  ModalHeader,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createPhotos } from '../../services/hooks/useProducts';

interface ImagesModalProps {
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    creditPoints: number;
    debitPoints: number;
    photos: [
      {
        id: string;
        name: string;
        url: string;
      },
    ];
  };
}

type CreateFormData = {
  photos: File[];
};

export function ImagesModal({ product }: ImagesModalProps) {
  const [images, setImages] = useState([]);
  const { handleSubmit, reset } = useForm({
    // resolver: yupResolver(createFormSchema),
  });

  const toast = useToast();

  const onFileChange = useCallback(e => {
    const uploadImages = [];
    for (let i = 0; i < e.target.files.length; i += 1) {
      uploadImages.push(e.target.files[i]);
      setImages(uploadImages);
    }
  }, []);

  const onSubmit: SubmitHandler<CreateFormData> = async () => {
    try {
      await createPhotos({
        productId: product.id,
        photos: images,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o produto',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex>
      <Button bg="" _hover={{ bg: 'orange' }} onClick={onOpen}>
        + Fotos
      </Button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="#ff6a0099"
            _hover={{ bg: 'orange' }}
            color="black"
          />
          <ModalHeader>
            <Flex
              onSubmit={handleSubmit(onSubmit)}
              as="form"
              maxWidth={360}
              bg="gray.800"
              p="8"
              borderRadius={8}
              flexDir="column"
            >
              <input type="file" multiple onChange={onFileChange} />
              <Button type="submit" mt="6" colorScheme="pink" size="lg">
                Upload
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody>
            {product.photos.map(photo => (
              <Image p="0.7rem" key={photo.id} src={photo.url} />
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              bg="#ff6a0099"
              _hover={{ bg: 'orange' }}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
