import { computed, ref } from 'vue'

const TOKEN_KEY = 'edyn-admin-token'
const REFRESH_TOKEN_KEY = 'edyn-admin-refresh-token'
const PROFILE_KEY = 'edyn-admin-profile'

const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const profile = ref(readStoredProfile())
let validatedToken = ''

function apiUrl() {
  return (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
}

function demoModeEnabled() {
  return import.meta.env.DEV && import.meta.env.VITE_ADMIN_DEMO_MODE === 'true'
}

function isUsableToken(value) {
  if (!value || ['undefined', 'null'].includes(value)) return false
  return value !== 'edyn-development-session' || demoModeEnabled()
}

function readStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
  } catch {
    return null
  }
}

function saveSession(accessToken, admin, refreshToken = '') {
  token.value = accessToken
  profile.value = admin
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(PROFILE_KEY, JSON.stringify(admin))
}

function clearSession() {
  token.value = ''
  profile.value = null
  validatedToken = ''
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(PROFILE_KEY)
}

if (!isUsableToken(token.value)) clearSession()

export function isAdminAuthenticated() {
  return isUsableToken(localStorage.getItem(TOKEN_KEY) || '')
}

async function refreshAdminSession() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || ''
  if (!refreshToken) return false

  const response = await fetch(`${apiUrl()}/api/v1/admin/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.data?.accessToken) return false

  saveSession(payload.data.accessToken, payload.data.admin, payload.data.refreshToken)
  validatedToken = payload.data.accessToken
  return true
}

export async function ensureAdminAuthenticated() {
  const accessToken = localStorage.getItem(TOKEN_KEY) || ''
  if (!isUsableToken(accessToken)) {
    clearSession()
    return false
  }
  if (accessToken === 'edyn-development-session' || validatedToken === accessToken) return true

  try {
    const response = await fetch(`${apiUrl()}/api/v1/admin/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (response.ok) {
      const payload = await response.json().catch(() => ({}))
      if (payload.data?.admin) {
        profile.value = payload.data.admin
        localStorage.setItem(PROFILE_KEY, JSON.stringify(payload.data.admin))
      }
      validatedToken = accessToken
      return true
    }
    if (response.status === 401 && await refreshAdminSession()) return true
  } catch {
    // A disconnected API is not an authenticated session.
  }

  clearSession()
  return false
}

export async function authorizedAdminFetch(input, options = {}) {
  async function send(accessToken) {
    const headers = new Headers(options.headers || {})
    headers.set('Authorization', `Bearer ${accessToken}`)
    return fetch(input, { ...options, headers })
  }

  let response = await send(localStorage.getItem(TOKEN_KEY) || '')
  if (response.status === 401 && await refreshAdminSession()) {
    response = await send(localStorage.getItem(TOKEN_KEY) || '')
  }
  if (response.status === 401 || response.status === 403) clearSession()
  return response
}

export function useAdminAuth() {
  const isAuthenticated = computed(() => Boolean(token.value))

  async function signIn(credentials) {
    const demoMode = demoModeEnabled()

    if (demoMode) {
      if (!credentials.email.includes('@') || credentials.password.length < 6) {
        throw new Error('Enter a valid email and a password of at least 6 characters.')
      }

      saveSession('edyn-development-session', {
        name: 'Edyn Administrator',
        email: credentials.email,
        role: 'Administrator',
      })
      return
    }

    clearSession()
    const response = await fetch(`${apiUrl()}/api/v1/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Unable to sign in. Check your credentials and try again.')
    }

    const session = data.data || data
    saveSession(session.accessToken, session.admin, session.refreshToken)
    validatedToken = session.accessToken
  }

  function signOut() {
    clearSession()
  }

  return { isAuthenticated, profile, signIn, signOut }
}
