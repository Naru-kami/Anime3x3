import React, { useRef, createContext, useContext, useCallback, useSyncExternalStore } from "react";
import _ from "lodash";

export default function createFastContext<Store>(initialState: Store, storageKey?: string) {
  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store> | ((prev: Store) => Store)) => void;
    subscribe: (callback: () => void) => () => void;
    resync: () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store> | ((prev: Store) => Store)) => {
      var newvalue: Partial<Store> | Store;
      if (typeof value === 'function')
        newvalue = value(store.current);
      else
        newvalue = value;

      storageKey && localStorage.setItem(storageKey, JSON.stringify({ ...store.current, ...newvalue }));
      store.current = { ...store.current, ...newvalue };

      if (!_.isEqual(initialState, store.current))
        initialState = { ...store.current };

      subscribers.current.forEach(callback => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    const resync = useCallback(() => {
      const storedItem = storageKey && localStorage.getItem(storageKey);
      if (storedItem && !_.isEqual(store.current, JSON.parse(storedItem))) {
        store.current = { ...JSON.parse(storedItem) };
        initialState = { ...store.current };
        subscribers.current.forEach(callback => callback());
      }
    }, []);

    return {
      get,
      set,
      subscribe,
      resync
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    const store = useStoreData();
    store.resync();
    return (
      <StoreContext.Provider value={store}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): [SelectorOutput, (value: Partial<Store> | ((prev: Store) => Store)) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState),
    );

    return [state, store.set];
  }

  return {
    Provider,
    useStore
  };
}