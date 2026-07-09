import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/apiErrors';

/**
 * Hook genérico para ejecutar una función async (query) y manejar
 * los estados loading / data / error de forma centralizada.
 *
 * @template T
 * @param {() => Promise<T>} queryFn  Función que retorna la promesa con los datos.
 * @param {unknown[]} [deps=[]]       Dependencias que re-ejecutan la query al cambiar.
 * @returns {{ data: T|null, loading: boolean, error: string|null, refetch: () => void }}
 */
export function useQuery(queryFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFn = useCallback(queryFn, deps);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await stableFn();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) {
        setError(getErrorMessage(err, 'Error al cargar los datos.'));
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [stableFn]);

  useEffect(() => {
    isMounted.current = true;
    execute();
    return () => {
      isMounted.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
