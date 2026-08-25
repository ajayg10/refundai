import type { RefundStatus } from '../types'

interface Props {
  status: RefundStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<RefundStatus, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'bg-slate-800 text-slate-300 border-slate-700', dot: 'bg-slate-400' },
  INVESTIGATING: { label: 'Investigating', color: 'bg-indigo-950 text-indigo-300 border-indigo-800', dot: 'bg-indigo-400' },
  AWAITING_APPROVAL: { label: 'Awaiting Approval', color: 'bg-amber-950 text-amber-300 border-amber-700', dot: 'bg-amber-400' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-950 text-emerald-300 border-emerald-800', dot: 'bg-emerald-400' },
  REJECTED: { label: 'Rejected', color: 'bg-red-950 text-red-300 border-red-800', dot: 'bg-red-400' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-950 text-emerald-300 border-emerald-800', dot: 'bg-emerald-400' },
  FAILED: { label: 'Failed', color: 'bg-red-950 text-red-400 border-red-800', dot: 'bg-red-400' },
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const isAnimating = status === 'INVESTIGATING' || status === 'PENDING'
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${cfg.color} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isAnimating ? 'dot-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}
