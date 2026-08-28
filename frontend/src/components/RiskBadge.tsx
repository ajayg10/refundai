import type { RiskLevel } from '../types'
import { AlertTriangle, ShieldCheck, Shield } from 'lucide-react'

interface Props {
  level: RiskLevel
  score?: number
}

const RISK_CONFIG = {
  LOW: {
    label: 'Low Risk',
    color: 'text-[#86d4a5] bg-[rgba(45,90,60,0.15)] border-[rgba(45,90,60,0.3)]',
    icon: ShieldCheck,
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: 'text-[#D6A84F] bg-[rgba(214,168,79,0.08)] border-[rgba(214,168,79,0.2)]',
    icon: Shield,
  },
  HIGH: {
    label: 'High Risk',
    color: 'text-[#e88c8c] bg-[rgba(97,44,44,0.15)] border-[rgba(97,44,44,0.3)]',
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
