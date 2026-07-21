import { useState, type FormEvent, type ReactNode } from 'react'

const STORAGE_KEY = 'finanzas-unlocked'
const PIN = import.meta.env.VITE_APP_PIN as string | undefined

export function PinGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked || !PIN) return <>{children}</>

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value === PIN) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div
      className="flex items-center justify-center px-6"
      style={{ minHeight: '100dvh', background: 'var(--bg0)' }}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" style={{ maxWidth: 280 }}>
        <h1 className="font-display text-center" style={{ fontSize: 30, color: 'var(--t1)' }}>
          Financiapp
        </h1>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          placeholder="PIN"
          className="w-full text-center bg-[var(--s2)] rounded-input px-3 py-3 text-lg text-[var(--t1)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--blue)]"
          style={{ border: 'var(--border)', letterSpacing: '0.3em' }}
        />
        {error && (
          <p className="text-xs-ui text-center" style={{ color: 'var(--coral-t)' }}>
            PIN incorrecto
          </p>
        )}
        <button
          type="submit"
          className="w-full text-white rounded-input py-3 text-sm-ui font-medium btn-press"
          style={{ background: 'var(--t1)' }}
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
