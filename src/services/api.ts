const TOKEN_KEY = 'beledition_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get()
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (res.status === 401) tokenStore.clear()

  if (!res.ok) {
    const body = await res.json().catch(() => null) // ProblemDetails { title, detail }
    throw new ApiError(res.status, body?.detail ?? body?.title ?? 'Erreur inattendue.')
  }

  return res.status === 204 ? (undefined as T) : res.json()
}
