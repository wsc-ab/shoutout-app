import React, {createContext, useContext, useEffect, useState} from 'react';

import {TObject} from '../types/Firebase';
import {getCurrentSubmitDate, getSecondsGap} from '../utils/Date';
import AuthUserContext from './AuthUser';

type TContextProps = {
  content?: TObject;
  submitted: boolean;
};

const LastContentContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const LastContentProvider = ({children}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const [content, setContent] = useState<TObject>();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setContent(authUserData?.contributeTo?.contents?.items?.[0] ?? undefined);
  }, [authUserData?.contributeTo?.contents?.items]);

  useEffect(() => {
    const submitDate = getCurrentSubmitDate();

    const isSubmitted = content?.createdAt
      ? getSecondsGap({
          date: submitDate,
          timestamp: content.createdAt,
        }) > 0
      : false;

    setSubmitted(isSubmitted);
  }, [content?.createdAt]);

  return (
    <LastContentContext.Provider
      value={{
        content,
        submitted,
      }}>
      {children}
    </LastContentContext.Provider>
  );
};

export {LastContentProvider};
export default LastContentContext;
