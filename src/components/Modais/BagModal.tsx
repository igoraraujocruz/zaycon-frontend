import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Flex,
  ModalHeader,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Spinner,
  Image,
  Box,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FiShoppingCart } from 'react-icons/fi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../services/apiClient';
import { useCart } from '../../services/hooks/useCart';
import { Input } from '../Form/Input';
import { MaskedInput } from '../Form/MaskedInput';

export interface IBagModal {
  onOpen: () => void;
  onClose: () => void;
}

type CreateFormData = {
  typeOfPayment: string;
  name: string;
  cep: string;
  address: string;
  email: string;
  numberPhone: string;
};

const createFormSchema = yup.object().shape({
  typeOfPayment: yup.string().required('O tipo de pagamento é necessário'),
  name: yup.string().required('O nome é necessário'),
  cep: yup.string().required('O CEP é obrigatório'),
  address: yup.string().required('O endereço é necessário'),
  email: yup.string().required('Email é obrigatório').email(),
  numberPhone: yup
    .string()
    .required('Nº de Celular é obrigatório')
    .matches(
      /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
      'Número de telefone inválido',
    ),
});

const BagModal: ForwardRefRenderFunction<IBagModal> = (props, ref) => {
  const [finishShop, setFinishShop] = useState(false);
  const [haveItems, setHaveItems] = useState(false);
  const [imagemIsLoading, setImagemIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState({} as any);

  const { cart, addToCart, removeFromCart, decreaseAmount } = useCart();

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      setHaveItems(true);
    }
  }, [Object.keys(cart)]);

  const total = Object.keys(cart).reduce((prev, current) => {
    return prev + cart[current].quantity * cart[current].product.price;
  }, 0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(createFormSchema),
  });

  const itemsCount = Object.keys(cart).reduce((prev, curr) => {
    return prev + cart[curr].quantity;
  }, 0);

  const onSubmit: SubmitHandler<CreateFormData> = async (
    values: CreateFormData,
  ) => {
    const order = { ...values };

    const client = await api.post('/clients', {
      name: order.name,
      cep: order.cep,
      address: order.address,
      email: order.email,
      numberPhone: order.numberPhone,
    });

    const shop = await api.post('/shop', {
      clientId: client.data.id,
      typeOfPayment: order.typeOfPayment,
    });

    Object.keys(cart).map(async curr => {
      const item = {
        quantity: cart[curr].quantity,
        productId: cart[curr].product.id,
      };

      const response = await api.post('/orders', {
        productId: item.productId,
        shopId: shop.data.id,
        quantity: item.quantity,
      });

      return response.data;
    });

    setTimeout(async () => {
      const charge = await api.post('/shop/gerencianet', {
        shopId: shop.data.id,
      });
      setQrCode(charge.data);
      setImagemIsLoading(!imagemIsLoading);
    }, 2000);

    setFinishShop(!finishShop);

    window.localStorage.setItem('cart', JSON.stringify({}));
  };

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
    <Flex>
      <Box cursor="pointer" onClick={onOpen}>
        <Flex
          flexDir="column"
          justify="center"
          align="center"
          fill="white"
          bg="gray.800"
          borderRadius={50}
          boxShadow="5px 2px 6px rgba(0,0,0,0.4)"
          position="fixed"
          w={['4rem', '4rem', '4rem', '4rem']}
          h={['4rem', '4rem', '4rem']}
          top={['70vh']}
          left={['80vw', '80vw', '85vw', '90vw']}
        >
          {itemsCount > 0 && <span>{itemsCount}</span>}
          <FiShoppingCart size="35" />
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="orange"
            _hover={{ bg: 'orangeHover' }}
            color="#fff"
          />
          <ModalHeader />
          {!finishShop ? (
            <ModalBody>
              {haveItems && (
                <>
                  <Flex flexDir="column">
                    {Object.keys(cart).map(key => {
                      return (
                        <Flex key={key} w="100%" h="100%" mb="1rem">
                          <Image
                            w={['9rem']}
                            h={['10rem']}
                            src={
                              cart[key].product?.photos[0]
                                ? cart[key].product.photos[0].url
                                : 'placeholder.png'
                            }
                          />
                          <Flex
                            ml="1rem"
                            flexDir="column"
                            fontFamily="Anek Devanagari"
                            align="start"
                          >
                            <Text>Nome: {cart[key].product.name}</Text>
                            <Text>
                              Preço Unitário: R$ {cart[key].product.price}
                            </Text>
                            <Text>
                              Subtotal: R${' '}
                              {cart[key].quantity * cart[key].product.price}
                            </Text>
                            <Text>Descrição:</Text>
                            <Text
                              maxH="6rem"
                              css={{
                                '&::-webkit-scrollbar': {
                                  width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                  width: '6px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  background: '#FF6B00',
                                  borderRadius: '24px',
                                },
                              }}
                              overflowY="auto"
                              w="15rem"
                            >
                              {cart[key].product.description}
                            </Text>
                            <Flex align="center" as="form" w="100%">
                              <Button
                                bg="gray.700"
                                _hover={{ background: 'gray.900' }}
                                h="2rem"
                                onClick={() =>
                                  removeFromCart(cart[key].product.id)
                                }
                              >
                                <BsFillTrashFill color="#fff" />
                              </Button>
                              <Flex
                                mb="1rem"
                                align="center"
                                ml="2.2rem"
                                flexDir="column"
                              >
                                <Text>Quantidade</Text>
                                <Text>{cart[key].quantity}</Text>
                              </Flex>
                            </Flex>
                            <HStack justify="center" width="100%">
                              <Button
                                bg="gray.700"
                                _hover={{ background: 'gray.900' }}
                                h="2rem"
                                onClick={() =>
                                  decreaseAmount(cart[key].product)
                                }
                              >
                                <AiOutlineMinus color="#fff" />
                              </Button>
                              <Button
                                bg="gray.700"
                                _hover={{ background: 'gray.900' }}
                                h="2rem"
                                onClick={() => addToCart(cart[key].product)}
                              >
                                <AiOutlinePlus color="#fff" />
                              </Button>
                            </HStack>
                          </Flex>
                        </Flex>
                      );
                    })}
                  </Flex>
                  <Text>
                    Total: {String(total.toFixed(2)).replace('.', ',')}
                  </Text>
                  <VStack
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                    borderColor="red"
                  >
                    <RadioGroup defaultValue="2">
                      <FormLabel>Forma de Pagamento</FormLabel>
                      <HStack>
                        <Radio value="pix" {...register('typeOfPayment')}>
                          Pix
                        </Radio>
                        {/*                         <Radio value="picpay" {...register('typeOfPayment')}>
                          PicPay
                        </Radio> */}
                      </HStack>
                    </RadioGroup>
                    <FormControl>
                      <FormLabel>Nome</FormLabel>
                      <Input {...register('name')} error={errors.name} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Cep</FormLabel>
                      <Input {...register('cep')} error={errors.cep} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Endereço</FormLabel>
                      <Input {...register('address')} error={errors.address} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input {...register('email')} error={errors.email} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Nº de Celular</FormLabel>
                      <MaskedInput
                        mask={[
                          '(',
                          /\d/,
                          /\d/,
                          ')',
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          '-',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ]}
                        error={errors.numberPhone}
                        name="numberPhone"
                        {...register('numberPhone')}
                      />
                    </FormControl>

                    <Button
                      color="#fff"
                      bg="orange"
                      _hover={{ bg: 'orangeHover' }}
                      type="submit"
                    >
                      Finalizar Compra
                    </Button>
                  </VStack>
                </>
              )}
            </ModalBody>
          ) : (
            <ModalBody>
              <VStack justify="center" align="center">
                {!imagemIsLoading ? (
                  <VStack>
                    <Text>Só um instante, estamos gerando a cobrança</Text>
                    <Spinner />
                  </VStack>
                ) : (
                  <VStack>
                    <Image src={qrCode.imagemQrcode} alt="qrcode" />
                    <Text>Pronto!</Text>
                    <Text>
                      Agora é só efetuar o pagamento que assim que for
                      finalizado você receberá uma mensagem
                    </Text>
                  </VStack>
                )}
              </VStack>
            </ModalBody>
          )}

          <ModalFooter justifyContent="space-between" />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default forwardRef(BagModal);
