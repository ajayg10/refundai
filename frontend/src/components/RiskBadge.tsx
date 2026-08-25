import type { RiskLevel } from '../types'
import { AlertTriangle, ShieldCheck, Shield } from 'lucide-react'

interface Props {
  level: RiskLevel
  score?: number
}

const RISK_CONFIG = {
  LOW: {
    label: 'Low Risk',
    color: 'text-emerald-400 bg-emerald-950 border-emerald-800',
    icon: ShieldCheck,
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: 'text-amber-400 bg-amber-950 border-amber-800',
    icon: Shield,
  },
  HIGH: {
    label: 'High Risk',
    color: 'text-red-400 bg-red-950 border-red-800',
    icon: AlertTriangle,
  },
}

export function RiskBadge({ level, score }: Props) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW
  const Icon = cfg.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-semibold px-2.5 py-1 ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
      {score !== undefined && <span className="opacity-60">({score}/100)</span>}
    </span>
  )
}
