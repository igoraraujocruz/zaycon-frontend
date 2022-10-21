import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
  CheckboxGroup,
} from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useState,
} from 'react';
import { api } from '../../services/apiClient';

type Permission = {
  id: string;
  name: string;
};

type UserPermissions = {
  id: string;
  name: string;
};

interface CheckboxProps extends ChakraCheckboxProps {
  userPermissions?: UserPermissions[];
}

const CheckBoxBase: ForwardRefRenderFunction<
  HTMLInputElement,
  CheckboxProps
> = ({ userPermissions, ...rest }, ref) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    api.get('/permissions').then(response => setPermissions(response.data));
  }, []);

  return (
    <CheckboxGroup
      defaultValue={userPermissions?.map(permission => permission.name)}
    >
      {permissions.map(permission => (
        <ChakraCheckbox
          key={permission.id}
          {...rest}
          value={permission.name}
          ref={ref}
        >
          {permission.name}
        </ChakraCheckbox>
      ))}
    </CheckboxGroup>
  );
};

export const CheckBox = forwardRef(CheckBoxBase);
