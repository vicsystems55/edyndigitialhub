const pixelId = String(import.meta.env.VITE_META_PIXEL_ID || '1104299925363491').trim()
let initialized = false

function installPixelQueue() {
  if (window.fbq) return
  const fbq = function (...args) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  }
  window.fbq = fbq
  window._fbq = fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
}

export function initializeMetaPixel() {
  if (initialized || !pixelId || typeof window === 'undefined') return Boolean(initialized)
  installPixelQueue()
  window.fbq('init', pixelId)
  initialized = true
  return true
}

export function trackMetaEvent(eventName, parameters = {}, options) {
  if (!initializeMetaPixel()) return
  if (options) window.fbq('track', eventName, parameters, options)
  else window.fbq('track', eventName, parameters)
}

export function trackMetaPageView() {
  trackMetaEvent('PageView')
}

export function trackMetaPurchaseOnce(reference, parameters) {
  if (!reference || typeof window === 'undefined') return
  const storageKey = `edyn-meta-purchase-${reference}`
  if (window.localStorage.getItem(storageKey)) return
  trackMetaEvent('Purchase', parameters, { eventID: `purchase_${reference}` })
  window.localStorage.setItem(storageKey, new Date().toISOString())
}
