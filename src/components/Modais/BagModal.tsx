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
  Heading,
  useToast,
  AspectRatio,
  ScaleFade,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useContext,
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Howl, Howler } from 'howler';
import axios from 'axios';
import { api } from '../../services/apiClient';
import { useCart } from '../../services/hooks/useCart';
import { Input } from '../Form/Input';
import { MaskedInput } from '../Form/MaskedInput';
import { SocketContext } from '../../services/hooks/useSocket';
import { formatPrice } from '../../utils/format';

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
  seller: string;
  numberAddress: number;
  obs: string;
};

interface Product {
  id: string;
  name: string;
  price: number;
  amount: number;
  category: string;
  slug: string;
}

interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const createFormSchema = yup.object().shape({
  typeOfPayment: yup.string().required('O tipo de pagamento é necessário'),
  name: yup.string().required('O nome é necessário'),
  seller: yup.string(),
  cep: yup.string().required('O CEP é obrigatório'),
  email: yup.string().required('Email é obrigatório').email(),
  numberAddress: yup
    .string()
    .required('O número da residência é necessário')
    .matches(/^[0-9]+$/),
  obs: yup.string().required('Complemento é necessário'),
  numberPhone: yup
    .string()
    .required('Nº de Celular é obrigatório')
    .matches(
      /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
      'Número de telefone inválido',
    ),
});

