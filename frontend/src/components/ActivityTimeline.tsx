import { useEffect, useRef } from 'react'
import type { AuditLog } from '../types'
import { format } from 'date-fns'
import {
  Search, User, Package, CreditCard, History,
  FileText, Calculator, Clock, CheckCircle, XCircle,
  DollarSign, ClipboardList, Cpu, Zap,
} from 'lucide-react'

interface Props {
  logs: AuditLog[]
  isLive?: boolean
}

const ACTION_CONFIG: Record<string, { icon: typeof Search; color: string; label: string }> = {
  AGENT_INVESTIGATION_STARTED: { icon: Search, color: 'text-[#8A8780]', label: 'Investigation started' },
  CUSTOMER_RETRIEVED: { icon: User, color: 'text-[#8A8780]', label: 'Customer record retrieved' },
  ORDER_RETRIEVED: { icon: Package, color: 'text-[#8A8780]', label: 'Order details retrieved' },
  PAYMENT_VERIFIED: { icon: CreditCard, color: 'text-[#8A8780]', label: 'Payment verified' },
  HISTORY_CHECKED: { icon: History, color: 'text-[#8A8780]', label: 'Refund history checked' },
  POLICY_RETRIEVED: { icon: FileText, color: 'text-[#8A8780]', label: 'Policy retrieved' },
  REFUND_CALCULATED: { icon: Calculator, color: 'text-[#8A8780]', label: 'Refund calculated' },
  SANDBOX_EXECUTION_STARTED: { icon: Cpu, color: 'text-[#D6A84F]', label: 'Sandbox execution started' },
  SANDBOX_EXECUTION_COMPLETED: { icon: Zap, color: 'text-[#D6A84F]', label: 'Sandbox execution complete' },
  AWAITING_HUMAN_APPROVAL: { icon: Clock, color: 'text-[#D6A84F]', label: 'Awaiting human approval' },
  REFUND_APPROVED: { icon: CheckCircle, color: 'text-[#86d4a5]', label: 'Refund approved by human' },
  REFUND_REJECTED: { icon: XCircle, color: 'text-[#e88c8c]', label: 'Refund rejected by human' },
  REFUND_PROCESSED: { icon: DollarSign, color: 'text-[#86d4a5]', label: 'Refund processed' },
  REFUND_FAILED: { icon: XCircle, color: 'text-[#e88c8c]', label: 'Refund failed' },
  AUDIT_COMPLETED: { icon: ClipboardList, color: 'text-[#65635E]', label: 'Audit completed' },
}

function ActionIcon({ action }: { action: string }) {
  const cfg = ACTION_CONFIG[action]
  if (!cfg) return <div className="w-2 h-2 rounded-full bg-[#65635E] mt-1" />
  const Icon = cfg.icon

  return (
    <div className={`w-7 h-7 rounded-full bg-[#151515] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
      <Icon size={14} />
    </div>
  )
}

export function ActivityTimeline({ logs, isLive }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLive && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs.length, isLive])

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-[#8A8780] text-sm">
        <Clock className="mx-auto mb-2 opacity-40" size={24} />
        Activity will appear here once the agent starts investigating.
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {logs.map((log, i) => {
        const cfg = ACTION_CONFIG[log.action]
        const isLast = i === logs.length - 1

        return (
          <div
            key={log.id}
            className="flex gap-3 animate-fade-in"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <ActionIcon action={log.action} />
              {!isLast && <div className="w-px flex-1 bg-[#242424] my-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-6">
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${cfg?.color || 'text-[#F2EFE8]'}`}>
                      {cfg?.label || log.action}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#8A8780] flex-shrink-0">
                  {format(new Date(log.created_at), 'HH:mm:ss')}
                </span>
              </div>
              <div className="text-xs text-[#8A8780]">
                <span className="capitalize">{log.actor}</span>
                {log.details && Object.keys(log.details).length > 0 && (
                  <span className="ml-2 text-[#65635E]">
                    {Object.entries(log.details)
                      .slice(0, 2)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
