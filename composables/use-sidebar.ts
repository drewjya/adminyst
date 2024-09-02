export const useSidebar = () => {
  const route = useRoute();

  const current = computed(() => route.path);

  const pages = computed(() => [
    {
      title: "Dashboard",
      link: "/",
    },
    {
      title: "Order",
      link: "/order",
    },
    {
      title: "Cabang",
      link: "/cabang",
    },
    {
      title: "Treatment",
      link: "/treatment",
    },
    {
      title: "Therapist",
      link: "/therapist",
    },
    {
      title: "Analytic",
      link: "/analytic",
    },
    {
      title: "Admins",
      link: "/admin",
    },
    {
      title: "Customer",
      link: "/customer",
    },
  ]);

  return {
    pages,
    current,
  };
};
