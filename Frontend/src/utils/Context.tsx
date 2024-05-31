import { createContext, useEffect, useState } from 'react';

type ResponseData = {
  file_name: string;
  predictions: string;
  score: number;
  'index number': string;
}[];

export function usePersistentState<T>(key: string, initialState: T) {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

interface IAppContext {
  responseData: ResponseData;
  setResponseData: React.Dispatch<React.SetStateAction<ResponseData>>;
  forPreview: boolean;
  setForPreview: React.Dispatch<React.SetStateAction<boolean>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}

export const appContext = createContext<IAppContext>({
  responseData: [],
  setResponseData: () => {},
  forPreview: false,
  setForPreview: () => {},
  fileName: '',
  setFileName: () => {},
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [responseData, setResponseData] = usePersistentState<ResponseData>('responseData', []);
  const [forPreview, setForPreview] = useState(false);
  const [fileName, setFileName] = usePersistentState<string>('fileName', '');

  const value = {
    responseData,
    setResponseData,
    forPreview,
    setForPreview,
    fileName,
    setFileName,
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default AppProvider;
