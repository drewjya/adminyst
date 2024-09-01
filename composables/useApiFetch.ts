
type useFetchType = typeof useLazyFetch

export const useApiFetch:useFetchType = (path, options={}) => {
  const config = useRuntimeConfig()
  options.baseURL = config.public.baseUrl
  return useLazyFetch(path, options)
}
