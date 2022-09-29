
import { Box, Flex } from '@chakra-ui/react';
import { AdminHeader } from '../../../components/AdminHeader';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { CreateClients } from './create';
import { GetClients } from './get';

const Clients = () => {
    return (
        <Box>
            <AdminHeader />
            <Flex
            justify="center"
            mt="5rem"
            flexDir={['column', 'column', 'row']}
            >
                
                <Flex justify={'center'}>
                    <CreateClients />
                </Flex>
                <Flex mt={['5rem', '5rem', '0']} justify={'center'} pl='2rem'>
                    <GetClients />
                </Flex>           
            </Flex>
        </Box>
    )
}

export default Clients;


export const getServerSideProps = withSSRAuth(async ctx => ({
    props: {},
  }));