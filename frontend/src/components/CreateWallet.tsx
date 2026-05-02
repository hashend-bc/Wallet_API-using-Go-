import { useState } from 'react'
import { api } from '../api'
import { Wallet } from '../types'
import Alert from './Alert'
import Loader from './Loader'

export default function CreateWallet() {
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    setWallet(null)
    try {
      const result = await api.createWallet(name.trim()) as Wallet
      setWallet(result)
      setName('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function copyId() {
    if (!wallet) return
    navigator.clipboard.writeText(wallet.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="card space-y-4">
      <p className="section-title">01 · Create Wallet</p>

      <div>
        <label className="label">Wallet Name</label>
        <input
          className="input-field"
          placeholder="e.g. Main Account"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          disabled={loading}
        />
      </div>

      <button
        className="btn-primary w-full"
        onClick={handleCreate}
        disabled={loading || !name.trim()}
      >
        {loading ? <Loader /> : 'Create Wallet'}
      </button>

      {error && <Alert type="error" message={error} />}

      {wallet && (
        <div className="fade-in rounded-lg bg-ink-800 border border-ink-600 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 uppercase tracking-widest">Wallet Created</span>
            <span className="text-xs text-jade-400 font-mono">✓ success</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-400">ID</span>
              <div className="flex items-center gap-2">
                <span className="mono-value text-ink-200 truncate max-w-[160px]">{wallet.id}</span>
                <button
                  onClick={copyId}
                  className="text-xs text-ink-400 hover:text-ember-400 transition-colors font-mono border border-ink-600 hover:border-ember-500 rounded px-2 py-0.5"
                >
                  {copied ? 'copied!' : 'copy'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-400">Name</span>
              <span className="mono-value">{wallet.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-400">Balance</span>
              <span className="font-mono font-semibold text-jade-400">
                {wallet.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
