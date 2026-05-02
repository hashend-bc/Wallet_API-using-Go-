const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body.message ?? body.error ?? message
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

export const api = {
  createWallet: (name: string) =>
    request('/wallets', { method: 'POST', body: JSON.stringify({ name }) }),

  getWallet: (id: string) =>
    request(`/wallets/${id}`),

  addTransaction: (walletId: string, payload: object) =>
    request(`/wallets/${walletId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTransactions: (walletId: string, limit = 10, offset = 0) =>
    request(`/wallets/${walletId}/transactions?limit=${limit}&offset=${offset}`),
}