const schemaNotDelivery = yup.object().shape({
  typeOfPayment: yup.string().required('O tipo de pagamento é necessário'),
  name: yup.string().required('O nome é necessário'),
  seller: yup.string(),
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
  const [imagemIsLoading, setImagemIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState({} as any);
  const [paid, setIsPaid] = useState(false);
  const [dataPaiment, setdataPaiment] = useState({} as any);
  const [mySocketId, setMySocketId] = useState('');
  const [seller, setSeller] = useState({} as any);
  const [delivery, setDelivery] = useState(false);
  const [address, setAddress] = useState({} as Address);
  const [valueFrete, setFreteValue] = useState(0);

  const [calculateDeliveryLoading, setCalculateDeliveryLoading] =
    useState(false);

  const socket = useContext(SocketContext);

  const sound = new Howl({
    src: ['notification.mp3'],
  });

  useEffect(() => {
    socket.on('mySocketId', data => {
      setMySocketId(data);
    });
  }, [mySocketId, socket]);

  Howler.volume(0.002);
  const router = useRouter();

  const sellerUserName = router.query.seller;

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

  const handleCopyClick = () => {
    copyTextToClipboard(qrCode.qrcode);
  };

  useEffect(() => {
    if (sellerUserName) {
      const getSeller = async () => {
        const response = await api.get(
          `/sellers?sellerUsername=${sellerUserName}`,
        );

        setSeller(response.data);
      };
      getSeller();
    }
  }, [sellerUserName]);

  socket.on('receivePaiment', data => {
    setdataPaiment(data);
    setIsPaid(true);
    sound.play();
  });

  socket.on('mySocketId', data => {
    setMySocketId(data);
  });

  const { cart, removeProduct, updateProductAmount, removeAllProductsInBag } =
    useCart();

  const cartFormatted = cart?.map(product => ({
    ...product,
    priceFormatted: formatPrice(product.price),
    subTotal: formatPrice(product.price * product.amount),
  }));

  const total = cart?.reduce((sumTotal, product) => {
    return sumTotal + product.price * product.amount;
  }, 0);

  function handleProductIncrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount + 1 });
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount - 1 });
  }

  function handleRemoveProduct(productId: string) {
    removeProduct(productId);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearchAddress = async (cep: string) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      setAddress(response.data);
    } catch (err) {
      //
    }
  };

  const handleCalculateDelivery = async (residenceNumber: string) => {
    setCalculateDeliveryLoading(true);
    try {
      const response = await api.post('/clients/address', {
        address: {
          cep: address.cep,
          logradouro: address.logradouro,
          bairro: address.bairro,
          localidade: address.localidade,
          uf: address.uf,
          residenceNumber,
        },
      });

      setFreteValue(response.data);
      setCalculateDeliveryLoading(false);
    } catch (err) {
      //
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateFormData>({
    resolver: delivery
      ? yupResolver(createFormSchema)
      : yupResolver(schemaNotDelivery),
  });

  const onSubmit: SubmitHandler<CreateFormData> = async (
    values: CreateFormData,
  ) => {
    setFinishShop(!finishShop);

    try {
      const client = await api.post('/clients', {
        name: values.name,
        email: values.email,
        numberPhone: values.numberPhone,
        cep: values.cep,
        logradouro: address.logradouro,
        bairro: address.bairro,
        localidade: address.localidade,
        uf: address.uf,
        residenceNumber: values.numberAddress,
      });

      const shop = await api.post('/shop', {
        clientId: client.data.id,
        socketId: mySocketId,
        typeOfPayment: 'pix',
        sellerId: seller.id,
      });

      cartFormatted.map(async product => {
        await api.post('/orders', {
          productId: product.id,
          shopId: shop.data.id,
          quantity: product.amount,
        });
      });

      const charge = await api.post('/shop/gerencianet', {
        shopId: shop.data.id,
      });

      setQrCode(charge.data);

      setImagemIsLoading(!imagemIsLoading);

      toast({
        position: 'bottom',
        title: `Tudo Certo!`,
        description: `Compra efetuada com sucesso.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      removeAllProductsInBag();
      reset();
    } catch (err) {
      toast({
        position: 'bottom',
        title: err.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg">
        <ModalCloseButton
          bg="itemColor"
          _hover={{ bg: 'itemColor' }}
          color="#fff"
        />
        <ModalHeader />
        {!finishShop ? (
          <ModalBody>
            {cartFormatted?.length > 0 ? (
              <>
                <Flex flexDir="column">
                  {cartFormatted?.map(product => {
                    return (
                      <Flex key={product.id} w="100%" h="100%" mb="1rem">
                        <AspectRatio w="100%" ratio={1 / 1}>
                          <Image
                            src={
                              product?.photos[0]
                                ? product.photos[0].url
                                : 'placeholder.png'
                            }
                          />
                        </AspectRatio>

                        <Flex
                          ml="1rem"
                          flexDir="column"
                          fontFamily="Anek Devanagari"
                        >
                          <Text
                            w={['7.5rem', '7.5rem', '11rem']}
                            overflow="auto"
                            css={{
                              '&::-webkit-scrollbar': {
                                width: '4px',
                              },
                              '&::-webkit-scrollbar-track': {
                                width: '6px',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#14213D',
                                borderRadius: '0px',
                              },
                            }}
                            h="4rem"
                          >
                            {product.name}
                          </Text>
                          <Text w={['7.5rem', '7.5rem', '11rem']}>
                            Preço unitário: {formatPrice(product.price)}
                          </Text>
                          <Text w={['7.5rem', '7.5rem', '11rem']}>
                            Subtotal:{' '}
                            {formatPrice(product.amount * product.price)}
                          </Text>
                          <Flex
                            align="center"
                            as="form"
                            w="100%"
                            flexDir={['column', 'column', 'row']}
                          >
                            <Flex
                              mt="1rem"
                              align="center"
                              w="100%"
                              flexDir="column"
                            >
                              <Text>Quantidade</Text>
                              <Text>{product.amount}</Text>
                            </Flex>
                          </Flex>
                          <HStack
                            justify={['normal', 'normal', 'center']}
                            width="100%"
                          >
                            <Button
                              bg="gray.700"
                              _hover={{ background: 'gray.900' }}
                              h="2rem"
                              onClick={() => handleProductDecrement(product)}
                            >
                              <AiOutlineMinus color="#fff" />
                            </Button>
                            <Button
                              bg="gray.700"
                              _hover={{ background: 'gray.900' }}
                              h="2rem"
                              onClick={() => handleProductIncrement(product)}
                            >
                              <AiOutlinePlus color="#fff" />
                            </Button>
                          </HStack>
                          <Flex mt="1rem" w="100%" justify="center">
                            <Button
                              bg="gray.700"
                              _hover={{ background: 'gray.900' }}
                              h="2rem"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              <BsFillTrashFill color="#fff" />
                            </Button>
                          </Flex>
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
                <Flex>
                  <RadioGroup defaultValue="noDelivery">
                    <FormLabel>Forma de envio</FormLabel>
                    <HStack color="#fff" bg="gray.700" p="1rem">
                      <Radio
                        value="noDelivery"
                        onChange={() => setDelivery(false)}
                      >
                        Vou retirar o produto na Loja
                      </Radio>
                      <Radio
                        value="delivery"
                        onChange={() => setDelivery(true)}
                      >
                        Quero que entregue
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </Flex>
                <Flex mt="1rem" mb="1rem">
                  {delivery && (
                    <ScaleFade initialScale={0.9} in>
                      <VStack>
                        <HStack>
                          <FormControl>
                            <FormLabel>Cep</FormLabel>
                            <MaskedInput
                              mask={[
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/,
                                '-',
                                /\d/,
                                /\d/,
                                /\d/,
                              ]}
                              name="cep"
                              {...register('cep', {
                                onChange: e =>
                                  handleSearchAddress(e.target.value),
                              })}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Nº da Residência</FormLabel>
                            <Input
                              {...register('numberAddress', {
                                onChange: e =>
                                  handleCalculateDelivery(e.target.value),
                              })}
                              error={errors.numberAddress}
                            />
                          </FormControl>
                        </HStack>

                        <VStack
                          bg="gray.300"
                          p="2rem"
                          w="100%"
                          borderRadius="1rem"
                        >
                          {address.bairro?.length > 0 && (
                            <Text>
                              {address.logradouro} - {address.bairro},{' '}
                              {address.localidade} - {address.uf}
                            </Text>
                          )}
                        </VStack>
                        <FormControl>
                          <FormLabel>Ponto de Referência/Complemento</FormLabel>
                          <Input {...register('obs')} error={errors.obs} />
                        </FormControl>
                      </VStack>
                    </ScaleFade>
                  )}
                </Flex>
                <Text mt="1rem">
                  Valor total dos Produtos: {formatPrice(total)}
                </Text>
                <Flex
                  flexDir="column"
                  as="form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {delivery ? (
                    <VStack align="flex-start" spacing={0}>
                      <Text>
                        Valor do Frete:{' '}
                        {calculateDeliveryLoading ? (
                          <Spinner size="sm" />
                        ) : valueFrete !== -1 ? (
                          formatPrice(valueFrete)
                        ) : (
                          <Text color="#e61919">
                            Infelizmente, entregamos apenas em: Vitória, Vila
                            Velha, Serra e Cariacica.
                          </Text>
                        )}
                      </Text>
                      <Text>
                        Taxa para Geradora do Pix:
                        {formatPrice(
                          ((Number(total) + Number(valueFrete)) * 1.19) / 100,
                        )}
                      </Text>
                      <Text fontWeight="600">
                        Total a pagar:{' '}
                        {formatPrice(
                          total +
                            Number(valueFrete) +
                            ((total + Number(valueFrete)) * 1.19) / 100,
                        )}
                      </Text>
                    </VStack>
                  ) : (
                    <VStack align="flex-start">
                      <Text>
                        Taxa para Geradora do Pix:{' '}
                        {formatPrice((total * 1.19) / 100)}
                      </Text>
                      <Text fontWeight="600">
                        Total a pagar:{' '}
                        {formatPrice(total + (total * 1.19) / 100)}
                      </Text>
                    </VStack>
                  )}

                  <VStack mt="1rem" borderColor="red">
                    <RadioGroup defaultValue="pix">
                      <FormLabel mt="1rem">Forma de Pagamento</FormLabel>
                      <HStack>
                        <Radio value="pix" {...register('typeOfPayment')}>
                          Pix
                        </Radio>
                      </HStack>
                    </RadioGroup>
                    <HStack>
                      <FormControl>
                        <FormLabel>Nome</FormLabel>
                        <Input {...register('name')} error={errors.name} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Celular</FormLabel>
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
                          name="numberPhone"
                          {...register('numberPhone')}
                          error={errors.numberPhone}
                        />
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input {...register('email')} error={errors.email} />
                    </FormControl>
                  </VStack>

                  {delivery && valueFrete !== -1 && (
                    <Button
                      mt="2rem"
                      color="#fff"
                      bg="itemColor"
                      _hover={{ bg: 'gray.800' }}
                      type="submit"
                    >
                      Finalizar Compra
                    </Button>
                  )}

                  {!delivery && (
                    <Button
                      mt="2rem"
                      color="#fff"
                      bg="itemColor"
                      _hover={{ bg: 'gray.800' }}
                      type="submit"
                    >
                      Finalizar Compra
                    </Button>
                  )}
                </Flex>
              </>
            ) : (
              <Text align="center">Nenhum item no carrinho até o momento</Text>
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
              ) : !paid ? (
                <VStack>
                  <Heading size="1xl">Pronto!</Heading>
                  <Text align="center" w="15rem">
                    Agora é só efetuar o pagamento que assim que for finalizado
                    você receberá uma mensagem.
                  </Text>
                  <Text>QR Code</Text>
                  <Image src={qrCode.imagemQrcode} alt="qrcode" />
                  <Heading p="1rem" size="1xl">
                    ou
                  </Heading>
                  <Text>Pix Copia e Cola</Text>
                  <VStack align="center" bg="orange" borderRadius="0.5rem">
                    <Text
                      align="center"
                      color="#000"
                      w={['15rem', '15rem', '25rem']}
                    >
                      {qrCode.qrcode}
                    </Text>
                    <HStack p="0.5rem" w={['100%']} justify="center">
                      <Button
                        _hover={{
                          bg: '#1a202c',
                        }}
                        bg="#181b23"
                        color="#fff"
                        onClick={handleCopyClick}
                      >
                        Copiar
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              ) : (
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {dataPaiment.name}, recebemos o seu pagamento!
                  </Text>
                  <Text>
                    Encaminhamos um email com o comprovante de pagamento.
                  </Text>
                  <Text>Para acompanhar sua encomanda é só clicar em:</Text>
                  <VStack
                    bg="itemColor"
                    p="1rem"
                    borderRadius="1rem"
                    color="white"
                  >
                    <Image
                      w="2rem"
                      src="minhas-compras.png"
                      alt="Minhas Compras"
                    />
                    <Text>Minhas Compras</Text>
                  </VStack>
                  <Text>
                    Além disso, sempre que o status da compra for alterada, você
                    receberá um email.
                  </Text>
                  <HStack align="center" spacing="1rem">
                    <Text>Qualquer dúvida, estamos à disposição.</Text>
                    <Link href="https://api.whatsapp.com/send?phone=5527999147896&text=Olá, gostaria de saber mais sobre os produtos">
                      <Image
                        cursor="pointer"
                        w="2rem"
                        src="whatsapp.png"
                        alt="whatsapp"
                      />
                    </Link>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </ModalBody>
        )}

        <ModalFooter justifyContent="space-between" />
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(BagModal);
