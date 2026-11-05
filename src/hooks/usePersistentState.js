import { useEffect, useState } from "react";

function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function usePersistentState(key, initial) {
    const [value, setValue] = useState(initial);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setValue(load(key, initial));
        setReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => {
        if (!ready) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
        }
    }, [key, value, ready]);

    return [value, setValue];
}