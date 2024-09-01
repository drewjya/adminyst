export const useNotif = () => {
  const toast = useToast();
  const success = (param: { title: string; description?: string }) => {
    toast.add({
      title: param.title,
      description: param.description,
      color: "green",
      timeout: 1000,
    });
  };
  const error = (param: { title: string; description?: string }) => {
    toast.add({
      title: param.title,
      description: param.description,
      color: "red",
      timeout: 1000,
    });
  };
  return {
    success,
    error,
  };
};
