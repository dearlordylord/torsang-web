import React, { PropsWithChildren, useCallback } from 'react';

const LightboxContext = React.createContext<{
  open: (src: string) => void,
  close: () => void,
  isOpen: boolean,
  lastInvokedImageSrc: string | null
}>({
  open: () => {
  },
  close: () => {
  },
  isOpen: false,
  lastInvokedImageSrc: null,
});
export const LightboxContextProvider = ({children}: PropsWithChildren) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastInvokedImageSrc, setLastInvokedImageSrc] = React.useState<string>(null);
  const open = useCallback((src: string) => {
    setIsOpen(true);
    setLastInvokedImageSrc(src);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <LightboxContext.Provider value={{open, close, isOpen, lastInvokedImageSrc}}>
      {children}
    </LightboxContext.Provider>
  );
};
export const useLightbox = () => React.useContext(LightboxContext);
