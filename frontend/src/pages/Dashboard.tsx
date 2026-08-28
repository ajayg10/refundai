import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats, listRefundRequests, createRefundRequest } from '../services/api'
import type { DashboardStats, RefundRequest } from '../types'
import { DEMO_SCENARIOS } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { RiskBadge } from '../components/RiskBadge'
import {
  DollarSign, Shield, CheckCircle, XCircle,
  Search, Plus, ChevronRight, Clock, Zap
} from 'lucide-react'
import { format } from 'date-fns'

export function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [requests, setRequests] = useState<RefundRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ order_id: '', reason: '', requested_amount: '' })

  const fetchData = async () => {
    try {
      const [s, r] = await Promise.all([getDashboardStats(), listRefundRequests()])
      setStats(s)
      setRequests(r)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const iv = setInterval(fetchData, 5000)
    return () => clearInterval(iv)
  }, [])

  const fillDemo = (scenarioId: string) => {
    const s = DEMO_SCENARIOS.find(d => d.id === scenarioId)
    if (s) setForm({ order_id: s.orderId, reason: s.reason, requested_amount: s.requestedAmount })
  }

  const handleCreate = async () => {
    if (!form.order_id || !form.reason || !form.requested_amount) return
    setCreating(true)
    try {
      const rr = await createRefundRequest(form)
      setShowNew(false)
      setForm({ order_id: '', reason: '', requested_amount: '' })
      navigate(`/investigation/${rr.id}`)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to create request')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-5 flex items-center justify-between glass sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(214,168,79,0.08)] border border-[rgba(214,168,79,0.2)] flex items-center justify-center">
            <Shield className="text-[#D6A84F]" size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">RefundGuard</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI Refund Decision Agent</p>
          </div>
        </div>
        <button
          id="btn-new-request"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F2EFE8] hover:bg-white text-[#080808] text-sm font-semibold transition-all shadow-lg shadow-black/40"
        >
          <Plus size={16} />
          New Request
        </button>
      </header>

      <main className="px-8 py-8 max-w-6xl mx-auto space-y-8">
        {/* Hero */}
        <div>
          <h2 className="text-3xl font-extrabold gradient-text">Refund Dashboard</h2>
          <p className="text-slate-400 mt-1">AI-powered investigation with human approval control</p>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Requests', value: stats.total_requests, icon: Search, color: 'text-[#8A8780]' },
              { label: 'Investigating', value: stats.investigating, icon: Zap, color: 'text-[#8A8780]' },
              { label: 'Awaiting Approval', value: stats.pending_approval, icon: Clock, color: 'text-[#D6A84F]' },
              { label: 'Completed', value: stats.completed_refunds, icon: CheckCircle, color: 'text-[#86d4a5]' },
              { label: 'Rejected', value: stats.rejected_requests, icon: XCircle, color: 'text-[#e88c8c]' },
              { label: 'Total Refunded', value: `$${parseFloat(stats.total_refunded).toFixed(0)}`, icon: DollarSign, color: 'text-[#86d4a5]' },
            ].map(card => {
              const Icon = card.icon
              return (
                <div key={card.label} className="glass rounded-2xl p-4 border border-slate-800 animate-fade-in">
                  <Icon className={`mb-2 ${card.color}`} size={18} />
                  <div className="text-2xl font-bold text-white">{card.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Requests table */}
        <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white">Refund Requests</h3>
            {loading && <div className="w-4 h-4 border-2 border-[#8A8780] border-t-transparent rounded-full animate-spin" />}
          </div>
          <div className="divide-y divide-slate-800">
            {requests.length === 0 && !loading ? (
              <div className="text-center py-12 text-slate-500">
                <Shield className="mx-auto mb-3 opacity-30" size={32} />
                <p>No refund requests yet.</p>
                <button
                  onClick={() => setShowNew(true)}
                  className="mt-3 text-[#D6A84F] text-sm hover:text-[#C99A3D]"
                >
                  Create your first request →
                </button>
              </div>
            ) : (
              requests.map(rr => (
                <div
                  key={rr.id}
                  id={`row-${rr.id}`}
                  onClick={() => navigate(`/investigation/${rr.id}`)}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-slate-800/40 cursor-pointer transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{rr.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-sm text-slate-400">{rr.order_id}</span>
                      {rr.order?.customer && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-sm text-slate-400">{rr.order.customer.name}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{rr.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {rr.risk_level && <RiskBadge level={rr.risk_level} />}
                    <StatusBadge status={rr.status} />
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">
                        ${parseFloat(rr.requested_amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(rr.created_at), 'MMM d, HH:mm')}
                      </div>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={16} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* New Request Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl border border-slate-700 w-full max-w-lg p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-1">New Refund Request</h3>
            <p className="text-sm text-slate-400 mb-5">Submit a request — the AI agent will investigate immediately.</p>

            {/* Demo scenarios */}
            <div className="mb-5">
              <p className="text-xs text-slate-500 mb-2 font-medium">DEMO SCENARIOS</p>
              <div className="grid grid-cols-1 gap-1.5">
                {DEMO_SCENARIOS.map(s => (
                  <button
                    key={s.id}
                    id={`demo-${s.id}`}
                    onClick={() => fillDemo(s.id)}
                    className="text-left px-3 py-2 rounded-lg border border-slate-700 hover:border-[#D6A84F]/40 hover:bg-[#D6A84F]/5 transition-all text-xs"
                  >
                    <span className="font-medium text-slate-200">{s.label}</span>
                    <span className="text-slate-500 ml-2">{s.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Order ID</label>
                <input
                  id="input-order-id"
                  value={form.order_id}
                  onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
                  placeholder="ORD-1042"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D6A84F]/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Reason</label>
                <textarea
                  id="input-reason"
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Describe the reason for the refund..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D6A84F]/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Requested Amount ($)</label>
                <input
                  id="input-amount"
                  value={form.requested_amount}
                  onChange={e => setForm(f => ({ ...f, requested_amount: e.target.value }))}
                  placeholder="149.00"
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D6A84F]/50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                id="btn-submit-request"
                onClick={handleCreate}
                disabled={creating || !form.order_id || !form.reason || !form.requested_amount}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6A84F] hover:bg-[#C99A3D] text-[#080808] text-sm font-semibold transition-all disabled:opacity-50"
              >
                {creating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Zap size={15} />
                )}
                Investigate with AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
