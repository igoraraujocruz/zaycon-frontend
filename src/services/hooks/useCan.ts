import { validateUserPermissions } from "../../utils/validateUserPermissions"
import { useAuth } from "./useAuth"

type UseCanParams = {
    permissions?: string[]
}

export function useCan({permissions}: UseCanParams) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return false
    }

    const hasPermission = validateUserPermissions({
        user,
        permissions
    })

    return hasPermission;
}