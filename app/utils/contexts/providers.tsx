'use client';

import GlobalContextProvider from './globalprovider';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <GlobalContextProvider>
            {children}
    </GlobalContextProvider>
  );
}