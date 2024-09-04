import type { SResponse } from "~/lib/app";
import type { BodyReq } from "~/lib/types";

export const useApi = () => {
  const app = useApp();
  const runtime = useRuntimeConfig();
  const loading = ref(false);
  const notif = useNotif();
  const call = async ({
    url,
    title,
    body,
    onSuccess,
    method,
  }: BodyReq & { method: "get" | "post" | "delete" | "put" }) => {
    loading.value = true;
    try {
      const res = await $fetch<SResponse<any>>(url, {
        baseURL: runtime.public.baseUrl,
        method: method,
        body: body,
        headers: app.bearer(),
      });
      if (res.data) {
        notif.success({
          title: `Success ${method} ${title}`,
        });
      } else {
        notif.error({
          title: "Something Wrong",
          description: res.message,
        });
      }
      loading.value = false;

      onSuccess();
    } catch (error: any) {
      if (error.data) {
        const data: SResponse<any> = error.data;
        notif.error({
          title: "Something Wrong",
          description: data.message,
        });
      } else {
        notif.error({
          title: "Something Wrong",
          description: "Try again later",
        });
      }
      loading.value = false;
    }
  };
  return {
    loading,
    call,
  };
};
