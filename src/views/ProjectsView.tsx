import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { Trash2, Target } from 'lucide-react'
import { useProjectsStore } from '@/store'
import { useSplitRatio } from '@/hooks'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCOP } from '@/lib/format'

export function ProjectsView() {
  const projects     = useProjectsStore((s) => s.projects)
  const removeProject= useProjectsStore((s) => s.removeProject)
  const { victorRatio, partnerRatio } = useSplitRatio()

  function handleDelete(id: string) {
    removeProject(id)
    toast.success('Proyecto eliminado')
  }

  if (projects.length === 0) {
    return (
      <div className="px-4 mt-8">
        <EmptyState
          icon={<Target size={28} />}
          title="Sin proyectos aún"
          description="Toca + para crear tu primer proyecto de pareja."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <AnimatePresence initial={false}>
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="bg-[var(--s1)] rounded-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm-ui text-[var(--t1)] font-medium">{project.label}</p>
                  <p className="text-xs-ui text-[var(--t3)] mt-0.5">{project.months} meses · {formatCOP(project.amount)} total</p>
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-[var(--t3)] hover:text-[var(--coral-t)] transition-colors p-1"
                  aria-label="Eliminar proyecto"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 bg-[var(--s2)] rounded-card p-3">
                  <p className="text-xs-ui text-[var(--blue-t)] mb-1">Víctor / mes</p>
                  <p className="num-md text-[var(--t1)]">
                    {formatCOP(project.amount * victorRatio / project.months)}
                  </p>
                </div>
                <div className="flex-1 bg-[var(--s2)] rounded-card p-3">
                  <p className="text-xs-ui text-[var(--pink-t)] mb-1">Camila / mes</p>
                  <p className="num-md text-[var(--t1)]">
                    {formatCOP(project.amount * partnerRatio / project.months)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
