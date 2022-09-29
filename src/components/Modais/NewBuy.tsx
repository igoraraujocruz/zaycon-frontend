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
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { SelectProduct } from '../Form/SelectProduct';
import { ProductQuantity } from '../Form/SelectProductQuantity';
import { createShop } from '../../services/hooks/useShop'

export interface ModalNewBuyHandle {
  onOpen: () =>  void;
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
    shop: [{
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
        photos: [{
          id: string;
          url: string;
        }]
      }
      createdAt: string;
    }]
  }
}

const NewBuyModal: ForwardRefRenderFunction<ModalNewBuyHandle, ClientProps> = ({client}: ClientProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm()

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const onSubmit = (values: any) => {
    try {
      createShop({
        clientId: client.id,
        productId: values.product,
        quantity: values.quantity,
        typeOfPayment: values.typeOfPayment,
      })
      onClose()
      reset()
    } catch(err) {
      console.log(err)
    }
  }

  return (
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <ModalCloseButton
            bg="#ff6a0099"
            _hover={{ bg: 'orange' }}
            color="black"
          />
          <ModalHeader>
            <Heading>{client.name}</Heading>
            <Text>{client.mobilePhone}</Text>
            <Text>{client.birthday}</Text>
            <Text>{client.email}</Text>
          </ModalHeader>
          <ModalBody>
            <HStack>
                <Select {...register('typeOfPayment')} placeholder='Tipo de pagamento' w={['52rem', '52rem', '30rem']}>
                <option value='creditCard'>Cartão de Crédito</option>
                <option value='debitCard'>Cartão de Débito</option>
                <option value='money'>Dinheiro</option>
                <option value='pix'>Pix</option>
                <option value='picpay'>Picpay</option>
                <option value='creditPoints'>Snap Points</option>
              </Select>
              <ProductQuantity name='quantity' {...register('quantity')} w={['6rem']} />
            </HStack>
            <SelectProduct name='product' w={['52rem', '52rem', '30rem']} {...register('product')} />
          </ModalBody>
          <ModalFooter>
            <HStack>
            <Button type='submit' bg={'orange'} _hover={{ bg: 'gray.900'}}>Confirmar</Button>
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
}

export default forwardRef(NewBuyModal)
