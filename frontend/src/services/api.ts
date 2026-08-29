import axios from 'axios'
import type { RefundRequest, AuditLog, DashboardStats } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Refund Requests ──────────────────────────────────────────────────────

export const createRefundRequest = (data: {
  order_id: string
  reason: string
  requested_amount: string
}) => api.post<RefundRequest>('/refund-requests', data).then(r => r.data)

export const listRefundRequests = () =>
  api.get<RefundRequest[]>('/refund-requests').then(r => r.data)

export const getRefundRequest = (id: string) =>
  api.get<RefundRequest>(`/refund-requests/${id}`).then(r => r.data)

export const getActivity = (id: string) =>
  api.get<AuditLog[]>(`/refund-requests/${id}/activity`).then(r => r.data)

export const approveRefund = (id: string, approvedAmount?: string) =>
  api.post(`/refund-requests/${id}/approve`, {
    approved_amount: approvedAmount || undefined,
  }).then(r => r.data)

export const rejectRefund = (id: string, reason?: string) =>
  api.post(`/refund-requests/${id}/reject`, {
    reason: reason || 'Rejected by human reviewer',
  }).then(r => r.data)

// ── Dashboard ────────────────────────────────────────────────────────────

export const getDashboardStats = () =>
  api.get<DashboardStats>('/dashboard').then(r => r.data)
