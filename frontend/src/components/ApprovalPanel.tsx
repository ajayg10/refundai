import { useState } from 'react'
import type { RefundRequest } from '../types'
import { RiskBadge } from './RiskBadge'
import { approveRefund, rejectRefund } from '../services/api'
import { CheckCircle, XCircle, ShieldAlert, DollarSign, AlertTriangle } from 'lucide-react'

interface Props {
  request: RefundRequest
  onDecision: () => void
}

export function ApprovalPanel({ request, onDecision }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  const recommendedAmount = request.recommended_amount
    ? parseFloat(request.recommended_amount).toFixed(2)
    : parseFloat(request.requested_amount).toFixed(2)

  const handleApprove = async () => {
    setLoading(true)
    setError(null)
    try {
      await approveRefund(request.id, recommendedAmount)
      onDecision()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Approval failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setLoading(true)
    setError(null)
    try {
      await rejectRefund(request.id, rejectReason)
      onDecision()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Rejection failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-amber-700/50 bg-gradient-to-br from-amber-950/40 to-orange-950/20 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-900/50 border border-amber-700 flex items-center justify-center">
          <ShieldAlert className="text-amber-400" size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-amber-300">Human Approval Required</h3>
          <p className="text-xs text-amber-600">Review the agent's recommendation before authorizing</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Order</div>
          <div className="text-sm font-medium text-white">{request.order_id}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {request.order?.product_name}
          </div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Customer</div>
          <div className="text-sm font-medium text-white">{request.order?.customer?.name || '—'}</div>
          <div className="text-xs text-slate-400 mt-0.5">{request.order?.customer?.email}</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Order Total</div>
          <div className="text-sm font-semibold text-white">
            ${parseFloat(request.order?.amount || '0').toFixed(2)}
          </div>
        </div>
        <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-800/50">
          <div className="text-xs text-emerald-600 mb-1">Recommended Refund</div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
            <DollarSign size={16} />
            {recommendedAmount}
          </div>
        </div>
      </div>

      {/* Risk level */}
      {request.risk_level && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Risk assessment:</span>
          <RiskBadge level={request.risk_level} />
        </div>
      )}

      {/* Agent summary */}
      {request.agent_summary && (
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
            <ShieldAlert size={12} />
            Agent Recommendation
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {request.agent_summary}
          </p>
        </div>
      )}

      {/* High risk warning */}
      {request.risk_level === 'HIGH' && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/50">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-red-300">
            <strong>High-risk request detected.</strong> Please review carefully before approving.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Action buttons */}
      {!showReject ? (
        <div className="flex gap-3">
          <button
            id="btn-reject-toggle"
            onClick={() => setShowReject(true)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-800/60 text-red-400 text-sm font-medium hover:bg-red-950/40 transition-all disabled:opacity-50"
          >
            <XCircle size={16} />
            Reject
          </button>
          <button
            id="btn-approve"
            onClick={handleApprove}
            disabled={loading}
            className="flex-2 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            style={{ flex: 2 }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            Approve Refund — ${recommendedAmount}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            id="input-reject-reason"
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowReject(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-reject"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
