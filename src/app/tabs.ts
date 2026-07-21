import type { ComponentType } from 'react'
import { Home, ReceiptText, Target, UserCircle } from 'lucide-react'

export type TabId = 'home' | 'expenses' | 'goals' | 'profile'

export interface TabConfig {
  id: TabId
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  /** null = dynamic title (Home shows the active profile's name) */
  headerTitle: string | null
  showProfileSwitcher: boolean
  showFab: boolean
  fabLabel: string
}

export const TABS: TabConfig[] = [
  { id: 'home',     label: 'Inicio', icon: Home,        headerTitle: null,     showProfileSwitcher: true,  showFab: true,  fabLabel: 'Agregar' },
  { id: 'expenses', label: 'Gastos', icon: ReceiptText, headerTitle: 'Gastos', showProfileSwitcher: false, showFab: true,  fabLabel: 'Agregar gasto' },
  { id: 'goals',    label: 'Metas',  icon: Target,      headerTitle: 'Metas',  showProfileSwitcher: false, showFab: true,  fabLabel: 'Agregar meta' },
  { id: 'profile',  label: 'Perfil', icon: UserCircle,  headerTitle: 'Perfil', showProfileSwitcher: false, showFab: false, fabLabel: '' },
]

export function getTabConfig(id: TabId): TabConfig {
  return TABS.find((t) => t.id === id)!
}
