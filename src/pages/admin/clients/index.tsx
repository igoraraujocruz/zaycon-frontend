
import { Box, Flex } from '@chakra-ui/react';
import { AdminHeader } from '../../../components/AdminHeader';
import { Can } from '../../../components/Can';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { CreateClients } from './create';
import { GetClients } from './get';

const Clients = () => {
    return (
        <Box>
            <AdminHeader />
            <Flex
            justify="center"
            flexDir={['column', 'column', 'row']}
            >
                <Can permissions={['Cadastrar Cliente']}>
                    <Flex mt={'2rem'} justify={'center'}>
                        <CreateClients />
                    </Flex>
                </Can>
                <Can permissions={['Listar Cliente']}>
                    <Flex justify={'center'} pl='2rem'>
                        <GetClients />
                    </Flex> 
                </Can>          
            </Flex>
        </Box>
    )
}

export default Clients;

export const getServerSideProps = withSSRAuth(async ctx => {
    return {
        props: {}
    }
}, {
        permissions: ['Cadastrar Cliente', 'Deletar Cliente', 'Editar Cliente', 'Listar Cliente']
    }
);