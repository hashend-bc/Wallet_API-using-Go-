import { useState } from 'react'
import { api } from '../api'
import { TransactionPayload } from '../types'
import Alert from './Alert'
import Loader from './Loader'

export default function TransactionForm() {
  const [walletId, setWalletId] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'credit' | 'debit'>('credit')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!walletId.trim() || !amount) return
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number')
      return
    }

    setLoading(true)
    setSuccess(null)
    setError(null)

    const payload: TransactionPayload = { type, amount: parsedAmount }
    if (description.trim()) payload.description = description.trim()

    try {
      await api.addTransaction(walletId.trim(), payload)
      setSuccess(`${type === 'credit' ? 'Credit' : 'Debit'} of $${parsedAmount.toFixed(2)} applied successfully`)
      setAmount('')
      setDescription('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card space-y-4">
      <p className="section-title">03 · Add Transaction</p>

      <div>
        <label className="label">Wallet ID</label>
        <input
          className="input-field"
          placeholder="Enter wallet ID"
          value={walletId}
          onChange={e => setWalletId(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Amount</label>
          <input
            className="input-field"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label className="label">Type</label>
          <div className="flex rounded-lg border border-ink-600 overflow-hidden h-[42px]">
            {(['credit', 'debit'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                disabled={loading}
                className={`flex-1 text-sm font-mono font-medium transition-colors duration-150 ${
                  type === t
                    ? t === 'credit'
                      ? 'bg-jade-600/20 text-jade-400 border-jade-600/40'
                      : 'bg-ember-600/20 text-ember-400'
                    : 'bg-ink-800 text-ink-400 hover:text-ink-200'
                }`}
              >
                {t === 'credit' ? '+ credit' : '− debit'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="label">Description <span className="text-ink-500 normal-case tracking-normal">(optional)</span></label>
        <input
          className="input-field"
          placeholder="e.g. Monthly salary"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        className="btn-primary w-full"
        onClick={handleSubmit}
        disabled={loading || !walletId.trim() || !amount}
      >
        {loading ? <Loader /> : 'Submit Transaction'}
      </button>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
    </div>
  )
}
