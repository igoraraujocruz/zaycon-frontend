import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalHeader,
  Heading,
  Grid,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
} from 'react';
import { useForm } from 'react-hook-form';
import { updateUserPermissions } from '../../services/hooks/useUsers';
import { CheckBox } from '../Form/Checkbox';

export interface ModalDetailsUserProps {
  onOpen: () => void;
  onClose: () => void;
}

export interface User {
  name: string;
  userId: string;
  userPermissions: [
    {
      id: string;
      name: string;
    },
  ];
}

type ValuePermissions = {
  permissions: string[];
};

const DetailsUserModal: ForwardRefRenderFunction<
  ModalDetailsUserProps,
  User
> = ({ name, userPermissions, userId }: User, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, register } = useForm();

  const toast = useToast();

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const onSubmit = useCallback(
    async ({ permissions }: ValuePermissions) => {
      try {
        updateUserPermissions({ userId, permissions });
        toast({
          title: 'Permissões alteradas com sucesso!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        onClose();
      } catch (err) {
        toast({
          title: 'Não foi possível alterar as permissões',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    },
    [userId],
  );

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalCloseButton bg="orange" _hover={{ bg: 'orange' }} color="#fff" />
        <ModalHeader>
          <Heading>{name}</Heading>
        </ModalHeader>
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateColumns="repeat(2, 1fr)"
            columnGap={3}
            rowGap={2}
            mb="1rem"
          >
            <CheckBox
              {...register('permissions')}
              userPermissions={userPermissions}
            />
          </Grid>
          <Button bg="orange" _hover={{ bg: '#FF4500' }} type="submit">
            Salvar
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(DetailsUserModal);
