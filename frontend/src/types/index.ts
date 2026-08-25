// API types for RefundGuard frontend

export interface Customer {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Order {
  id: string
  customer_id: string
  product_name: string
  amount: string
  currency: string
  order_date: string
  status: string
  created_at: string
  customer?: Customer
}

export interface Payment {
  id: string
  order_id: string
  amount: string
  currency: string
  status: string
  payment_method: string
  payment_date: string
}

export interface Refund {
  id: string
  refund_request_id: string
  order_id: string
  amount: string
  currency: string
  status: string
  processed_at?: string
}

export type RefundStatus =
  | 'PENDING'
  | 'INVESTIGATING'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface RefundRequest {
  id: string
  order_id: string
  reason: string
  requested_amount: string
  status: RefundStatus
  risk_level?: RiskLevel
  recommended_amount?: string
  agent_summary?: string
  trueforge_session_id?: string
  created_at: string
  updated_at: string
  order?: Order
  refunds: Refund[]
}

export interface AuditLog {
  id: number
  refund_request_id?: string
  action: string
  actor: string
  details?: Record<string, unknown>
  created_at: string
}

export interface DashboardStats {
  total_requests: number
  pending_approval: number
  completed_refunds: number
  rejected_requests: number
  total_refunded: string
  investigating: number
}

// Demo scenarios for quick testing
export const DEMO_SCENARIOS = [
  {
    id: 'normal',
    label: '✅ Normal Eligible Refund',
    description: 'Damaged product, 7 days old → 100% refund',
    orderId: 'ORD-1042',
    reason: 'Product arrived damaged — headphone left cup is cracked',
    requestedAmount: '149.00',
  },
  {
    id: 'expired',
    label: '⏰ Expired Refund Window',
    description: 'Changed mind, 90 days old → rejected',
    orderId: 'ORD-1043',
    reason: 'Changed my mind, no longer want this speaker',
    requestedAmount: '299.00',
  },
  {
    id: 'partial',
    label: '💰 Partial Refund',
    description: 'Damaged product, 45 days old → 50% refund',
    orderId: 'ORD-1044',
    reason: 'Keyboard arrived with damaged spacebar',
    requestedAmount: '200.00',
  },
  {
    id: 'already-refunded',
    label: '🔄 Already Refunded',
    description: 'Order already fully refunded → blocked',
    orderId: 'ORD-1045',
    reason: 'Need another refund for the same order',
    requestedAmount: '100.00',
  },
  {
    id: 'suspicious',
    label: '🚨 Suspicious Request',
    description: 'Amount exceeds order total → HIGH RISK',
    orderId: 'ORD-1046',
    reason: 'Wrong item received',
    requestedAmount: '500.00',
  },
]
