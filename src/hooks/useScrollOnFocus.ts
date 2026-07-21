import { useCallback } from 'react'

export function useScrollOnFocus() {
  return useCallback((e: { currentTarget: HTMLInputElement }) => {
    const el = e.currentTarget
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 320)
  }, [])
}
