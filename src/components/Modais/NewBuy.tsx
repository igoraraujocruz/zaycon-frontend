import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalHeader,
  Text,
  Heading,
  HStack,
  Select,
  VStack,
  Image,
  Flex,
  useToast,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectProduct } from '../Form/SelectProduct';
import { ProductQuantity } from '../Form/SelectProductQuantity';
import { createShop } from '../../services/hooks/useShop';
import { api } from '../../services/apiClient';

export interface ModalNewBuyHandle {
  onOpen: () => void;
  onClose: () => void;
}

interface ClientProps {
  client: {
    id: string;
    name: string;
    email: string;
    mobilePhone: string;
    birthday: string;
    createdAt: string;
    points: number;
    shop: [
      {
        id: string;
        quantity: number;
        typeOfPayment: string;
        product: {
          id: string;
          name: string;
          price: number;
          creditPoints: number;
          debitPoints: number;
          description: string;
          createdAt: string;
          photos: [
            {
              id: string;
              url: string;
            },
          ];
        };
        createdAt: string;
      },
    ];
  };
}

interface Photo {
  id: string;
  url: string;
}

const schema = yup.object().shape({
  product: yup.string().required('Produto obrigatório'),
  quantity: yup.string().required('Quantidade obrigatória'),
  typeOfPayment: yup.string().required('Tipo de pagamento obrigatório'),
});

const NewBuyModal: ForwardRefRenderFunction<ModalNewBuyHandle, ClientProps> = (
  { client }: ClientProps,
  ref,
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [imgUrl, setImgUrl] = useState({} as Photo);

  const toast = useToast();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const onSubmit = async (values: any) => {
    try {
      await createShop({
        clientId: client.id,
        productId: values.product,
        quantity: values.quantity,
        typeOfPayment: values.typeOfPayment,
      });
      onClose();
      reset();
      setImgUrl(null);
      toast({
        title: 'Compra efetuada com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível efetuar a compra',
        description: error.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleOnchange = useCallback(async (productId: string) => {
    if (productId) {
      await api
        .get(`/products/?productId=${productId}`)
        .then(response => setImgUrl(response.data.photos[0]));
    }
  }, []);

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.900" as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton
          bg="#ff6a0099"
          _hover={{ bg: 'orange' }}
          color="black"
        />
        <ModalHeader textAlign="center">
          <Heading>{client.name}</Heading>
          <Text>{client.mobilePhone}</Text>
          <Text>{client.birthday}</Text>
          <Text>{client.email}</Text>
        </ModalHeader>
        <ModalBody>
          <Flex justify="center" h="15rem">
            {imgUrl?.url && (
              <Image
                borderRadius="2xl"
                boxSize="15rem"
                src={imgUrl.url}
                alt="imagem do produto"
              />
            )}
          </Flex>
          <VStack mt="2rem" align="flex-start">
            <HStack>
              <SelectProduct
                maxW="13.5rem"
                name="product"
                {...register('product')}
                onChange={e => handleOnchange(e.target?.value)}
              />
              <ProductQuantity
                name="quantity"
                {...register('quantity')}
                w={['6rem']}
              />
            </HStack>

            <Select
              maxW="13.5rem"
              name="typeOfPayment"
              {...register('typeOfPayment')}
              style={{ background: '#181B23' }}
              placeholder="Tipo de pagamento"
            >
              <option style={{ background: '#181B23' }} value="creditCard">
                Cartão de Crédito
              </option>
              <option style={{ background: '#181B23' }} value="debitCard">
                Cartão de Débito
              </option>
              <option style={{ background: '#181B23' }} value="money">
                Dinheiro
              </option>
              <option style={{ background: '#181B23' }} value="pix">
                Pix
              </option>
              <option style={{ background: '#181B23' }} value="picpay">
                Picpay
              </option>
              <option style={{ background: '#181B23' }} value="creditPoints">
                Snap Points
              </option>
            </Select>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button type="submit" bg="orange" _hover={{ bg: 'gray.900' }}>
              Confirmar
            </Button>
            <Button
              color="white"
              bg="#ff6a0099"
              _hover={{ bg: 'orange' }}
              mr={3}
              onClick={onClose}
            >
              Cancelar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(NewBuyModal);
