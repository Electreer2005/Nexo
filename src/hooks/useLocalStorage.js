// src/hooks/useLocalStorage.js
import { useCallback, useEffect, useState } from 'react';

/**
 * useLocalStorage
 * Estado sincronizado con localStorage. Soporta SSR (no rompe si no existe window).
 *
 * @param {string} key          Clave a usar en localStorage
 * @param {*}      initialValue Valor inicial si no hay nada guardado
 * @returns [value, setValue, remove]
 */
export default function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.warn(`[useLocalStorage] error leyendo "${key}"`, err);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const next = value instanceof Function ? value(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
          return next;
        });
      } catch (err) {
        console.warn(`[useLocalStorage] error guardando "${key}"`, err);
      }
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (err) {
      console.warn(`[useLocalStorage] error borrando "${key}"`, err);
    }
  }, [key, initialValue]);

  /* Sincronización entre pestañas */
  useEffect(() => {
    function handleStorage(e) {
      if (e.key !== key) return;
      try {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      } catch {
        setStoredValue(initialValue);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}
