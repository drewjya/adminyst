export default defineNuxtRouteMiddleware(async (to, from) => {

    const auth = useApp()
    
    const excludeRoutes = ["/login"]


    const routeIsPublic = excludeRoutes.includes(to.path)
    if (routeIsPublic) return;
    const isSuccess = await auth.refresh()
    if (!isSuccess) {
        return navigateTo('/login')
    }
    return;

})
