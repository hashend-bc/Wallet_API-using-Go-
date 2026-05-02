export interface Wallet {
  id: string
  name: string
  balance: number
  created_at?: string
}

export interface Transaction {
  id: string
  wallet_id: string
  type: 'credit' | 'debit'
  amount: number
  created_at?: string
  description?: string
}

export interface TransactionPayload {
  type: 'credit' | 'debit'
  amount: number
  description?: string
}

export interface ApiError {
  message: string
  status?: number
}
