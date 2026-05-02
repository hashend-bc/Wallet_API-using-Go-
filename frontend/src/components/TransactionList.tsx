import { useState } from 'react'
import { api } from '../api'
import { Transaction } from '../types'
import Alert from './Alert'
import Loader from './Loader'

const LIMIT = 10

export default function TransactionList() {
  const [walletId, setWalletId] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  async function load(newOffset: number) {
    if (!walletId.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await api.getTransactions(walletId.trim(), LIMIT, newOffset) as Transaction[]
      setTransactions(result)
      setOffset(newOffset)
      setHasMore(result.length === LIMIT)
      setLoaded(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleLoad() {
    setOffset(0)
    load(0)
  }

  const page = Math.floor(offset / LIMIT) + 1

  return (
    <div className="card space-y-4">
      <p className="section-title">04 · Transaction History</p>

      <div>
        <label className="label">Wallet ID</label>
        <input
          className="input-field"
          placeholder="Enter wallet ID"
          value={walletId}
          onChange={e => {
            setWalletId(e.target.value)
            setLoaded(false)
            setTransactions([])
          }}
          onKeyDown={e => e.key === 'Enter' && handleLoad()}
          disabled={loading}
        />
      </div>

      <button
        className="btn-primary w-full"
        onClick={handleLoad}
        disabled={loading || !walletId.trim()}
      >
        {loading ? <Loader /> : 'Load Transactions'}
      </button>

      {error && <Alert type="error" message={error} />}

      {loaded && !error && (
        <div className="fade-in space-y-2">
          {transactions.length === 0 ? (
            <p className="text-center text-ink-500 font-mono text-sm py-4">No transactions found</p>
          ) : (
            <>
              <div className="space-y-1.5">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg bg-ink-800 border border-ink-700 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          tx.type === 'credit'
                            ? 'bg-jade-600/20 text-jade-400'
                            : 'bg-ember-600/20 text-ember-400'
                        }`}
                      >
                        {tx.type === 'credit' ? '+' : '−'}
                      </span>
                      <div>
                        <span
                          className={`text-xs font-mono font-medium uppercase ${
                            tx.type === 'credit' ? 'text-jade-400' : 'text-ember-400'
                          }`}
                        >
                          {tx.type}
                        </span>
                        {tx.description && (
                          <p className="text-xs text-ink-400 mt-0.5">{tx.description}</p>
                        )}
                        {tx.created_at && (
                          <p className="text-xs text-ink-500 mt-0.5">
                            {new Date(tx.created_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-mono font-semibold text-sm ${
                        tx.type === 'credit' ? 'text-jade-400' : 'text-ember-400'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '−'}
                      {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-1">
                <button
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30"
                  onClick={() => load(offset - LIMIT)}
                  disabled={offset === 0 || loading}
                >
                  ← Prev
                </button>
                <span className="text-xs text-ink-500 font-mono">page {page}</span>
                <button
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30"
                  onClick={() => load(offset + LIMIT)}
                  disabled={!hasMore || loading}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
