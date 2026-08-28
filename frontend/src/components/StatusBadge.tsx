import type { RefundStatus } from '../types'

interface Props {
  status: RefundStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<RefundStatus, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'bg-[#111111] text-[#8A8780] border-[#252525]', dot: 'bg-[#65635E]' },
  INVESTIGATING: { label: 'Investigating', color: 'bg-[#151515] text-[#F2EFE8] border-[#252525]', dot: 'bg-[#8A8780]' },
  AWAITING_APPROVAL: { label: 'Awaiting Approval', color: 'bg-[rgba(214,168,79,0.08)] text-[#D6A84F] border-[rgba(214,168,79,0.2)]', dot: 'bg-[#D6A84F]' },
  APPROVED: { label: 'Approved', color: 'bg-[rgba(45,90,60,0.15)] text-[#86d4a5] border-[rgba(45,90,60,0.3)]', dot: 'bg-[#2d5a3c]' },
  REJECTED: { label: 'Rejected', color: 'bg-[rgba(97,44,44,0.15)] text-[#e88c8c] border-[rgba(97,44,44,0.3)]', dot: 'bg-[#612c2c]' },
  COMPLETED: { label: 'Completed', color: 'bg-[rgba(45,90,60,0.15)] text-[#86d4a5] border-[rgba(45,90,60,0.3)]', dot: 'bg-[#2d5a3c]' },
  FAILED: { label: 'Failed', color: 'bg-[rgba(97,44,44,0.15)] text-[#e88c8c] border-[rgba(97,44,44,0.3)]', dot: 'bg-[#612c2c]' },
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
