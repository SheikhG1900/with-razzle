import { useEffect, useMemo } from 'react'
export const useMount = (func: () => void) => {
    if (typeof window !== 'undefined') {
        useEffect(func, [])
    } else {
        useMemo(func, [true])
    }
}
