import type { SResponse } from "~/lib/app";

export const useSearch = () => {
  const loading = ref(false);
  const app = useApp();
  const runtime = useRuntimeConfig();
  const search = async <T, R>(
    url: string,
    param: {
      transform: (val: T | null) => R;
      default: R;
    }
  ): Promise<R> => {
    loading.value = true;
    try {
      const res: SResponse<T> = await $fetch(url, {
        baseURL: runtime.public.baseUrl,
        headers: app.bearer(),
      });
      loading.value = false;
      return param.transform(res.data);
    } catch (error) {
      loading.value = false;
      return param.default;
    }
  };
  return {
    loading,
    search,
  };
};



export const useTimeslot = () => {
  const loading = ref(false);
  const app = useApp();
  const runtime = useRuntimeConfig();
  const request = async <T, R>(
    url: string,
    param: {
      transform: (val: T | null) => R;
      default: R;
    }
  ): Promise<R> => {
    loading.value = true;
    try {
      const res: SResponse<T> = await $fetch(url, {
        baseURL: runtime.public.baseUrl,
        headers: app.bearer(),
      });
      loading.value = false;
      return param.transform(res.data);
    } catch (error) {
      loading.value = false;
      return param.default;
    }
  };
  return {
    loading,
    request,
  };
};
