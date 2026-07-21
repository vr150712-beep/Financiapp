import { Plus } from 'lucide-react'
import { motion } from 'motion/react'

interface FABProps {
  onClick: () => void
  label?: string
}

export function FAB({ onClick, label = 'Agregar' }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className="fixed z-20 flex items-center gap-2 btn-press"
      style={{
        bottom: 'calc(72px + env(safe-area-inset-bottom))',
        right: 20,
        height: 52,
        paddingLeft: 18,
        paddingRight: 22,
        borderRadius: 999,
        background: 'var(--t1)',
        boxShadow: '0 8px 24px rgba(20,20,15,0.25)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <Plus size={20} color="#fff" strokeWidth={2.5} />
      <span className="text-sm-ui font-semibold whitespace-nowrap" style={{ color: '#fff' }}>
        {label}
      </span>
    </motion.button>
  )
}
