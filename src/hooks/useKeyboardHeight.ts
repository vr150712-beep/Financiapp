import { useState, useEffect } from 'react'

/**
 * Returns the on-screen keyboard height in px (0 when hidden).
 * Uses the visualViewport API which correctly detects keyboard on iOS & Android.
 */
export function useKeyboardHeight(): number {
  const [kbH, setKbH] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const sync = () => {
      const h = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      setKbH(h)
    }

    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    sync()

    return () => {
      vv.removeEventListener('resize', sync)
      vv.removeEventListener('scroll', sync)
    }
  }, [])

  return kbH
}
