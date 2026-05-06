import { Plus } from 'lucide-react'
import { motion } from 'motion/react'

interface FABProps {
  onClick: () => void
  color?: string
  label?: string
}

export function FAB({ onClick, color, label = 'Agregar' }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className="fixed z-20 flex items-center justify-center btn-press"
      style={{
        bottom: 72,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: color ?? 'var(--blue)',
        boxShadow: `0 4px 20px ${color ? color + '55' : 'rgba(55,138,221,0.45)'}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <Plus size={22} color="white" strokeWidth={2.5} />
    </motion.button>
  )
}
