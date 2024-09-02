import type { AuthRes, SResponse, User } from "~/lib/app";

export const useApp = defineStore("global-app-store", () => {
  const notif = useNotif();
  const accessToken = useCookie<string | undefined>("token-admin", {
    maxAge: 3600 * 12,
  });
  const refreshToken = useCookie<string | undefined>("refrsh-admin", {
    maxAge: 30 * 3600 * 24,
  });

  const user = ref<User>();
  const router = useRouter();
  const runtime = useRuntimeConfig();

  const bearer = () => {
    return {
      Authorization:`Bearer ${accessToken.value??'invalid_token'}`
    }
  }
  const refresh = async () => {
    try {
      const res = await $fetch<SResponse<AuthRes>>("/auth/refresh", {
        method: "get",
        baseURL: runtime.public.baseUrl,
        headers: {
          Authorization: `Bearer ${refreshToken.value ?? "invalid_token"}`,
        },
      });
      if (res.data) {
        user.value = res.data?.user;
        accessToken.value = res.data.token.accessToken;
        refreshToken.value = res.data.token.refreshToken;
        return true;
      }
    } catch (error) {}
    return false;
  };

  const login = async (param: { email: string; password: string }) => {
    try {
      const res = await $fetch<SResponse<AuthRes>>("/auth/login", {
        baseURL: runtime.public.baseUrl,
        method: "post",
        body: param,
      });
      if (res.data) {
        if (res.data.user.role === "ADMIN") {
          notif.error({
            title: "Something Wrong",
            description: "No Access ",
          });
          return;
        }
        user.value = res.data?.user;
        accessToken.value = res.data.token.accessToken;
        refreshToken.value = res.data.token.refreshToken;
        notif.success({
          title: "Login Success",
        });
        router.push("/");
      } else {
        notif.error({
          title: "Something Wrong",
          description: res.message,
        });
      }
    } catch (error: any) {
      if (error.data) {
        const data: SResponse<AuthRes> = error.data;
        notif.error({
          title: "Something Wrong",
          description: data.message,
        });
      } else {
        notif.error({
          title: "Something Wrong",
          description: "Try Again Later",
        });
      }
    }
  };
  return {
    refresh,
    login,
    bearer,
  };
});
