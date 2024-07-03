import { createContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';

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
  setResponseData: Dispatch<SetStateAction<ResponseData>>;
  forPreview: boolean;
  setForPreview: Dispatch<SetStateAction<boolean>>;
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
  correct: number;
  setCorrect: Dispatch<SetStateAction<number>>;
  incorrect: number;
  setIncorrect: Dispatch<SetStateAction<number>>;
}

export const appContext = createContext<IAppContext>({
  responseData: [],
  setResponseData: () => {},
  forPreview: false,
  setForPreview: () => {},
  fileName: '',
  setFileName: () => {},
  correct: 1,
  setCorrect: () => {},
  incorrect: 0,
  setIncorrect: () => {},
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [responseData, setResponseData] = usePersistentState<ResponseData>('responseData', []);
  const [forPreview, setForPreview] = useState(false);
  const [fileName, setFileName] = usePersistentState<string>('fileName', '');
  const [correct, setCorrect] = useState<number>(1);
  const [incorrect, setIncorrect] = useState<number>(0);

  const value = {
    responseData,
    setResponseData,
    forPreview,
    setForPreview,
    fileName,
    setFileName,
    correct,
    setCorrect,
    incorrect,
    setIncorrect,
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default AppProvider;
