import React from 'react';

export function useLocalStorage<T>(key: string, initialvalue: T | (() => T)) {
    const [val, setval] = React.useState<T>(() => {
        const jsonval = localStorage.getItem(key);
        if (jsonval == null) {
            if (typeof initialvalue === "function") {
                return (initialvalue as () => T)();
            } else {
                return initialvalue;
            }
        } else {
            return JSON.parse(jsonval);
        }
    });
    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(val));
    }, [val, key]);

    return [val, setval] as [T, typeof setval];
}