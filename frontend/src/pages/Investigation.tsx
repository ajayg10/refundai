import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRefundRequest, getActivity } from '../services/api'
import type { RefundRequest, AuditLog } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { RiskBadge } from '../components/RiskBadge'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { ApprovalPanel } from '../components/ApprovalPanel'
import {
  ArrowLeft, Shield, Package, User, CreditCard,
  Calendar, DollarSign, Cpu
} from 'lucide-react'
import { format } from 'date-fns'

const LIVE_STATUSES = ['PENDING', 'INVESTIGATING']

export function Investigation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, setRequest] = useState<RefundRequest | null>(null)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!id) return
    try {
      const [rr, activity] = await Promise.all([
        getRefundRequest(id),
        getActivity(id),
      ])
      setRequest(rr)
      setLogs(activity)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAll()
    const iv = setInterval(() => {
      if (request && LIVE_STATUSES.includes(request.status)) {
        fetchAll()
      }
    }, 3000)
    return () => clearInterval(iv)
  }, [fetchAll, request?.status])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8A8780] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#8A8780] text-sm">Loading investigation...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <p className="text-red-400">Refund request not found.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-[#D6A84F] text-sm">← Back to dashboard</button>
        </div>
      </div>
    )
  }

  const isLive = LIVE_STATUSES.includes(request.status)
  const order = request.order
  const customer = order?.customer

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-5 flex items-center gap-4 glass sticky top-0 z-10">
        <button
          id="btn-back"
          onClick={() => navigate('/dashboard')}
          className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center hover:border-slate-500 transition-all text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[rgba(214,168,79,0.08)] border border-[rgba(214,168,79,0.2)] flex items-center justify-center">
            <Shield className="text-[#D6A84F]" size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">Investigation — {request.id}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{request.order_id}</p>
          </div>
        </div>
        <StatusBadge status={request.status} size="md" />
      </header>

      <main className="px-8 py-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Case details + approval */}
        <div className="lg:col-span-1 space-y-4">
          {/* Case details */}
          <div className="glass rounded-2xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Case Details</h3>
            <div className="space-y-3">
              {customer && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={13} className="text-[#8A8780]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Customer</div>
                    <div className="text-sm font-medium text-white">{customer.name}</div>
                    <div className="text-xs text-slate-400">{customer.email}</div>
                  </div>
                </div>
              )}
              {order && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package size={13} className="text-[#8A8780]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Product</div>
                    <div className="text-sm font-medium text-white">{order.product_name}</div>
                    <div className="text-xs text-slate-400">${parseFloat(order.amount).toFixed(2)} · {order.status}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign size={13} className="text-[#86d4a5]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Requested / Recommended</div>
                  <div className="text-sm font-medium text-white">
                    ${parseFloat(request.requested_amount).toFixed(2)}
                    {request.recommended_amount && (
                      <span className="text-[#86d4a5] ml-2">
                        → ${parseFloat(request.recommended_amount).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {request.risk_level && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield size={13} className="text-[#8A8780]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Risk Level</div>
                    <RiskBadge level={request.risk_level} />
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar size={13} className="text-slate-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Created</div>
                  <div className="text-sm text-slate-300">{format(new Date(request.created_at), 'MMM d, yyyy HH:mm')}</div>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-500 mb-2">Refund Reason</div>
              <p className="text-sm text-slate-300 leading-relaxed">{request.reason}</p>
            </div>
          </div>

          {/* Sandbox indicator */}
          {isLive && (
            <div className="glass rounded-2xl border border-[#2A2A2A] p-4 flex items-center gap-3 animate-fade-in bg-[#111111]">
              <div className="w-8 h-8 rounded-full bg-[rgba(214,168,79,0.08)] border border-[rgba(214,168,79,0.2)] flex items-center justify-center">
                <Cpu className="text-[#D6A84F]" size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-[#F2EFE8]">Agent Investigating</div>
                <div className="text-xs text-[#8A8780]">TrueForge sandbox running...</div>
              </div>
              <div className="ml-auto w-4 h-4 border-2 border-[#8A8780] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Approval panel */}
          {request.status === 'AWAITING_APPROVAL' && (
            <div className="animate-fade-in">
              <ApprovalPanel request={request} onDecision={fetchAll} />
            </div>
          )}

          {/* Completed refund info */}
          {request.status === 'COMPLETED' && request.refunds.length > 0 && (
            <div className="glass rounded-2xl border border-[rgba(45,90,60,0.3)] bg-[rgba(45,90,60,0.08)] p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="text-[#86d4a5]" size={16} />
                <h3 className="text-sm font-semibold text-[#86d4a5]">Refund Processed</h3>
              </div>
              {request.refunds.map(r => (
                <div key={r.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A8780]">Transaction ID</span>
                    <span className="text-white font-mono text-xs">{r.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A8780]">Amount</span>
                    <span className="text-[#86d4a5] font-bold">${parseFloat(r.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A8780]">Status</span>
                    <span className="text-[#86d4a5]">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agent summary */}
          {request.agent_summary && request.status !== 'AWAITING_APPROVAL' && (
            <div className="glass rounded-2xl border border-slate-800 p-5">
              <div className="text-xs text-slate-500 mb-2">Agent Summary</div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {request.agent_summary}
              </p>
            </div>
          )}
        </div>

        {/* Right column: Activity timeline */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Agent Activity</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {isLive && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6A84F] dot-pulse" />
                    Live
                  </>
                )}
                {request.trueforge_session_id && (
                  <span className="font-mono text-slate-600 ml-2">
                    {request.trueforge_session_id.slice(0, 12)}...
                  </span>
                )}
              </div>
            </div>
            <ActivityTimeline logs={logs} isLive={isLive} />
          </div>
        </div>
      </main>
    </div>
  )
}
