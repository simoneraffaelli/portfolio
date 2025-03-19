
import React, { useState } from 'react';
import { GlobalContext } from './globalcontext';

const GlobalContextProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [globalState, setGlobalState] = useState({contactButtonState: false});

  const editGlobalState = () => {
    setGlobalState({contactButtonState: !globalState.contactButtonState});
  };

  const value = {
    globalState,
    editGlobalState
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;