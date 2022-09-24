
import { Flex } from '@chakra-ui/react';
import { CreateClients } from './create';
import { GetClients } from './get';

const Clients = () => {
    return (
        <Flex
        justify="center"
        mt="5rem"
        flexDir={['column', 'column', 'row']}
        >
            <Flex position={['initial', 'initial', 'fixed']} justify={['center']} left={'5rem'}>
                <CreateClients />
            </Flex>
            <Flex ml={'-10rem'} w={'100vw'} justify={'flex-end'}>
                <GetClients />
            </Flex>           
        </Flex>
    )
}

export default Clients;