import { computed, ref } from 'vue'

const TOKEN_KEY = 'edyn-admin-token'
const REFRESH_TOKEN_KEY = 'edyn-admin-refresh-token'
const PROFILE_KEY = 'edyn-admin-profile'

const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const profile = ref(readStoredProfile())

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

export function isAdminAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function useAdminAuth() {
  const isAuthenticated = computed(() => Boolean(token.value))

  async function signIn(credentials) {
    const demoMode = import.meta.env.DEV && import.meta.env.VITE_ADMIN_DEMO_MODE === 'true'

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

    const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
    const response = await fetch(`${apiUrl}/api/v1/admin/auth/login`, {
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
  }

  function signOut() {
    token.value = ''
    profile.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(PROFILE_KEY)
  }

  return { isAuthenticated, profile, signIn, signOut }
}
