import React, {createContext, useState} from 'react';

type TContextProps = {
  modal?: string;
  onUpdate: (name?: string) => void;
};

const ModalContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const ModalProvider = ({children}: TProps) => {
  const [modal, setModal] = useState<string>();

  const onUpdate = (newModal?: string) => setModal(newModal);

  console.log(modal, 'm');

  return (
    <ModalContext.Provider
      value={{
        modal,
        onUpdate,
      }}>
      {children}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
