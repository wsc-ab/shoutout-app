import React, {createContext, useEffect, useState} from 'react';
import {TStatus} from '../types/Screen';
import {readFromAS} from '../utils/AsyncStorage';
import {clearCache, removeOldCache} from '../utils/Cache';

type TContextProps = {status: TStatus; onClear: () => void};

const CacheContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const CacheProvider = ({children}: TProps) => {
  const [lastCleanedAt, setLastCleanedAt] = useState<{cleanedAt: number}>();
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await readFromAS({key: 'lastCacheClean'});
        if (data) {
          setLastCleanedAt(JSON.parse(data) as {cleanedAt: number});
        }
        setStatus('loaded');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  useEffect(() => {
    const remove = async () => {
      await removeOldCache({days: 7});
    };

    if (lastCleanedAt?.cleanedAt) {
      const now = Date.now();

      const milliSecondsSince = now - lastCleanedAt.cleanedAt;

      if (milliSecondsSince >= 7 * 24 * 60 * 60 * 1000) {
        remove();
      }
    }
  }, [lastCleanedAt?.cleanedAt]);

  const onClear = async () => {
    try {
      setStatus('loading');
      await clearCache();
      setStatus('loaded');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <CacheContext.Provider value={{status, onClear}}>
      {children}
    </CacheContext.Provider>
  );
};

export {CacheProvider};
export default CacheContext;
