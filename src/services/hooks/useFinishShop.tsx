import { createContext, ReactNode, useContext, useState } from 'react';
import { SocketContext } from './useSocket';

interface FinishShopProviderProps {
  children: ReactNode;
}

interface FinishShopContextData {
  finishShopsId: string[];
}

const FinishShopContext = createContext<FinishShopContextData>(
  {} as FinishShopContextData,
);

export function FinishShopProvider({
  children,
}: FinishShopProviderProps): JSX.Element {
  const [finishShopsId, setFinishShopsId] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storagedCart = localStorage.getItem('finishShopIds');

      if (storagedCart) {
        return JSON.parse(storagedCart);
      }

      return [];
    }
  });

  const socket = useContext(SocketContext);

  socket.on('receivePaiment', data => {
    setFinishShopsId(data.shopId);

    localStorage.setItem('finishShopIds', JSON.stringify(data.shopId));
  });

  return (
    <FinishShopContext.Provider
      value={{
        finishShopsId,
      }}
    >
      {children}
    </FinishShopContext.Provider>
  );
}

export function useFinishShop(): FinishShopContextData {
  const context = useContext(FinishShopContext);

  return context;
}
