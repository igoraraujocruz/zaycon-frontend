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
} from '@chakra-ui/react';

interface Client {
  client: {
    id: string;
    name: string;
    email: string;
    mobilePhone: string;
    birthday: string;
    createdAt: string;
  };
}

export function DetailsClientModal({ client }: Client) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton
            bg="#ff6a0099"
            _hover={{ bg: 'orange' }}
            color="black"
          />
          <ModalHeader>
            <Text>CABEÇA MODAL DO CLIENT {client.name}</Text>
          </ModalHeader>
          <ModalBody>
            <Text>CORPO MODAL DO CLIENT</Text>
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
