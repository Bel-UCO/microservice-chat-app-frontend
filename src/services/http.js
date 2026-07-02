import { env } from '../config/env.js'
import { clearAuthSession, readAuthToken } from '../utils/storage.js'

export class HttpError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

function getBaseUrl(api) {
  if (api === 'auth') return env.authApiBaseUrl
  return env.chatApiBaseUrl
}

function buildUrl(path, api) {
  if (path.startsWith('http')) return path

  const baseUrl = getBaseUrl(api).replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (response.status === 204) return null
  if (contentType.includes('application/json')) return response.json()

  return response.text()
}

async function request(path, options = {}) {
  const token = readAuthToken()
  const headers = new Headers(options.headers || {})
  const { api = 'chat', ...fetchOptions } = options

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path, api), {
    ...fetchOptions,
    headers,
    body:
      fetchOptions.body && !(fetchOptions.body instanceof FormData)
        ? JSON.stringify(fetchOptions.body)
        : fetchOptions.body,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    if (response.status === 401) clearAuthSession()

    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`

    throw new HttpError(message, { status: response.status, data })
  }

  return data
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
