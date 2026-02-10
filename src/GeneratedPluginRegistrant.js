export function register() {
  try {
    const analytics = require('analytics')
    if (analytics && typeof analytics.init === 'function') {
      analytics.init()
    }
  } catch (e) {
    console.error('Failed to initialize analytics:', e)
  }
  try {
    const errorTracking = require('error-tracking')
    if (errorTracking && typeof errorTracking.setup === 'function') {
      errorTracking.setup()
    }
  } catch (e) {
    console.error('Failed to initialize error-tracking:', e)
  }
}