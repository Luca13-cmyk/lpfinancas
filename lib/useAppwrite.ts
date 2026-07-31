// import { useCallback, useEffect, useState } from "react";
// import { Alert } from "react-native";

// interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
//   fn: (params: P) => Promise<T>;
//   params?: P;
//   skip?: boolean;
// }

// interface UseAppwriteReturn<T, P> {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   refetch: (newParams?: P) => Promise<void>;
// }

// const useAppwrite = <T, P extends Record<string, string | number>>({
//   fn,
//   params = {} as P,
//   skip = false,
// }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState(!skip);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(
//     async (fetchParams: P) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const result = await fn({ ...fetchParams });
//         setData(result);
//       } catch (err: unknown) {
//         const errorMessage =
//           err instanceof Error ? err.message : "An unknown error occurred";
//         setError(errorMessage);
//         Alert.alert("Error", errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fn],
//   );

//   useEffect(() => {
//     if (!skip) {
//       fetchData(params);
//     }
//   }, []);

//   const refetch = async (newParams?: P) => await fetchData(newParams!);

//   return { data, loading, error, refetch };
// };

// export default useAppwrite;

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  // Guarda uma referência dos parâmetros atuais para não perdê-los no refetch
  const paramsRef = useRef<P>(params);
  paramsRef.current = params;

  const fetchData = useCallback(
    async (fetchParams: P) => {
      // 🛡️ Se o parâmetro obrigatório (ex: accountId) for falsy/vazio, não dispara o Appwrite
      if (
        Object.values(fetchParams).some(
          (val) => val === undefined || val === null || val === "",
        )
      ) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  // 🔄 REATIVIDADE: Reexecuta a busca sempre que os parâmetros mudarem (ex: user.$id ser carregado)
  const serializedParams = JSON.stringify(params);
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, [skip, serializedParams, fetchData]);

  // 🔄 REFETCH SEGURO: Se novos parâmetros não forem passados, reutiliza os parâmetros atuais mantidos na ref
  const refetch = async (newParams?: P) => {
    await fetchData(newParams || paramsRef.current);
  };

  return { data, loading, error, refetch };
};

export default useAppwrite;
