import CreateWallet from './components/CreateWallet'
import GetWallet from './components/GetWallet'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950">
      {/* Header */}
      <header className="border-b border-ink-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-ink-950/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-ember-500 flex items-center justify-center">
            <span className="text-white font-mono text-xs font-bold">W</span>
          </div>
          <span className="font-mono font-semibold text-ink-100 tracking-tight">WalletAPI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-jade-500 animate-pulse" />
          <span className="text-xs font-mono text-ink-400">localhost:8080</span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-mono text-2xl font-semibold text-ink-100">Dashboard</h1>
          <p className="text-ink-400 text-sm mt-1">Manage wallets and transactions via REST API</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CreateWallet />
          <GetWallet />
          <TransactionForm />
          <TransactionList />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-800 mt-12 px-6 py-4 text-center">
        <span className="text-xs font-mono text-ink-600">
          Wallet API · POST /wallets · GET /wallets/:id · POST /wallets/:id/transactions
        </span>
      </footer>
    </div>
  )
}
