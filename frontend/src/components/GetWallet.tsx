import { useState } from 'react'
import { api } from '../api'
import { Wallet } from '../types'
import Alert from './Alert'
import Loader from './Loader'

export default function GetWallet() {
  const [walletId, setWalletId] = useState('')
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGet() {
    if (!walletId.trim()) return
    setLoading(true)
    setError(null)
    setWallet(null)
    try {
      const result = await api.getWallet(walletId.trim()) as Wallet
      setWallet(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card space-y-4">
      <p className="section-title">02 · Get Wallet</p>

      <div>
        <label className="label">Wallet ID</label>
        <input
          className="input-field"
          placeholder="Enter wallet ID"
          value={walletId}
          onChange={e => setWalletId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGet()}
          disabled={loading}
        />
      </div>

      <button
        className="btn-primary w-full"
        onClick={handleGet}
        disabled={loading || !walletId.trim()}
      >
        {loading ? <Loader /> : 'Get Wallet'}
      </button>

      {error && <Alert type="error" message={error} />}

      {wallet && (
        <div className="fade-in rounded-lg bg-ink-800 border border-ink-600 divide-y divide-ink-700">
          {[
            { label: 'ID', value: wallet.id },
            { label: 'Name', value: wallet.name },
            {
              label: 'Balance',
              value: wallet.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
              highlight: wallet.balance >= 0,
            },
            ...(wallet.created_at ? [{ label: 'Created', value: new Date(wallet.created_at).toLocaleString() }] : []),
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-ink-400 uppercase tracking-wider">{row.label}</span>
              <span
                className={`font-mono text-sm truncate max-w-[200px] ${
                  'highlight' in row
                    ? row.highlight
                      ? 'text-jade-400 font-semibold'
                      : 'text-ember-400 font-semibold'
                    : 'text-ink-200'
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
