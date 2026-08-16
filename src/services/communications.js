const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function post(path, body) {
  const response = await fetch(`${apiUrl}/api/v1/communications${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error?.message || 'Your submission could not be completed.')
  return payload.data
}

export function sendContactMessage(form) {
  return post('/contact', { ...form, website: '' })
}

export function subscribeToNewsletter({ name, email, source }) {
  return post('/newsletter/subscribe', { name, email, source, website: '' })
}
