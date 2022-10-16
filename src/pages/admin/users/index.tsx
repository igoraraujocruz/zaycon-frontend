
import { Box, Flex } from '@chakra-ui/react';
import { AdminHeader } from '../../../components/AdminHeader';
import { Can } from "../../../components/Can";
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { CreateUser } from './create';
import { GetUsers } from './get';

const Users = () => {
    return (
        <Box>
            <AdminHeader />
            <Flex
            justify="center"
            flexDir={['column', 'column', 'row']}
            >
                <Can permissions={['Cadastrar Usuario']}>
                    <Flex mt={'2rem'} justify={'center'}>
                        <CreateUser />
                    </Flex>
                </Can>
                <Can permissions={['Listar Usuario']}>
                    <Flex justify={'center'} pl='2rem'>
                        <GetUsers />
                    </Flex>   
                </Can>        
            </Flex>
        </Box>
    )
}

export default Users;


export const getServerSideProps = withSSRAuth(async ctx => {
    return {
        props: {}
    }
}, {
        permissions: ['Cadastrar Usuario', 'Deletar Usuario', 'Listar Usuario', 'Editar Usuario']
    }
);