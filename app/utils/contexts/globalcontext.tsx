import { createContext, useContext } from "react";

export interface GlobalContextState  {
  contactButtonState: boolean;
};

export interface GlobalContextModel {
  globalState: GlobalContextState;
  editGlobalState: () => void;
}

const defaultValues: GlobalContextModel = {
  globalState: { contactButtonState: false },
  editGlobalState: () => {}
}

export const GlobalContext = createContext<GlobalContextModel>(defaultValues);

export function useGlobalContext() : GlobalContextModel {
    const obj = useContext(GlobalContext);
    if (obj === undefined) {
        throw new Error("useGlobalContext must be used within a Provider");
    }

    return obj;
}