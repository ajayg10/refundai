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
    <div className="rounded-2xl border border-[rgba(214,168,79,0.2)] bg-[rgba(214,168,79,0.05)] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[rgba(214,168,79,0.1)] border border-[rgba(214,168,79,0.3)] flex items-center justify-center">
          <ShieldAlert className="text-[#D6A84F]" size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#D6A84F]">Human Approval Required</h3>
          <p className="text-xs text-[#C99A3D]">Review the agent's recommendation before authorizing</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#111111] rounded-xl p-3 border border-[#2A2A2A]">
          <div className="text-xs text-[#8A8780] mb-1">Order</div>
          <div className="text-sm font-medium text-[#F2EFE8]">{request.order_id}</div>
          <div className="text-xs text-[#65635E] mt-0.5">
            {request.order?.product_name}
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-3 border border-[#2A2A2A]">
          <div className="text-xs text-[#8A8780] mb-1">Customer</div>
          <div className="text-sm font-medium text-[#F2EFE8]">{request.order?.customer?.name || '—'}</div>
          <div className="text-xs text-[#65635E] mt-0.5">{request.order?.customer?.email}</div>
        </div>
        <div className="bg-[#111111] rounded-xl p-3 border border-[#2A2A2A]">
          <div className="text-xs text-[#8A8780] mb-1">Order Total</div>
          <div className="text-sm font-semibold text-[#F2EFE8]">
            ${parseFloat(request.order?.amount || '0').toFixed(2)}
          </div>
        </div>
        <div className="bg-[rgba(45,90,60,0.1)] rounded-xl p-3 border border-[rgba(45,90,60,0.3)]">
          <div className="text-xs text-[#86d4a5] opacity-80 mb-1">Recommended Refund</div>
          <div className="text-lg font-bold text-[#86d4a5] flex items-center gap-1">
            <DollarSign size={16} />
            {recommendedAmount}
          </div>
        </div>
      </div>

      {/* Risk level */}
      {request.risk_level && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A8780]">Risk assessment:</span>
          <RiskBadge level={request.risk_level} />
        </div>
      )}

      {/* Agent summary */}
      {request.agent_summary && (
        <div className="bg-[#111111] rounded-xl p-4 border border-[#2A2A2A]">
          <div className="text-xs text-[#8A8780] mb-2 flex items-center gap-1">
            <ShieldAlert size={12} />
            Agent Recommendation
          </div>
          <p className="text-sm text-[#F2EFE8] leading-relaxed whitespace-pre-line">
            {request.agent_summary}
          </p>
        </div>
      )}

      {/* High risk warning */}
      {request.risk_level === 'HIGH' && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[rgba(97,44,44,0.15)] border border-[rgba(97,44,44,0.3)]">
          <AlertTriangle className="text-[#e88c8c] flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-[#e88c8c]">
            <strong>High-risk request detected.</strong> Please review carefully before approving.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-[rgba(97,44,44,0.15)] border border-[rgba(97,44,44,0.3)] text-sm text-[#e88c8c]">
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#242424] text-[#8A8780] text-sm font-medium hover:border-[rgba(97,44,44,0.5)] hover:text-[#e88c8c] hover:bg-[rgba(97,44,44,0.1)] transition-all disabled:opacity-50"
          >
            <XCircle size={16} />
            Reject
          </button>
          <button
            id="btn-approve"
            onClick={handleApprove}
            disabled={loading}
            className="flex-2 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D6A84F] hover:bg-[#C99A3D] text-[#080808] text-sm font-semibold transition-all shadow-lg shadow-black/40 disabled:opacity-50"
            style={{ flex: 2 }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F2EFE8] placeholder-[#65635E] focus:outline-none focus:border-[#e88c8c]/50 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowReject(false)}
              className="px-4 py-2.5 rounded-xl border border-[#2A2A2A] text-[#8A8780] text-sm hover:text-[#F2EFE8] transition-all"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-reject"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(97,44,44,0.3)] hover:bg-[rgba(97,44,44,0.5)] border border-[rgba(97,44,44,0.5)] text-[#e88c8c] text-sm font-semibold transition-all disabled:opacity-50"
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
