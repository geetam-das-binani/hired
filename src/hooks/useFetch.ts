import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = <TResponse>(
  cb: (token: string, options: any, ...args: any[]) => Promise<TResponse>,
  options = {}
): {
  data: TResponse | undefined;
  error: string | null;
  loading: boolean;
  fn: (...args: any[]) => Promise<void>;
} => {
  const { session } = useSession();
  const [data, setData] = useState<TResponse | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fn = async (...args: any[]) => {
    setError(null);
    setLoading(true);
    try {
      const supabaseToken = await session?.getToken({
        template: "supabase",
      });
      if (!supabaseToken) {
        throw new Error("No token found");
      }

      const response = await cb(supabaseToken, options, ...args);

      console.log(response);
      
      setData(response);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fn };
};

export default useFetch;
