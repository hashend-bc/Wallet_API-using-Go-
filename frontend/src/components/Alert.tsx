interface AlertProps {
  type: 'success' | 'error'
  message: string
}

export default function Alert({ type, message }: AlertProps) {
  const isSuccess = type === 'success'
  return (
    <div
      className={`fade-in flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm font-mono border ${
        isSuccess
          ? 'bg-jade-600/10 border-jade-600/30 text-jade-400'
          : 'bg-ember-600/10 border-ember-600/30 text-ember-400'
      }`}
    >
      <span className="mt-0.5 shrink-0">{isSuccess ? '✓' : '✗'}</span>
      <span className="break-all">{message}</span>
    </div>
  )
}
