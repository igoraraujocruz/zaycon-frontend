import {
  Link as ChakraLink,
  LinkProps,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface NavLinkProps extends LinkProps {
  children?: string | ReactNode;
  to: string;
  activeProps?: LinkProps;
  _hover?: LinkProps;
}

export function NavLink({ to, activeProps, children, ...props }: NavLinkProps) {
  const router = useRouter();
  const isActive = router.pathname === to;
  const color = useColorModeValue('orange', 'selected');

  if (isActive) {
    return (
      <Link href={to}>
        <ChakraLink
          fontWeight="bold"
          {...props}
          {...activeProps}
          _hover={{ color: 'selected' }}
          color={color}
        >
          {children}
        </ChakraLink>
      </Link>
    );
  }

  return (
    <Link href={to}>
      <ChakraLink {...props} _hover={{ color: 'selected' }}>
        {children}
      </ChakraLink>
    </Link>
  );
}
